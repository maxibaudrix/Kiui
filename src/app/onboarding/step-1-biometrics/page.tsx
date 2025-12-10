// src/app/onboarding/step-1-biometrics/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, biometricsSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useOnboardingStore } from '@/store/onboarding';
import { User, Ruler, Scale, Activity } from 'lucide-react';

const NEXT_PATH = '/onboarding/step-2-goal';
const PREV_PATH = '/login';

export default function Step1BiometricsPage() {
  const router = useRouter();
  const { setBiometrics } = useOnboardingStore();

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(1, biometricsSchema, (formData) => {
    setBiometrics({
      age: formData.age,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      bodyFatPercentage: formData.bodyFatPercentage,
    });
    router.push(NEXT_PATH);
  });

  const gender = watch('gender');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
      {/* Background Effects (igual que login) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl">
          <StepHeader
            currentStep={1}
            totalSteps={6}
            title="Datos Biométricos"
            description="Cuéntanos sobre tu cuerpo para personalizar tu plan"
          />

          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-6">
              {/* Edad */}
              <div>
                <Label htmlFor="age" className="flex items-center gap-2 mb-2 text-slate-300">
                  <User className="w-4 h-4 text-emerald-400" />
                  Edad (años)
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register('age', { valueAsNumber: true })}
                  className="bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {errors.age && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.age.message?.toString()}
                  </p>
                )}
              </div>

              {/* Género */}
              <div>
                <Label className="mb-3 block text-slate-300">Género</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'MALE', label: 'Hombre', icon: '👨' },
                    { value: 'FEMALE', label: 'Mujer', icon: '👩' },
                    { value: 'OTHER', label: 'Otro', icon: '🧑' },
                  ].map((g) => (
                    <label
                      key={g.value}
                      htmlFor={g.value}
                      className={`relative p-4 text-center rounded-xl border-2 cursor-pointer transition-all ${
                        gender === g.value
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-500 shadow-lg shadow-emerald-500/50'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        id={g.value}
                        value={g.value}
                        {...register('gender')}
                        className="sr-only"
                      />
                      <div className="text-2xl mb-2">{g.icon}</div>
                      <div className="text-sm font-medium">{g.label}</div>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.gender.message?.toString()}
                  </p>
                )}
              </div>

              {/* Altura */}
              <div>
                <Label htmlFor="height" className="flex items-center gap-2 mb-2 text-slate-300">
                  <Ruler className="w-4 h-4 text-blue-400" />
                  Altura (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  {...register('height', { valueAsNumber: true })}
                  className="bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {errors.height && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.height.message?.toString()}
                  </p>
                )}
              </div>

              {/* Peso */}
              <div>
                <Label htmlFor="weight" className="flex items-center gap-2 mb-2 text-slate-300">
                  <Scale className="w-4 h-4 text-purple-400" />
                  Peso Actual (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  {...register('weight', { valueAsNumber: true })}
                  className="bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {errors.weight && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.weight.message?.toString()}
                  </p>
                )}
              </div>

              {/* % Grasa (Opcional) */}
              <div>
                <Label htmlFor="bodyFatPercentage" className="flex items-center gap-2 mb-2 text-slate-300">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  Porcentaje de Grasa Corporal
                  <span className="text-slate-500 text-xs ml-1">(Opcional)</span>
                </Label>
                <Input
                  id="bodyFatPercentage"
                  type="number"
                  step="0.1"
                  placeholder="20.0"
                  {...register('bodyFatPercentage', { 
                    valueAsNumber: true,
                    setValueAs: (value) => value === '' ? undefined : parseFloat(value)
                  })}
                  className="bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Si no lo conoces, déjalo en blanco. Puedes añadirlo más tarde.
                </p>
                {errors.bodyFatPercentage && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.bodyFatPercentage.message?.toString()}
                  </p>
                )}
              </div>

              {/* Botones */}
              <StepButtons
                currentStep={1}
                nextPath={NEXT_PATH}
                prevPath={PREV_PATH}
                isSubmitting={isSubmitting}
                onNext={() => {}}
                isLastStep={false}
              />
            </form>
          </CardContent>
        </Card>

        {/* Link de Ayuda */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            ¿Necesitas ayuda?{' '}
            <a href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}