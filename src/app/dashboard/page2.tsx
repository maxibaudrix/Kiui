// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import AppShell from '@/components/shared/layout/AppShell';
import { useUserStore } from '@/store/user';
import { useTrainingStore } from '@/store/training';
import { CaloriesSummary } from '@/components/dashboard/CaloriesSummary';
import { MacrosChart } from '@/components/dashboard/MacrosChart';
import { WorkoutPreview } from '@/components/dashboard/WorkoutPreview';
import { RecentScans } from '@/components/dashboard/RecentScans';

export default function DashboardPage() {
  const { user } = useUserStore();
  const { currentWorkout } = useTrainingStore();

  // Datos mock para el MVP (En producción vendrían de logs diarios en Supabase/Store)
  const dailyStats = {
    consumed: 1450,
    burned: currentWorkout?.isCompleted ? (currentWorkout.durationMinutes * 8) : 0, // Est. 8 cal/min
    target: user?.profile?.targetCalories || user?.goals?.targetCalories || 2000,
    macros: {
        protein: { 
          current: 110, 
          target: user?.profile?.targetMacros?.protein || user?.goals?.targetMacros?.protein || 150, 
          unit: 'g' 
        },
        carbs: { 
          current: 140, 
          target: user?.profile?.targetMacros?.carbs || user?.goals?.targetMacros?.carbs || 200, 
          unit: 'g' 
        },
        fat: { 
          current: 45, 
          target: user?.profile?.targetMacros?.fat || user?.goals?.targetMacros?.fat || 65, 
          unit: 'g' 
        },
    }
  };

  // Obtener el nombre del usuario
  const userName = user?.profile?.firstName || user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Atleta';

  return (
    <AppShell title="Dashboard">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Section */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
                Hola, {userName} 👋
            </h1>
            <p className="text-gray-500">Aquí está tu resumen de hoy.</p>
        </div>

        {/* Top Row: Calories & Workout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Calories */}
            <CaloriesSummary 
                consumed={dailyStats.consumed} 
                burned={dailyStats.burned} 
                target={dailyStats.target} 
            />

            {/* 2. Workout */}
            <WorkoutPreview 
                workoutName={currentWorkout?.title}
                duration={currentWorkout?.durationMinutes}
                exerciseCount={currentWorkout?.exercises.length}
                isCompleted={currentWorkout?.isCompleted}
            />

            {/* 3. Macros (On mobile this stacks, on LG it takes 3rd column) */}
            <div className="md:col-span-2 lg:col-span-1">
                <MacrosChart 
                    protein={dailyStats.macros.protein}
                    carbs={dailyStats.macros.carbs}
                    fat={dailyStats.macros.fat}
                />
            </div>
        </div>

        {/* Bottom Row: Recent Scans & More */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentScans scans={[
                { id: '1', name: 'Avena Quaker', calories: 150, timestamp: new Date().toISOString() },
                { id: '2', name: 'Plátano', calories: 90, timestamp: new Date().toISOString() }
            ]} />
            
            {/* Placeholder for future widgets (Hydration, Sleep, etc.) */}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 text-sm">
                Próximamente: Seguimiento de Hidratación y Sueño
            </div>
        </div>

      </div>
    </AppShell>
  );
}