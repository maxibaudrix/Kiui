// src/app/onboarding/step-5-diet/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import StepHeader from '@/components/onboarding/StepHeader';
import StepButtons from '@/components/onboarding/StepButtons';
import { useOnboardingForm, dietSchema } from '@/hooks/useOnboardingForm';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { useOnboardingStore } from '@/store/onboarding';

const NEXT_PATH = '/onboarding/step-6-macros';
const PREV_PATH = '/onboarding/step-4-training-level';

const DIET_TYPES = [
  { value: 'OMNIVORE', label: 'Omnívora (Sin restricciones)' },
  { value: 'VEGETARIAN', label: 'Vegetariana' },
  { value: 'VEGAN', label: 'Vegana' },
  { value: 'KETO', label: 'Cetogénica (Keto)' },
  { value: 'PALEO', label: 'Paleo' },
];

const COMMON_ALLERGIES = [
  'Gluten',
  'Lactosa',
  'Frutos Secos',
  'Mariscos',
  'Huevo',
  'Soja',
  'Pescado',
  'Cacahuetes',
];

const EXCLUDED_INGREDIENTS = [
  'Carne Roja',
  'Cerdo',
  'Azúcar Refinada',
  'Alcohol',
  'Cafeína',
  'Edulcorantes Artificiales',
];

export default function Step5DietPage() {
  const router = useRouter();
  const { setDiet } = useOnboardingStore();   

  const {
    register,
    handleSubmitStore,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useOnboardingForm(5, dietSchema, (formData) => {
    // ✅ Callback actualizado — guarda preferencias dietéticas en Zustand
    setDiet({
      dietType: formData.dietType,
      allergies: formData.allergies,
      excludedIngredients: formData.excludedIngredients,
    });

    router.push(NEXT_PATH);
  });

  const allergies = watch('allergies') || [];
  const excludedIngredients = watch('excludedIngredients') || [];

  const toggleItem = (
    field: 'allergies' | 'excludedIngredients',
    item: string
  ) => {
    const current = field === 'allergies' ? allergies : excludedIngredients;

    if (current.includes(item)) {
      setValue(
        field,
        current.filter((i: string) => i !== item)
      );
    } else {
      setValue(field, [...current, item]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-slate-800 bg-slate-900">
          <StepHeader
            currentStep={5}
            totalSteps={6}
            title="Preferencias Dietéticas"
            description="Personaliza tu plan según restricciones y alergias"
          />
          
          <CardContent>
            <form onSubmit={handleSubmitStore} className="space-y-6">

              {/* Tipo de Dieta */}
              <div>
                <Label htmlFor="dietType" className="mb-2 block">
                  Tipo de Dieta
                </Label>
                <Select id="dietType" {...register('dietType')}>
                  <option value="">Selecciona tu dieta</option>
                  {DIET_TYPES.map(diet => (
                    <option key={diet.value} value={diet.value}>
                      {diet.label}
                    </option>
                  ))}
                </Select>

                {errors.dietType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dietType.message?.toString()}
                  </p>
                )}
              </div>

              {/* Alergias */}
              <div>
                <Label className="mb-3 block">
                  Alergias e Intolerancias
                  <span className="text-slate-500 text-xs ml-2">(Opcional)</span>
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  {COMMON_ALLERGIES.map(allergy => (
                    <Label
                      key={allergy}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        allergies.includes(allergy)
                          ? 'bg-red-500/20 border-2 border-red-500/50 text-red-300'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={allergies.includes(allergy)}
                        onChange={() => toggleItem('allergies', allergy)}
                        className="sr-only"
                      />

                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          allergies.includes(allergy)
                            ? 'bg-red-500 border-red-500'
                            : 'border-slate-600'
                        }`}
                      >
                        {allergies.includes(allergy) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>

                      <span className="text-sm font-medium">{allergy}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Ingredientes Excluidos */}
              <div>
                <Label className="mb-3 block">
                  Ingredientes que Prefieres Evitar
                  <span className="text-slate-500 text-xs ml-2">(Opcional)</span>
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  {EXCLUDED_INGREDIENTS.map(ingredient => (
                    <Label
                      key={ingredient}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        excludedIngredients.includes(ingredient)
                          ? 'bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-300'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={excludedIngredients.includes(ingredient)}
                        onChange={() => toggleItem('excludedIngredients', ingredient)}
                        className="sr-only"
                      />

                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          excludedIngredients.includes(ingredient)
                            ? 'bg-yellow-500 border-yellow-500'
                            : 'border-slate-600'
                        }`}
                      >
                        {excludedIngredients.includes(ingredient) && (
                          <svg className="w-3 h-3 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>

                      <span className="text-sm font-medium">{ingredient}</span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Nota Informativa */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  💡 <strong>Nota:</strong> Estas preferencias se usarán para filtrar productos en el scanner y generar recetas personalizadas.
                </p>
              </div>

              <StepButtons
                currentStep={5}
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
