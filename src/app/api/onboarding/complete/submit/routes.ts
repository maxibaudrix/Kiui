import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { transformOnboardingData } from '@/lib/onboarding/transformer';
import { generateTrainingPlan } from '@/lib/ai/generate-training';
import { generateNutritionPlan } from '@/lib/ai/generate-nutrition';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.json();
    
    // 1. Transformar datos
    const onboardingOutput = transformOnboardingData(formData);
    
    // 2. Guardar en BD
    await prisma.onboardingData.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        data: onboardingOutput,
        status: 'completed'
      },
      update: {
        data: onboardingOutput,
        updatedAt: new Date()
      }
    });
    
    // 3. Generar planes con AI (async)
    const [trainingPlan, nutritionPlan] = await Promise.all([
      generateTrainingPlan(onboardingOutput),
      generateNutritionPlan(onboardingOutput)
    ]);
    
    // 4. Guardar planes generados
    await prisma.generatedPlan.create({
      data: {
        userId: session.user.id,
        planType: 'complete',
        startDate: new Date(),
        endDate: new Date(Date.now() + onboardingOutput.objective.targetTimeline * 7 * 24 * 60 * 60 * 1000),
        planData: { training: trainingPlan, nutrition: nutritionPlan }
      }
    });
    
    return NextResponse.json({ 
      success: true,
      planId: generatedPlan.id 
    });
    
  } catch (error) {
    logger.error('Onboarding submission error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}