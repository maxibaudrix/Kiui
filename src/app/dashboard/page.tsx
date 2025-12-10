'use client';
import React, { useState } from 'react';
import { 
  Camera, Dumbbell, Apple, TrendingUp, TrendingDown, Target,
  Calendar, Clock, Flame, Zap, Award, ChevronRight, Plus,
  Activity, BarChart3, Settings, User, LogOut, Menu, X,
  CheckCircle, AlertCircle, Heart, Utensils, Search, Bell
} from 'lucide-react';

const SporvitDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Datos de usuario simulados
  const userData = {
    name: "Carlos",
    goal: "Perder grasa",
    targetCalories: 2100,
    consumedCalories: 1680,
    targetProtein: 165,
    consumedProtein: 142,
    targetCarbs: 210,
    consumedCarbs: 178,
    targetFats: 70,
    consumedFats: 58,
    currentWeight: 82.5,
    startWeight: 85,
    targetWeight: 78,
    streak: 12,
    level: "Intermedio"
  };

  const todayWorkout = {
    scheduled: true,
    type: "Fuerza - Tren Superior",
    duration: 60,
    calories: 420,
    completed: false
  };

  const recentScans = [
    { id: 1, name: "Avena integral Hacendado", time: "08:30", score: "A", status: "good", calories: 120 },
    { id: 2, name: "Pechuga de pollo", time: "14:20", score: "A", status: "good", calories: 165 },
    { id: 3, name: "Coca-Cola Zero", time: "16:45", score: "D", status: "warning", calories: 2 }
  ];

  const weeklyProgress = [
    { day: "L", calories: 2050, completed: true },
    { day: "M", calories: 2180, completed: true },
    { day: "X", calories: 1950, completed: true },
    { day: "J", calories: 2100, completed: true },
    { day: "V", calories: 1680, completed: false }, // Hoy
    { day: "S", calories: 0, completed: false },
    { day: "D", calories: 0, completed: false }
  ];

  const achievements = [
    { id: 1, title: "Racha de 7 días", icon: "🔥", unlocked: true, date: "Hace 2 días" },
    { id: 2, title: "50 productos", icon: "📸", unlocked: true, date: "Ayer" },
    { id: 3, title: "Rey del Cardio", icon: "🏃", unlocked: false, date: "Bloqueado" }
  ];

  // Cálculos
  const caloriesProgress = (userData.consumedCalories / userData.targetCalories) * 100;
  const proteinProgress = (userData.consumedProtein / userData.targetProtein) * 100;
  const carbsProgress = (userData.consumedCarbs / userData.targetCarbs) * 100;
  const fatsProgress = (userData.consumedFats / userData.targetFats) * 100;
  const weightLost = userData.startWeight - userData.currentWeight;
  const weightToGo = userData.currentWeight - userData.targetWeight;

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard", active: true },
    { icon: Camera, label: "Scanner", path: "/dashboard/scanner" },
    { icon: Utensils, label: "Nutrición", path: "/dashboard/nutrition" },
    { icon: Dumbbell, label: "Entrenamiento", path: "/dashboard/training" },
    { icon: TrendingUp, label: "Progreso", path: "/dashboard/progress" },
    { icon: Award, label: "Retos", path: "/dashboard/challenges" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Menu Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Sporvit</span>
              </div>
            </div>

            {/* Search + Notifications + Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-emerald-500/50 transition-colors">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar alimento..." 
                  className="bg-transparent border-none outline-none text-sm w-32 lg:w-48 placeholder-slate-500"
                />
              </div>
              
              <button className="relative p-2.5 hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
              </button>

              <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg">
                  {userData.name[0]}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-none">{userData.name}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-none">{userData.level}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:block fixed left-0 top-20 bottom-0 w-64 bg-slate-950 border-r border-slate-800 z-30 overflow-y-auto custom-scrollbar">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  item.active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium">{item.label}</span>
                {item.active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-4">
            <p className="text-sm font-semibold text-white mb-1">Plan Pro</p>
            <p className="text-xs text-slate-400 mb-3">Desbloquea recetas IA</p>
            <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors">
                Mejorar Plan
            </button>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-red-400 rounded-xl transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Sporvit</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      item.active
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 px-4 pb-8 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                ¡Hola, {userData.name}! 👋
                </h1>
                <p className="text-slate-400">
                Viernes, {currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium border border-slate-700 transition-colors">
                    Editar objetivos
                </button>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Calorías de hoy */}
            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flame className="w-24 h-24 text-orange-500" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg">
                    {Math.round(caloriesProgress)}%
                </span>
              </div>
              <h3 className="text-sm text-slate-400 mb-1 relative z-10">Calorías Hoy</h3>
              <p className="text-2xl font-bold mb-3 text-white relative z-10">
                {userData.consumedCalories} <span className="text-slate-500 text-lg">/ {userData.targetCalories}</span>
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative z-10">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Peso actual */}
            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingDown className="w-24 h-24 text-blue-500" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg">
                    -{weightLost} kg
                </span>
              </div>
              <h3 className="text-sm text-slate-400 mb-1 relative z-10">Peso Actual</h3>
              <p className="text-2xl font-bold mb-3 text-white relative z-10">
                {userData.currentWeight} <span className="text-lg text-slate-500">kg</span>
              </p>
              <p className="text-xs text-slate-500 relative z-10">Meta: <span className="text-slate-300">{userData.targetWeight} kg</span></p>
            </div>

            {/* Racha */}
            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-24 h-24 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <h3 className="text-sm text-slate-400 mb-1 relative z-10">Racha Actual</h3>
              <p className="text-2xl font-bold mb-3 text-white relative z-10">
                {userData.streak} <span className="text-lg text-slate-500">días</span>
              </p>
              <p className="text-xs text-emerald-400 relative z-10">¡Estás en racha!</p>
            </div>

            {/* Entreno de hoy resumen */}
            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Dumbbell className="w-24 h-24 text-purple-500" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-500" />
                </div>
                {todayWorkout.scheduled && (
                    <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg">
                        Hoy
                    </span>
                )}
              </div>
              <h3 className="text-sm text-slate-400 mb-1 relative z-10">Próximo Entreno</h3>
              <p className="text-lg font-bold mb-1 text-white truncate relative z-10">
                {todayWorkout.type}
              </p>
              <p className="text-xs text-slate-500 relative z-10">{todayWorkout.duration} min</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Column - Macros + Workout */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Macros Card */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Apple className="w-5 h-5 text-emerald-500" />
                    Macronutrientes
                  </h2>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                    Ver diario <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Proteína */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 font-medium">Proteína</span>
                      <span className="text-sm font-bold text-white">
                        {userData.consumedProtein}g <span className="text-slate-500 font-normal">/ {userData.targetProtein}g</span>
                      </span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Carbohidratos */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 font-medium">Carbohidratos</span>
                      <span className="text-sm font-bold text-white">
                        {userData.consumedCarbs}g <span className="text-slate-500 font-normal">/ {userData.targetCarbs}g</span>
                      </span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.min(carbsProgress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Grasas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 font-medium">Grasas</span>
                      <span className="text-sm font-bold text-white">
                        {userData.consumedFats}g <span className="text-slate-500 font-normal">/ {userData.targetFats}g</span>
                      </span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                        style={{ width: `${Math.min(fatsProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Workout Detailed */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Dumbbell className="w-5 h-5 text-purple-500" />
                    Entrenamiento de hoy
                  </h2>
                </div>

                {todayWorkout.scheduled ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-white">{todayWorkout.type}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                            {todayWorkout.duration} min
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                            ~{todayWorkout.calories} kcal
                          </span>
                        </div>
                      </div>
                      {todayWorkout.completed ? (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Completado</span>
                        </div>
                      ) : (
                        <button className="px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-200 rounded-xl font-bold transition-colors shadow-lg shadow-white/5">
                          Comenzar
                        </button>
                      )}
                    </div>

                    {!todayWorkout.completed && (
                      <div className="flex gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-300">
                          <strong>Recomendación:</strong> Consume 25g de carbohidratos rápidos 30 min antes de este entreno para máximo rendimiento.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                    <p className="text-slate-400 mb-4">No tienes entreno programado para hoy</p>
                    <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                      Programar actividad
                    </button>
                  </div>
                )}
              </div>

              {/* Weekly Progress Chart */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    Adherencia Semanal
                  </h2>
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Esta semana</span>
                </div>

                <div className="flex items-end justify-between gap-2 h-32">
                  {weeklyProgress.map((day, index) => {
                    const height = day.calories > 0 ? (day.calories / userData.targetCalories) * 100 : 5;
                    const isToday = index === 4;
                    
                    return (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full flex-1 flex items-end bg-slate-800/30 rounded-t-lg overflow-hidden relative">
                           {/* Target Line */}
                           <div className="absolute bottom-[75%] left-0 w-full h-[1px] bg-slate-600/30 border-t border-dashed border-slate-500 z-10"></div>
                           
                          <div 
                            className={`w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80 ${
                              day.completed 
                                ? 'bg-emerald-500' 
                                : isToday
                                ? 'bg-orange-500'
                                : 'bg-slate-700'
                            }`}
                            style={{ height: `${Math.min(height, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-slate-500'}`}>
                          {day.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions + Recent */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-4 text-white">Acciones rápidas</h2>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-4 p-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all group">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left text-white">
                      <div className="font-bold text-sm">Escanear comida</div>
                      <div className="text-xs opacity-90">Usar cámara</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/50" />
                  </button>

                  <button className="w-full flex items-center gap-4 p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all group">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm text-white">Añadir manual</div>
                      <div className="text-xs text-slate-400">Búsqueda rápida</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>

                  <button className="w-full flex items-center gap-4 p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all group">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Dumbbell className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm text-white">Registrar entreno</div>
                      <div className="text-xs text-slate-400">Pesas o Cardio</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Recent Scans - Completado */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Escaneos recientes</h2>
                  <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wide">Ver todo</button>
                </div>
                
                <div className="space-y-3">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border ${
                            scan.score === 'A' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                            scan.score === 'D' ? 'bg-red-900/30 text-red-400 border-red-500/30' :
                            'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                        }`}>
                            {scan.score}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{scan.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>{scan.time}</span>
                                <span>•</span>
                                <span>{scan.calories} kcal</span>
                            </div>
                        </div>
                        <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements / Logros */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Logros
                   </h2>
                </div>

                <div className="space-y-3">
                    {achievements.map((ach) => (
                        <div key={ach.id} className={`flex items-center gap-3 p-3 rounded-xl border ${
                            ach.unlocked 
                            ? 'bg-yellow-500/5 border-yellow-500/20' 
                            : 'bg-slate-800/30 border-slate-800 opacity-60'
                        }`}>
                            <div className="text-2xl">{ach.icon}</div>
                            <div className="flex-1">
                                <p className={`text-sm font-bold ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                                    {ach.title}
                                </p>
                                <p className="text-xs text-slate-500">{ach.date}</p>
                            </div>
                            {ach.unlocked && <CheckCircle className="w-4 h-4 text-yellow-500" />}
                        </div>
                    ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SporvitDashboard;