'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboarding';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Calculator, Flame, Apple, Dumbbell, Bike, Activity } from 'lucide-react';

const PREV_PATH = '/onboarding/step-5-diet';

export default function Step6SummaryPage() {
  const router = useRouter();
  const { data } = useOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [calculatedMacros, setCalculatedMacros] = useState<{
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);

  // Calcular macros al cargar
  useEffect(() => {
    if (data.biometrics && data.goal && data.activity && data.training) {
      setCalculatedMacros(calculateMacros());
    }
  }, [data]);

  // ============================
  // NUEVA FUNCIÓN DE CÁLCULO REAL
  // ============================
  const calculateMacros = () => {
    const { age, gender, height, weight } = data.biometrics!;
    const { goalType, targetWeight, goalSpeed } = data.goal!;
    const activity = data.activity!;
    const training = data.training!;

    // ----------------------------
    // BMR (Mifflin-St Jeor)
    // ----------------------------
    let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'MALE' ? 5 : -161);
    bmr = Math.round(bmr);

    // ----------------------------
    // PAL combinado (actividad diaria + entrenamiento)
    // ----------------------------
    const PAL_BASE: Record<string, number> = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.35,
      MODERATELY_ACTIVE: 1.5,
      VERY_ACTIVE: 1.7,
      SUPER_ACTIVE: 1.9,
    };

    const PAL_TRAINING: Record<string, number> = {
      BEGINNER: 1.0,
      INTERMEDIATE: 1.05,
      ADVANCED: 1.10,
    };

    const TDEE = Math.round(bmr * PAL_BASE[activity.activityLevel] * PAL_TRAINING[training.trainingLevel]);

    // ----------------------------
    // Ajuste según objetivo
    // ----------------------------
    let targetCalories = TDEE;
    if (goalType === 'LOSE' && targetWeight) {
      targetCalories = Math.round(TDEE - 400);
    }
    if (goalType === 'GAIN' && targetWeight) {
      targetCalories = Math.round(TDEE + 350);
    }

    // ----------------------------
    // Macros
    // ----------------------------
    const protein = Math.round(weight * 2.0);
    const fats = Math.round((targetCalories * 0.25) / 9);
    const remaining = targetCalories - protein * 4 - fats * 9;
    const carbs = Math.round(Math.max(remaining / 4, 0));

    return {
      bmr,
      tdee: TDEE,
      targetCalories,
      protein,
      carbs,
      fats,
    };
  };

  // ============================
  // Guardar perfil final
  // ============================
  const handleFinalize = async () => {
    if (!calculatedMacros) {
      setSaveError('No se pudieron calcular los macros. Revisa tus datos.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const payload = {
        biometrics: data.biometrics,
        goal: data.goal,
        activity: data.activity,
        training: data.training,
        diet: data.diet,

        macros: {
          bmr: calculatedMacros.bmr,
          tdee: calculatedMacros.tdee,
          targetCalories: calculatedMacros.targetCalories,
          protein: calculatedMacros.protein,
          carbs: calculatedMacros.carbs,
          fats: calculatedMacros.fats,
        },
      };

      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Error al guardar el perfil');
      }

      router.push('/dashboard');

    } catch (error: any) {
      setSaveError(error.message || 'Error desconocido');
      console.error('❌ Error Onboarding Final:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!calculatedMacros) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // ============================
  //     UI COMPLETAMENTE MEJORADA
  // ============================
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-3xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          
          <StepHeader
            currentStep={6}
            totalSteps={6}
            title="Resumen de tu Perfil"
            description="Revisa tus datos y finaliza tu plan personalizado"
          />

          <CardContent className="space-y-10">

            {/* ========================== */}
            {/*    SECCIÓN 1: CÁLCULOS     */}
            {/* ========================== */}
            <div className="grid md:grid-cols-3 gap-4">
              <SummaryCard
                icon={<Calculator className="w-5 h-5 text-blue-400" />}
                title="BMR"
                value={calculatedMacros.bmr}
                desc="Metabolismo basal"
              />

              <SummaryCard
                icon={<Flame className="w-5 h-5 text-orange-400" />}
                title="TDEE"
                value={calculatedMacros.tdee}
                desc="Gasto calórico diario"
              />

              <SummaryCard
                icon={<Apple className="w-5 h-5 text-emerald-400" />}
                title="Calorías Objetivo"
                value={calculatedMacros.targetCalories}
                desc="Consumo recomendado"
                highlight
              />
            </div>

            {/* ========================== */}
            {/* SECCIÓN 2: MACROS          */}
            {/* ========================== */}
            <MacrosDisplay macros={calculatedMacros} />

            {/* ========================== */}
            {/* SECCIÓN 3: DETALLES USER   */}
            {/* ========================== */}
            <UserSummary data={data} />

            {/* ========================== */}
            {/* ERRORES                    */}
            {/* ========================== */}
            {saveError && (
              <ErrorBox message={saveError} />
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => router.push(PREV_PATH)}>
              ← Volver
            </Button>

            <Button
              onClick={handleFinalize}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalizar
                </>
              )}
            </Button>
          </CardFooter>

        </Card>
      </div>
    </div>
  );
}

