import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { buildUserPlanningContext } from '@/lib/planning/buildUserPlanningContext';
import { generateCompletePlan } from '@/lib/ai/generateCompletePlan';
import { persistPlan } from '@/lib/planning/persistPlan';

/**
 * POST /api/planning/init
 * 
 * Inicializa el plan completo del usuario:
 * 1. Valida datos del onboarding
 * 2. Construye UserPlanningContext
 * 3. Llama a AI para generar plan
 * 4. Persiste en base de datos
 * 5. Retorna success + redirect
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Obtener datos del body
    const onboardingData = await req.json();

    // 3. Validación de datos obligatorios
    if (!onboardingData.startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      );
    }

    if (!onboardingData.biometrics || !onboardingData.objective) {
      return NextResponse.json(
        { error: 'Incomplete onboarding data' },
        { status: 400 }
      );
    }

    console.log(`[Planning Init] Starting for user ${userId}`);

    // 4. Construir contexto limpio
    const userContext = buildUserPlanningContext(
      onboardingData,
      userId,
      'es'
    );

    console.log('[Planning Init] Context built successfully');

    // 5. Verificar si ya existe un plan activo
    const existingPlan = await prisma.weeklyPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existingPlan) {
      console.log('[Planning Init] User already has an active plan');
      return NextResponse.json(
        { 
          error: 'Active plan already exists',
          planId: existingPlan.id,
          redirectTo: '/dashboard'
        },
        { status: 409 }
      );
    }

    // 6. Generar plan con AI (puede tardar 30-60s)
    console.log('[Planning Init] Calling AI to generate plan...');
    const planOutput = await generateCompletePlan(userContext);
    console.log('[Planning Init] AI plan generated successfully');

    // 7. Persistir plan en base de datos
    console.log('[Planning Init] Persisting plan to database...');
    await persistPlan(userContext, planOutput);
    console.log('[Planning Init] Plan persisted successfully');

    // 8. Log de éxito
    await prisma.aIGenerationLog.create({
      data: {
        userId,
        requestType: 'training_plan',
        promptTokens: 0, // Placeholder - Google AI no expone estos datos fácilmente
        responseData: JSON.stringify({ totalWeeks: planOutput.totalWeeks }),
        completionTokens: 0,
        durationMs: 0,
        success: true,
      },
    });

    console.log(`[Planning Init] Completed successfully for user ${userId}`);

    // 9. Retornar éxito
    return NextResponse.json({
      success: true,
      message: 'Plan generated successfully',
      data: {
        totalWeeks: planOutput.totalWeeks,
        startDate: planOutput.startDate,
        endDate: planOutput.endDate,
      },
      redirectTo: '/dashboard',
    });

  } catch (error: any) {
    console.error('[Planning Init] Error:', error);

    // Log error
    try {
      const session = await auth();
      if (session?.user?.id) {
        await prisma.aIGenerationLog.create({
          data: {
            userId: session.user.id,
            requestType: 'training_plan',
            promptTokens: 0,
            responseData: '',
            completionTokens: 0,
            durationMs: 0,
            success: false,
            error: error.message,
          },
        });
      }
    } catch (logError) {
      console.error('[Planning Init] Failed to log error:', logError);
    }

    // Retornar error apropiado
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service configuration error' },
        { status: 500 }
      );
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate plan. Please try again.' },
      { status: 500 }
    );
  }
}