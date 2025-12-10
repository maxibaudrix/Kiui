// src/app/onboarding/step-3-activity/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, activitySchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { useOnboardingStore } from '@/store/onboarding';

const NEXT_PATH = '/onboarding/step-4-training-level';
const PREV_PATH = '/onboarding/step-2-goal';

const ACTIVITY_LEVELS = [
  { value: 'SEDENTARY', label: 'Sedentario (trabajo de oficina, poco movimiento)' },
  { value: 'LIGHTLY_ACTIVE', label: 'Ligeramente activo (oficina y tareas diarias)' },
  { value: 'MODERATELY_ACTIVE', label: 'Moderadamente activo (trabajo mixto)' },
  { value: 'VERY_ACTIVE', label: 'Muy activo (trabajo físico)' },
  { value: 'SUPER_ACTIVE', label: 'Súper activo (trabajo físico intenso)' },
];

const STEPS_RANGE = [
  { value: 'UNDER_3000', label: '< 3.000 pasos/día' },
  { value: '3K_6K', label: '3.000–6.000 pasos/día' },
  { value: '6K_10K', label: '6.000–10.000 pasos/día' },
  { value: 'OVER_10K', label: '> 10.000 pasos/día' },
];

const SITTING_HOURS = [
  { value: 'LESS_THAN_4H', label: '< 4 horas sentado' },
  { value: '4H_6H', label: '4–6 horas sentado' },
  { value: '6H_8H', label: '6–8 horas sentado' },
  { value: 'MORE_THAN_8H', label: '> 8 horas sentado' },
];


export default function Step3ActivityPage() {
  const router = useRouter();
  const { setActivity } = useOnboardingStore();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(3, activitySchema, (formData) => {
    setActivity(formData);
    router.push(NEXT_PATH);
  });

  const activityLevel = watch('activityLevel');
  const dailySteps = watch('dailySteps');
  const sittingHours = watch('sittingHours');
  const workType = watch('workType');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          
          <StepHeader
            currentStep={3}
            totalSteps={6}
            title="Actividad Diaria"
            description="Cuéntanos sobre tu movimiento diario para estimar tu NEAT"
          />

          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-8">

              {/* NIVEL DE ACTIVIDAD (OBLIGATORIO) */}
              <div>
                <Label className="mb-3 block">Nivel de Actividad Diaria</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ACTIVITY_LEVELS.map((item) => (
                    <Label
                      key={item.value}
                      htmlFor={item.value}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                        activityLevel === item.value
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        id={item.value}
                        value={item.value}
                        {...register('activityLevel')}
                        className="sr-only"
                      />
                      {item.label}
                    </Label>
                  ))}
                </div>

                {errors.activityLevel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.activityLevel.message?.toString()}
                  </p>
                )}
              </div>

              {/* PASOS DIARIOS (OPCIONAL) */}
              <div>
                <Label className="mb-3 block">
                  Pasos Diarios Promedio 
                </Label>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {STEPS_RANGE.map((item) => (
                    <Label
                      key={item.value}
                      htmlFor={item.value}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                        dailySteps === item.value
                          ? 'bg-emerald-500/30 border-emerald-600 text-emerald-300 shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        id={item.value}
                        value={item.value}
                        {...register('dailySteps')}
                        className="sr-only"
                      />
                      {item.label}
                    </Label>
                  ))}
                </div>
              </div>

              {/* HORAS SENTADO (OPCIONAL) */}
              <div>
                <Label className="mb-3 block">
                  Horas Sentado al Día (Opcional)
                </Label>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {SITTING_HOURS.map((item) => (
                    <Label
                      key={item.value}
                      htmlFor={item.value}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                        sittingHours === item.value
                          ? 'bg-emerald-500/30 border-emerald-600 text-emerald-300 shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        id={item.value}
                        value={item.value}
                        {...register('sittingHours')}
                        className="sr-only"
                      />
                      {item.label}
                    </Label>
                  ))}
                </div>
              </div>

              {/* BOTONES DE NAVEGACIÓN */}
              <StepButtons
                currentStep={3}
                nextPath={NEXT_PATH}
                prevPath={PREV_PATH}
                isSubmitting={isSubmitting}
                onNext={() => {}}
                isLastStep={false}
              />
            </form>
          </CardContent>

        </Card>
      </div>
    </div>
  );
}
