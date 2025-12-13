//src/app/api/nutrition/daily-summary/route.ts
import { NextResponse } from 'next/server'
import NextAuth from 'next-auth';
import prisma  from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    // Parse date or use today
    const date = dateParam ? new Date(dateParam) : new Date()
    date.setHours(0, 0, 0, 0)

    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    // Get user profile for targets
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      )
    }

    // Get logs for the day
    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: date,
          lt: nextDay,
        },
      },
    })

    // Calculate consumed totals
    const consumed = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fats: acc.fats + log.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    // Calculate remaining
    const remaining = {
      calories: profile.targetCalories - consumed.calories,
      protein: profile.targetProtein - consumed.protein,
      carbs: profile.targetCarbs - consumed.carbs,
      fats: profile.targetFats - consumed.fats,
    }

    // Calculate progress percentages
    const progress = {
      calories: (consumed.calories / profile.targetCalories) * 100,
      protein: (consumed.protein / profile.targetProtein) * 100,
      carbs: (consumed.carbs / profile.targetCarbs) * 100,
      fats: (consumed.fats / profile.targetFats) * 100,
    }

    // Get workout for the day
    const workout = await prisma.workout.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: date,
          lt: nextDay,
        },
      },
    })

    return NextResponse.json({
      date: date.toISOString(),
      targets: {
        calories: profile.targetCalories,
        protein: profile.targetProtein,
        carbs: profile.targetCarbs,
        fats: profile.targetFats,
      },
      consumed: {
        calories: Math.round(consumed.calories),
        protein: Math.round(consumed.protein),
        carbs: Math.round(consumed.carbs),
        fats: Math.round(consumed.fats),
      },
      remaining: {
        calories: Math.round(remaining.calories),
        protein: Math.round(remaining.protein),
        carbs: Math.round(remaining.carbs),
        fats: Math.round(remaining.fats),
      },
      progress: {
        calories: Math.round(progress.calories),
        protein: Math.round(progress.protein),
        carbs: Math.round(progress.carbs),
        fats: Math.round(progress.fats),
      },
      mealsLogged: logs.length,
      workout: workout ? {
        type: workout.type,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        completed: workout.completed,
      } : null,
    })
  } catch (error) {
    console.error('Error fetching daily summary:', error)
    return NextResponse.json(
      { error: 'Error al cargar el resumen diario' },
      { status: 500 }
    )
  }
}