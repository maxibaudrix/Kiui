// src/app/onboarding/step-2-goal/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react'; 
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, goalSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useOnboardingStore } from '@/store/onboarding';
import { TrendingDown, TrendingUp, Minus, Zap, Target, AlertCircle } from 'lucide-react';
import { GoalGuideModal } from '@/components/onboarding/GoalGuideModal';

const NEXT_PATH = '/onboarding/step-3-activity';
const PREV_PATH = '/onboarding/step-1-biometrics';

const GOAL_OPTIONS = [
  { 
    value: 'LOSE', 
    label: 'Perder Grasa', 
    icon: TrendingDown, 
    color: 'from-orange-500 to-red-500',
    description: 'Reducir peso y definir',
    emoji: '🔥'
  },
  { 
    value: 'GAIN', 
    label: 'Ganar Músculo', 
    icon: TrendingUp, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Aumentar masa muscular',
    emoji: '💪'
  },
  { 
    value: 'MAINTAIN', 
    label: 'Mantener', 
    icon: Minus, 
    color: 'from-slate-600 to-slate-700',
    description: 'Mantener peso actual',
    emoji: '⚖️'
  },
  { 
    value: 'RECOMP', 
    label: 'Recomposición', 
    icon: Zap, 
    color: 'from-purple-500 to-pink-500',
    description: 'Perder grasa y ganar músculo',
    emoji: '⚡'
  },
];

const SPEED_OPTIONS = [
  { id: 'SLOW', label: 'Lento', description: 'Sostenible', weeks: '16-20 semanas' },
  { id: 'MODERATE', label: 'Moderado', description: 'Recomendado', weeks: '12-16 semanas', recommended: true },
  { id: 'AGGRESSIVE', label: 'Agresivo', description: 'Intensivo', weeks: '8-12 semanas' },
];



export default function Step2GoalPage() {
  const router = useRouter();
  const { setGoal } = useOnboardingStore();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
  } = useOnboardingForm(2, goalSchema, (formData) => {
    setGoal({
      goalType: formData.goalType,
      targetWeight: formData.targetWeight,
      goalSpeed: formData.goalSpeed,
    });
    router.push(NEXT_PATH);
  });

  const goalType = watch('goalType');
  const goalSpeed = watch('goalSpeed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-3xl">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl">
          <StepHeader
            currentStep={2}
            totalSteps={6}
            title="Tu Objetivo"
            description="¿Qué quieres lograr con Sporvit?"
          />
          
          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-6">
              {/* Tipo de Objetivo */}
              <div>
                <Label className="mb-4 block text-lg font-semibold text-slate-200 items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Objetivo Principal
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {GOAL_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = goalType === option.value;
                    
                    return (
                      <label
                        key={option.value}
                        htmlFor={option.value}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all group ${
                          isSelected
                            ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
                            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/50'
                        }`}
                      >
                        <input
                          type="radio"
                          id={option.value}
                          value={option.value}
                          {...register('goalType')}
                          className="sr-only"
                        />
                        
                        {/* Icon Container */}
                        <div className={`flex items-center gap-4 mb-3`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${option.color} ${
                            isSelected ? 'scale-110 shadow-lg' : 'opacity-70 group-hover:opacity-100'
                          } transition-all`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl">{option.emoji}</div>
                        </div>

                        {/* Text */}
                        <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {option.label}
                        </h3>
                        <p className="text-sm text-slate-400">{option.description}</p>

                        {/* Checkmark */}
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
                {errors.goalType && (
                  <p className="text-red-400 text-xs mt-3 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.goalType.message?.toString()}
                  </p>
                )}
              </div>

              {/* Peso Objetivo (solo si LOSE o GAIN) */}
              {(goalType === 'LOSE' || goalType === 'GAIN') && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Label htmlFor="targetWeight" className="flex items-center gap-2 mb-2 text-slate-300">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Peso Objetivo (kg)
                  </Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    placeholder={goalType === 'LOSE' ? '65.0' : '80.0'}
                    {...register('targetWeight', { valueAsNumber: true })}
                    className="bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Este será tu objetivo final
                  </p>
                  {errors.targetWeight && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.targetWeight.message?.toString()}
                    </p>
                  )}
                </div>
              )}

              {/* Velocidad (solo si no es MAINTAIN) */}
              {goalType && goalType !== 'MAINTAIN' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Label className="mb-3 block text-slate-300 font-semibold">
                    ¿Qué tan rápido quieres progresar?
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {SPEED_OPTIONS.map((speed) => {
                      const isSelected = goalSpeed === speed.id;
                      
                      return (
                        <label
                          key={speed.id}
                          htmlFor={speed.id}
                          className={`relative p-4 text-center rounded-xl cursor-pointer transition-all border-2 ${
                            isSelected
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 shadow-lg shadow-emerald-500/30'
                              : 'bg-slate-900 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            id={speed.id}
                            value={speed.id}
                            {...register('goalSpeed')}
                            className="sr-only"
                          />
                          
                          {/* Recommended Badge */}
                          {speed.recommended && !isSelected && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                              RECOMENDADO
                            </div>
                          )}

                          <div className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {speed.label}
                          </div>
                          <div className={`text-xs mb-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {speed.description}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                            {speed.weeks}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.goalSpeed && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.goalSpeed.message?.toString()}
                    </p>
                  )}
                </div>
              )}

              {/* Info Box */}
              {goalType && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-in fade-in duration-500">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium mb-1">
                        💡 Tip Sporvit
                      </p>
                      <p className="text-xs text-blue-200/80">
                        {goalType === 'LOSE' && 'Una pérdida sostenible es de 0.5-1 kg por semana. Perder más rápido puede afectar tu masa muscular.'}
                        {goalType === 'GAIN' && 'Ganar 0.25-0.5 kg por semana minimiza la ganancia de grasa mientras maximizas el músculo.'}
                        {goalType === 'MAINTAIN' && 'Mantener tu peso actual mientras mejoras tu composición corporal es totalmente posible.'}
                        {goalType === 'RECOMP' && 'La recomposición corporal requiere paciencia. Prioriza la fuerza y la proteína alta.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <StepButtons
                currentStep={2}
                nextPath={NEXT_PATH}
                prevPath={PREV_PATH}
                isSubmitting={isSubmitting}
                onNext={() => {}}
                isLastStep={false}
              />
            </form>
          </CardContent>
        </Card>

        {/* Help Link (MODIFICADO para abrir el modal) */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            ¿No estás seguro de tu objetivo?{' '}
            <button 
              type="button" // Cambiado de <a> a <button>
              onClick={() => setIsGuideOpen(true)} // Abre el modal
              className="text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md"
            >
              Lee nuestra guía
            </button>
          </p>
        </div>
      </div>

      {/* RENDERIZAR EL MODAL */}
      <GoalGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}