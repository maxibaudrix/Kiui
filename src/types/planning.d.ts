// ============================================
// PLANNING TYPES - UserPlanningContext & AI Outputs
// ============================================

/**
 * UserPlanningContext - Snapshot inmutable del onboarding
 * Este objeto se guarda UNA sola vez y NO se modifica después.
 * Es la única entrada para la generación del plan mediante AI.
 */
export interface UserPlanningContext {
  meta: {
    userId: string;
    createdAt: string; // ISO 8601
    version: string; // "1.0.0"
    locale: string; // "es-ES"
  };

  startPreferences: {
    startDate: string; // ISO 8601 (e.g., "2025-01-20")
    weekStartsOn: "monday" | "sunday";
  };

  biometrics: {
    age: number;
    gender: "male" | "female" | "other";
    weight: number; // kg
    height: number; // cm
    bodyFatPercentage?: number; // opcional
  };

  objective: {
    primaryGoal:
      | "lose_fat"
      | "gain_muscle"
      | "recomposition"
      | "maintain"
      | "performance";
    targetTimeline: number; // semanas (4, 8, 12, 16)
    hasCompetition: boolean;
    competitionType?: string; // "10k", "triathlon_sprint", "powerlifting", etc.
    targetDate?: string; // ISO 8601
    motivation?: string; // texto libre
  };

  activity: {
    country: string; // "ES", "US", etc.
    timezone: string; // "Europe/Madrid"
    dailyActivityLevel: "sedentary" | "light" | "moderate" | "active";
    dailySteps?: number; // promedio
    availableDays: (
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday"
    )[]; // días disponibles para entrenar
    preferredTimes: ("morning" | "afternoon" | "evening" | "night")[]; // horarios preferidos
  };

  training: {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    sportType:
      | "running"
      | "cycling"
      | "swimming"
      | "triathlon"
      | "strength"
      | "crossfit"
      | "general_fitness";
    sportSubtype?: string; // "road_cycling", "olympic_triathlon", etc.
    daysPerWeek: number; // 2, 3, 4, 5, 6
    sessionDuration: number; // minutos (30, 45, 60, 90)
    trainingLocation: ("gym" | "home" | "outdoor" | "pool")[];
    availableEquipment: (
      | "dumbbells"
      | "barbell"
      | "bench"
      | "squat_rack"
      | "pull_up_bar"
      | "resistance_bands"
      | "bike"
      | "treadmill"
      | "none"
    )[];
    hasInjuries: boolean;
    injuryDetails?: string; // texto libre
  };

  nutrition: {
    dietType:
      | "omnivore"
      | "vegetarian"
      | "vegan"
      | "flexitarian"
      | "ketogenic"
      | "mediterranean"
      | "paleo";
    mealsPerDay: number; // 2, 3, 4, 5
    allergies: string[]; // ["nuts", "shellfish", etc.]
    intolerances: string[]; // ["lactose", "gluten", etc.]
    excludedFoods: string[]; // ["fish", "dairy", etc.]
    cookingFrequency: "never" | "rarely" | "sometimes" | "often" | "always";
  };

  targets: {
    calories: {
      trainingDay: number; // kcal
      restDay: number; // kcal
    };
    macros: {
      protein: number; // gramos
      carbs: number; // gramos
      fat: number; // gramos
      fiber: number; // gramos
    };
  };

  planning: {
    blockSize: number; // semanas por bloque (típicamente 4)
    totalBlocks: number; // número de bloques (típicamente 3)
    phases: {
      base: number; // semanas en fase base
      build: number; // semanas en fase build
      peak: number; // semanas en fase peak
      taper: number; // semanas en fase taper
      recovery: number; // semanas en fase recovery
    };
  };
}

/**
 * CompletePlanningOutput - Output completo de la generación AI
 * Contiene TODAS las semanas del plan con workouts y meals
 */
export interface CompletePlanningOutput {
  totalWeeks: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  weeks: WeekPlan[];
  overallStats: OverallStats;
}

export interface WeekPlan {
  weekNumber: number; // 1, 2, 3... 12
  startDate: string; // ISO 8601 (lunes)
  endDate: string; // ISO 8601 (domingo)
  phase: "base" | "build" | "peak" | "taper" | "recovery";
  days: DayPlan[];
  weeklyStats: WeeklyStats;
}

export interface DayPlan {
  date: string; // ISO 8601
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  dayNumber: number; // 1-7
  isTrainingDay: boolean;
  workout?: WorkoutPlan;
  nutrition: NutritionPlan;
}

export interface WorkoutPlan {
  type: "strength" | "cardio" | "hiit" | "rest" | "active_recovery";
  phase: "base" | "build" | "peak" | "taper" | "recovery";
  focus?:
    | "full_body"
    | "upper"
    | "lower"
    | "push"
    | "pull"
    | "legs"
    | "cardio_endurance"
    | "cardio_intervals";
  duration: number; // minutos
  intensity: "low" | "moderate" | "high" | "very_high";
  description?: string;
  exercises: Exercise[];
  warmup?: {
    description: string;
    duration: number; // minutos
  };
  cooldown?: {
    description: string;
    duration: number; // minutos
  };
  notes?: string;
}

