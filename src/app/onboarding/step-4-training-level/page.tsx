'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, trainingSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { useOnboardingStore } from '@/store/onboarding';

const NEXT_PATH = '/onboarding/step-5-diet';
const PREV_PATH = '/onboarding/step-3-activity';

const TRAINING_LEVELS = [
  { value: 'BEGINNER', label: 'Principiante' },
  { value: 'INTERMEDIATE', label: 'Intermedio' },
  { value: 'ADVANCED', label: 'Avanzado' },
];

const FREQUENCIES = [
  { value: '1_2', label: '1–2 días/semana' },
  { value: '3_4', label: '3–4 días/semana' },
  { value: '5_6', label: '5–6 días/semana' },
  { value: 'DOUBLE', label: 'Doble sesión / competitivo' },
];

const TRAINING_TYPES = [
  'Running',
  'Ciclismo',
  'Natación',
  'Gimnasio / Fuerza',
  'CrossFit',
  'Yoga / Movilidad',
  'Deportes de equipo',
];

const DURATIONS = [
  { value: 'UNDER_30', label: '< 30 min' },
  { value: '30_60', label: '30–60 min' },
  { value: '60_90', label: '60–90 min' },
  { value: 'OVER_90', label: '> 90 min' },
];

const INTENSITIES = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MODERATE', label: 'Moderada' },
  { value: 'HIGH', label: 'Alta' },
];

export default function Step4TrainingLevelPage() {
  const router = useRouter();
  const { setTraining } = useOnboardingStore();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useOnboardingForm(4, trainingSchema, (formData) => {
    setTraining(formData);
    router.push(NEXT_PATH);
  });

  const trainingTypes = watch('trainingTypes') || [];

  const toggleType = (type: string) => {
    if (trainingTypes.includes(type)) {
      setValue('trainingTypes', trainingTypes.filter((t: string) => t !== type));
    } else {
      setValue('trainingTypes', [...trainingTypes, type]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          
          <StepHeader
            currentStep={4}
            totalSteps={6}
            title="Nivel de Entrenamiento"
            description="Cuéntanos sobre tu experiencia y hábitos de entrenamiento"
          />

          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-8">

              {/* Nivel */}
              <div>
                <Label className="block mb-3">Nivel de Entrenamiento</Label>
                <div className="grid grid-cols-3 gap-3">
                  {TRAINING_LEVELS.map((lvl) => (
                    <Label
                      key={lvl.value}
                      className={`
                        p-4 text-center rounded-xl border cursor-pointer transition-all
                        ${watch('trainingLevel') === lvl.value
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={lvl.value}
                        {...register('trainingLevel')}
                        className="sr-only"
                      />
                      {lvl.label}
                    </Label>
                  ))}
                </div>
                {errors.trainingLevel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.trainingLevel.message?.toString()}
                  </p>
                )}
              </div>

              {/* Frecuencia */}
              <div>
                <Label className="block mb-3">Frecuencia semanal</Label>
                <div className="grid grid-cols-2 gap-3">
                  {FREQUENCIES.map((f) => (
                    <Label
                      key={f.value}
                      className={`
                        p-4 rounded-xl border cursor-pointer transition-all
                        ${watch('trainingFrequency') === f.value
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={f.value}
                        {...register('trainingFrequency')}
                        className="sr-only"
                      />
                      {f.label}
                    </Label>
                  ))}
                </div>
              </div>

              {/* Tipos de entrenamiento */}
              <div>
                <Label className="block mb-4">Disciplinas que practicas</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TRAINING_TYPES.map((type) => (
                    <Label
                      key={type}
                      className={`
                        p-3 flex items-center gap-3 rounded-xl border cursor-pointer transition-all
                        ${trainingTypes.includes(type)
                          ? 'bg-emerald-600/20 border-emerald-600 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={trainingTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      {type}
                    </Label>
                  ))}
                </div>
              </div>

              {/* Duración */}
              <div>
                <Label className="block mb-3">Duración media de tus sesiones</Label>
                <div className="grid grid-cols-4 gap-3">
                  {DURATIONS.map((d) => (
                    <Label
                      key={d.value}
                      className={`
                        p-3 rounded-xl text-center border cursor-pointer transition-all
                        ${watch('sessionDuration') === d.value
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={d.value}
                        {...register('sessionDuration')}
                        className="sr-only"
                      />
                      {d.label}
                    </Label>
                  ))}
                </div>
              </div>

              {/* Intensidad */}
              <div>
                <Label className="block mb-3">Intensidad habitual</Label>
                <div className="grid grid-cols-3 gap-3">
                  {INTENSITIES.map((i) => (
                    <Label
                      key={i.value}
                      className={`
                        p-4 rounded-xl border text-center cursor-pointer transition-all
                        ${watch('intensity') === i.value
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={i.value}
                        {...register('intensity')}
                        className="sr-only"
                      />
                      {i.label}
                    </Label>
                  ))}
                </div>
              </div>

              <StepButtons
                currentStep={4}
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
