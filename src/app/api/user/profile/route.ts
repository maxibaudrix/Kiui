
// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Esquema de validación del payload (debe ser el objeto completo del store)
const profileSchema = z.object({
  // Campos del store
  name: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string(),
  heightCm: z.number(),
  weightKg: z.number(),
  activityLevel: z.string(),
  goal: z.string(),
  weeklyTarget: z.number(),
  dietType: z.string(),
  allergens: z.string().optional(),
  restrictions: z.string().optional(),
  // Campos calculados
  bmr: z.number(),
  tdee: z.number(),
  targetCalories: z.number(),
  proteinGrams: z.number(),
  carbGrams: z.number(),
  fatGrams: z.number(),
});

/**
 * POST /api/user/profile
 * Guarda el perfil completo del usuario en Firestore (Fase 6) o lo actualiza.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // 1. Validar datos
    const validation = profileSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const validatedData = validation.data;

    // TODO: En la FASE 6, aquí se agregará la lógica de guardar en Firestore:
    // 1. Obtener el ID del usuario autenticado (si hay) o crear uno temporal.
    // 2. Llamar a una función de la librería (ej: saveUserProfile(userId, validatedData)).
    
    console.log('API POST - Datos de perfil recibidos y validados:', validatedData.name, validatedData.targetCalories);

    return NextResponse.json({ 
        success: true, 
        message: 'Perfil guardado (simulado)',
        data: { targetCalories: validatedData.targetCalories } // Devolver algo útil
    }, { status: 200 });

  } catch (error) {
    console.error('Error en /api/user/profile:', error);
    return NextResponse.json({ success: false, error: { message: 'Internal Server Error' } }, { status: 500 });
  }
}
        