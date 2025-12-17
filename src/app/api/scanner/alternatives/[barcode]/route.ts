// src/  
import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // ⬅️ ¡CORRECCIÓN CLAVE! Importa 'auth' desde tu archivo de configuración
import prisma from '@/lib/prisma';
import { offClient } from '@/lib/openfoodfacts/client';

export async function GET(
  request: Request,
  { params }: { params: { barcode: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const barcode = params.barcode

    // Get original product
    const originalOFF = await offClient.getProduct(barcode)

    if (!originalOFF || !originalOFF.product) {
      return NextResponse.json(
        { error: 'Producto original no encontrado' },
        { status: 404 }
      )
    }

    const originalProduct = originalOFF.product

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    // Get alternatives from OFF
    const alternativesOFF = await offClient.getAlternatives(barcode, undefined, 20)

    // Process and score alternatives
    const processedAlternatives = alternativesOFF
      .map((alt) => {
        const product = alt.product

        const nutritionalData = {
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
          protein: product.nutriments?.['proteins_100g'] || 0,
          carbs: product.nutriments?.['carbohydrates_100g'] || 0,
          fats: product.nutriments?.['fat_100g'] || 0,
        }

        // Calculate improvement score
        const improvementScore = calculateImprovementScore(
          {
            calories: originalProduct.nutriments?.['energy-kcal_100g'] || 0,
            protein: originalProduct.nutriments?.['proteins_100g'] || 0,
            carbs: originalProduct.nutriments?.['carbohydrates_100g'] || 0,
            fats: originalProduct.nutriments?.['fat_100g'] || 0,
          },
          nutritionalData,
          originalProduct.nutriscore_grade,
          product.nutriscore_grade,
          originalProduct.nova_group,
          product.nova_group,
          userProfile
        )

        // Calculate verdict
        const verdict = calculateVerdict(
          nutritionalData,
          product.nutriscore_grade,
          product.nova_group,
          userProfile
        )

        // Determine what's better
        const betterIn: string[] = []
        const originalNutrition = {
          calories: originalProduct.nutriments?.['energy-kcal_100g'] || 0,
          protein: originalProduct.nutriments?.['proteins_100g'] || 0,
          carbs: originalProduct.nutriments?.['carbohydrates_100g'] || 0,
          fats: originalProduct.nutriments?.['fat_100g'] || 0,
        }

        if (nutritionalData.calories < originalNutrition.calories * 0.9) {
          betterIn.push('Menos calorías')
        }
        if (nutritionalData.protein > originalNutrition.protein * 1.1) {
          betterIn.push('Más proteína')
        }
        if (nutritionalData.carbs < originalNutrition.carbs * 0.9) {
          betterIn.push('Menos carbos')
        }
        if (nutritionalData.fats < originalNutrition.fats * 0.9) {
          betterIn.push('Menos grasas')
        }
        if (product.nutriscore_grade && originalProduct.nutriscore_grade) {
          if (product.nutriscore_grade < originalProduct.nutriscore_grade) {
            betterIn.push('Mejor Nutri-Score')
          }
        }
        if (product.nova_group && originalProduct.nova_group) {
          if (product.nova_group < originalProduct.nova_group) {
            betterIn.push('Menos procesado')
          }
        }

        return {
          barcode: alt.code,
          productName: product.product_name || 'Producto sin nombre',
          brand: product.brands,
          imageUrl: product.image_url,
          nutriScore: product.nutriscore_grade,
          novaGroup: product.nova_group,
          ...nutritionalData,
          verdict: verdict.verdict,
          improvementScore: Math.round(improvementScore),
          betterIn,
        }
      })
      .filter((alt) => alt.improvementScore > 0) // Only show improvements
      .sort((a, b) => b.improvementScore - a.improvementScore) // Sort by best improvement
      .slice(0, 10) // Top 10 alternatives

    return NextResponse.json({
      original: {
        barcode,
        productName: originalProduct.product_name || 'Producto sin nombre',
        brand: originalProduct.brands,
        nutriScore: originalProduct.nutriscore_grade,
        calories: originalProduct.nutriments?.['energy-kcal_100g'] || 0,
        protein: originalProduct.nutriments?.['proteins_100g'] || 0,
        carbs: originalProduct.nutriments?.['carbohydrates_100g'] || 0,
        fats: originalProduct.nutriments?.['fat_100g'] || 0,
      },
      alternatives: processedAlternatives,
    })
  } catch (error) {
    console.error('Error fetching alternatives:', error)
    return NextResponse.json(
      { error: 'Error al cargar alternativas' },
      { status: 500 }
    )
  }
}

function calculateImprovementScore(
  original: any,
  alternative: any,
  originalNutriScore?: string,
  altNutriScore?: string,
  originalNova?: number,
  altNova?: number,
  userProfile?: any
): number {
  let score = 50 // Base score

  // Calories comparison
  const caloriesDiff = ((original.calories - alternative.calories) / original.calories) * 100
  if (userProfile?.goal === 'cut' || userProfile?.goal === 'maintain') {
    score += caloriesDiff * 0.5 // Weight more for cutting
  } else {
    score += caloriesDiff * 0.2
  }

  // Protein comparison
  const proteinDiff = ((alternative.protein - original.protein) / original.protein) * 100
  if (userProfile?.goal === 'bulk' || userProfile?.goal === 'clean_bulk') {
    score += proteinDiff * 0.8 // Weight more for bulking
  } else {
    score += proteinDiff * 0.3
  }

  // Carbs comparison (prefer lower for cutting)
  const carbsDiff = ((original.carbs - alternative.carbs) / original.carbs) * 100
  if (userProfile?.goal === 'cut') {
    score += carbsDiff * 0.3
  }

  // Fats comparison
  const fatsDiff = ((original.fats - alternative.fats) / original.fats) * 100
  score += fatsDiff * 0.2

  // Nutri-Score comparison
  if (originalNutriScore && altNutriScore) {
    const nutriScoreMap: { [key: string]: number } = { A: 5, B: 4, C: 3, D: 2, E: 1 }
    const originalScore = nutriScoreMap[originalNutriScore.toUpperCase()] || 3
    const altScore = nutriScoreMap[altNutriScore.toUpperCase()] || 3
    score += (altScore - originalScore) * 5
  }

  // NOVA comparison
  if (originalNova && altNova) {
    score += (originalNova - altNova) * 10
  }

  return Math.max(0, Math.min(100, score))
}

function calculateVerdict(
  nutritionalData: any,
  nutriScore?: string,
  novaGroup?: number,
  userProfile?: any
): {
  verdict: 'good' | 'warning' | 'bad'
  reason: string
  fitsUserGoal: boolean
} {
  let score = 0

  // Nutri-Score
  if (nutriScore) {
    switch (nutriScore.toUpperCase()) {
      case 'A': score += 2; break
      case 'B': score += 1; break
      case 'D': score -= 1; break
      case 'E': score -= 2; break
    }
  }

  // NOVA
  if (novaGroup) {
    if (novaGroup <= 2) score += 1
    else if (novaGroup === 4) score -= 2
  }

  // User goal
  if (userProfile) {
    if ((userProfile.goal === 'cut' || userProfile.goal === 'maintain') && nutritionalData.calories < 200) {
      score += 1
    }
    if ((userProfile.goal === 'bulk' || userProfile.goal === 'clean_bulk') && nutritionalData.protein > 15) {
      score += 2
    }
  }

  let verdict: 'good' | 'warning' | 'bad'
  if (score >= 2) verdict = 'good'
  else if (score >= -1) verdict = 'warning'
  else verdict = 'bad'

  return {
    verdict,
    reason: 'Basado en tu perfil nutricional',
    fitsUserGoal: score >= 0,
  }
}

function getServerSession(NextAuth: unknown) {
  throw new Error('Function not implemented.');
}