/* ======================================================
   COMPONENTES REUTILIZABLES PARA HACER EL ARCHIVO LIMPIO
   ====================================================== */

function SummaryCard({ icon, title, value, desc, highlight = false }: any) {
  return (
    <div className={`p-6 rounded-xl border ${
      highlight
        ? 'bg-emerald-600/20 border-emerald-500/50'
        : 'bg-slate-800/40 border-slate-700'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}

function MacrosDisplay({ macros }: any) {
  return (
    <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Macronutrientes Diarios</h3>

      <MacroItem label="Proteína" gram={macros.protein} />
      <MacroItem label="Carbohidratos" gram={macros.carbs} />
      <MacroItem label="Grasas" gram={macros.fats} />
    </div>
  );
}

function MacroItem({ label, gram }: any) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-bold">{gram}g</span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: '40%' }} />
      </div>
    </div>
  );
}

function UserSummary({ data }: any) {
  return (
    <div className="p-4 bg-slate-800/20 border border-slate-700 rounded-xl">
      <h4 className="text-sm font-bold text-white mb-3">Resumen de tus Datos</h4>

      <div className="grid grid-cols-2 gap-2 text-xs">
        
        <div><b className="text-emerald-400">Edad:</b> {data.biometrics?.age}</div>
        <div><b className="text-emerald-400">Peso:</b> {data.biometrics?.weight}kg</div>
        <div><b className="text-emerald-400">Altura:</b> {data.biometrics?.height}cm</div>

        {data.biometrics?.bodyFatPercentage && (
          <div className="col-span-2">
            <b className="text-emerald-400">Grasa Corporal:</b> {data.biometrics.bodyFatPercentage}%
          </div>
        )}

        <div className="col-span-2 mt-2">
          <b className="text-emerald-400">Objetivo:</b> {data.goal?.goalType}
        </div>

        {/* Activity */}
        <div className="col-span-2 mt-2">
          <b className="text-blue-400">Actividad Diaria:</b> {data.activity?.activityLevel}
        </div>

        {/* Training */}
        <div className="col-span-2 mt-2">
          <b className="text-orange-400">Nivel de Entrenamiento:</b> {data.training?.trainingLevel}
        </div>
        <div className="col-span-2">
          <b className="text-orange-400">Frecuencia:</b> {data.training?.trainingFrequency} / semana
        </div>
        <div className="col-span-2">
          <b className="text-orange-400">Disciplinas:</b> {data.training?.trainingTypes?.join(', ')}
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ message }: any) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-300">Error al Guardar</p>
        <p className="text-xs text-red-400 mt-1">{message}</p>
      </div>
    </div>
  );
}