export interface Exercise {
  name: string;
  category: "compound" | "isolation" | "cardio" | "mobility";
  muscleGroup:
    | "chest"
    | "back"
    | "legs"
    | "shoulders"
    | "arms"
    | "core"
    | "full_body"
    | "cardio";
  sets: number;
  reps: number | string; // número o "AMRAP", "12-15", etc.
  rest: number; // segundos
  tempo?: string; // "2-0-2-0" (eccentric-pause-concentric-pause)
  weight?: string; // "RPE 8", "60% 1RM", "bodyweight"
  notes?: string;
  videoId?: string; // YouTube ID o link
}

export interface NutritionPlan {
  targetCalories: number;
  targetProtein: number; // gramos
  targetCarbs: number; // gramos
  targetFat: number; // gramos
  targetFiber: number; // gramos
  meals: MealPlan[];
  hydration: {
    targetWater: number; // ml
    notes?: string;
  };
}

export interface MealPlan {
  mealType: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
  timing?: string; // "07:00", "13:00", etc. (sugerido)
  name: string;
  description?: string;
  calories: number;
  protein: number; // gramos
  carbs: number; // gramos
  fat: number; // gramos
  fiber: number; // gramos
  ingredients: Ingredient[];
  instructions: string[]; // pasos de preparación
  prepTime?: number; // minutos
  cookTime?: number; // minutos
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // ["high_protein", "quick", "meal_prep", "vegetarian"]
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: "g" | "ml" | "unidad" | "taza" | "cucharada" | "cucharadita";
  notes?: string; // "opcional", "al gusto", etc.
}

export interface WeeklyStats {
  totalCalories: number;
  avgDailyCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  trainingDays: number;
  restDays: number;
  totalTrainingMinutes: number;
  avgIntensity: "low" | "moderate" | "high";
}

export interface OverallStats {
  totalTrainingDays: number;
  totalRestDays: number;
  totalTrainingHours: number;
  avgWeeklyCalories: number;
  phaseDistribution: {
    base: number;
    build: number;
    peak: number;
    taper: number;
    recovery: number;
  };
}

/**
 * PlanSkeleton - Estructura ligera para carga inicial del dashboard
 * Solo contiene lo mínimo necesario para renderizar el calendario
 */
export interface PlanSkeleton {
  totalWeeks: number;
  currentWeek: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  skeleton: WeekSkeleton[];
}

export interface WeekSkeleton {
  weekNumber: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  phase: "base" | "build" | "peak" | "taper" | "recovery";
  days: DaySkeleton[];
}

export interface DaySkeleton {
  date: string; // ISO 8601
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  hasWorkout: boolean;
  workoutType?: "strength" | "cardio" | "hiit" | "rest" | "active_recovery";
  workoutDuration?: number; // minutos
  targetCalories: number;
}

/**
 * DayDetail - Detalles completos de un día específico
 * Se carga bajo demanda cuando el usuario clickea un día
 */
export interface DayDetail {
  date: string; // ISO 8601
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  weekNumber: number;
  phase: "base" | "build" | "peak" | "taper" | "recovery";
  workout?: WorkoutDetail;
  nutrition: NutritionDetail;
  tracking: DayTracking;
}

export interface WorkoutDetail {
  id: string; // DB ID
  type: "strength" | "cardio" | "hiit" | "rest" | "active_recovery";
  focus?:
    | "full_body"
    | "upper"
    | "lower"
    | "push"
    | "pull"
    | "legs"
    | "cardio_endurance"
    | "cardio_intervals";
  duration: number; // minutos
  intensity: "low" | "moderate" | "high" | "very_high";
  description?: string;
  exercises: ExerciseDetail[];
  warmup?: {
    description: string;
    duration: number;
  };
  cooldown?: {
    description: string;
    duration: number;
  };
  notes?: string;
}

export interface ExerciseDetail {
  id: string; // Para edición
  name: string;
  category: "compound" | "isolation" | "cardio" | "mobility";
  muscleGroup: string;
  sets: number;
  reps: number | string;
  rest: number; // segundos
  tempo?: string;
  weight?: string;
  notes?: string;
  videoId?: string;
}

export interface NutritionDetail {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  meals: MealDetail[];
}

export interface MealDetail {
  id: string; // DB ID
  mealType: "breakfast" | "lunch" | "dinner" | "snack_1" | "snack_2";
  timing?: string;
  name: string;
  description?: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: IngredientDetail[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface IngredientDetail {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface DayTracking {
  workoutCompleted: boolean;
  mealsCompleted: boolean[]; // array con estado de cada comida
  waterGlasses: number;
  notes?: string;
}

/**
 * Tipos para recalculos y validaciones
 */
export interface DayMacrosResult {
  date: string;
  actual: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  target: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  diff: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  status: "on_track" | "under" | "over";
}

export interface MoveValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code:
    | "MAX_CONSECUTIVE"
    | "MAX_WORKOUTS_PER_DAY"
    | "REST_DAY_MANDATORY"
    | "PREREQUISITE_MISSING";
  message: string;
}

export interface ValidationWarning {
  code: "PHASE_MISMATCH" | "INTENSITY_SPIKE" | "VOLUME_SPIKE";
  message: string;
}
