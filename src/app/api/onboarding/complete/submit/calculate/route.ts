// src/app/api/onboarding/calculate/route.ts

import { NextResponse } from 'next/server';
// 1. Importar las funciones de cálculo (asumiendo que se crearán en /lib/calculations)
import { calculateBMR } from '@/lib/calculations/bmr';
import { calculateTDEE } from '@/lib/calculations/tdee';
import { calculateMacros } from '@/lib/calculations/macros';
import { calculatePhases } from '@/lib/calculations/phases';
// 2. Importar el validador (asumiendo que se creará en /lib/onboarding/validator)
import { OnboardingCalculatorInputSchema } from '@/lib/onboarding/validator';
import { ZodError } from 'zod';

/**
 * Maneja la solicitud POST para calcular BMR, TDEE, Macros y Fases de entrenamiento
 * basados en los datos de biometría, objetivo y actividad.
 * @param request La solicitud HTTP entrante (contiene los datos del formulario).
 * @returns Un objeto JSON con los cálculos o un error.
 */
export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    // 3. VALIDACIÓN: Asegura que los datos sean correctos antes de calcular
    // El esquema de validación debe asegurar que los campos requeridos para el cálculo
    // (ej. age, gender, weight, activityLevel, targetTimeline, daysPerWeek) estén presentes.
    const validatedData = OnboardingCalculatorInputSchema.parse(rawData);

    const { biometrics, objective, activity, training } = validatedData;
    
    // 4. CÁLCULOS
    
    // BMR y TDEE
    const bmr = calculateBMR(biometrics.weight, biometrics.height, biometrics.age, biometrics.gender);
    const tdee = calculateTDEE(bmr, activity.dailyActivityLevel, training.daysPerWeek);
    
    // Calorías Objetivo (Asumimos que el targetCalories es igual al TDEE para 'performance' o 'maintain', 
    // y se ajusta para 'weightloss')
    const targetCalories = objective.primaryGoal === 'weightloss' ? tdee - 500 : tdee;

    // Distribución de Macros
    const macros = calculateMacros(targetCalories, biometrics.weight);

    // Fases del Plan de Entrenamiento
    const phases = calculatePhases(objective.targetTimeline, objective.hasCompetition);

    // 5. RESPUESTA DE ÉXITO
    return NextResponse.json({
      success: true,
      calculations: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        macros,
        phases,
      }
    }, { status: 200 });

  } catch (error) {
    if (error instanceof ZodError) {
      // Error de validación de datos
      return NextResponse.json({ 
        success: false, 
        error: "Datos de entrada incompletos o incorrectos.",
        details: error.flatten() 
      }, { status: 400 });
    }
    
    // Otros errores (ej. error en la función de cálculo)
    console.error("Error en el cálculo del Onboarding:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor durante el cálculo." 
    }, { status: 500 });
  }
}

// Nota: No se requiere exportar la función GET, pero Next.js espera un handler de método.
// Si se usa GET, se deben pasar los parámetros de cálculo en la URL (queryParams)
// lo cual es menos recomendable para datos complejos, por eso se utiliza POST.