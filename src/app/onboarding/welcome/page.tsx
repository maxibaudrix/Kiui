// src/app/onboarding/welcome/page.tsx
'use client';
import React from 'react';
import { ArrowRight, Target, Dumbbell, Apple, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

export default function OnboardingWelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-4xl mx-auto w-full px-4">
        
        {/* Logo y Badge Superior */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo Symbol */}
          <div className="inline-flex items-center justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none" className="drop-shadow-2xl">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
              <path d="M 8 8 L 8 14 M 8 8 L 14 8" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 40 8 L 40 14 M 40 8 L 34 8" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 18 16 L 18 32" stroke="url(#logoGrad)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M 18 24 L 30 16" stroke="url(#logoGrad)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M 18 24 L 30 32" stroke="url(#logoGrad)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M 8 40 L 8 34 M 8 40 L 14 40" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 40 40 L 40 34 M 40 40 L 34 40" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Onboarding Personalizado
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight">
            Bienvenido a Kiui
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            En solo <strong className="text-emerald-400">5 minutos</strong>, crearemos tu plan personalizado de entrenamiento y nutrición basado en tus objetivos y estilo de vida.
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl p-8 md:p-12 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          
          <h2 className="text-2xl font-bold mb-8 text-center">¿Qué descubriremos juntos?</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Tu Objetivo</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Perder grasa, ganar músculo, mejorar rendimiento o recomponer tu cuerpo.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Tu Nivel de Entrenamiento</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Desde principiante hasta atleta avanzado, adaptamos tu plan.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Apple className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Tus Preferencias Nutricionales</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Respetamos alergias, restricciones y estilo de alimentación.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 p-5 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-yellow-500/30 transition-all group">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Tu Composición Corporal</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Calculamos tu metabolismo basal y calorías diarias óptimas.
                </p>
              </div>
            </div>

          </div>

          {/* Progress Info */}
          <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Progreso del onboarding</span>
              <span className="text-sm text-emerald-400 font-bold">0 de 6 pasos</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-0 transition-all duration-500"></div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => window.location.href = '/onboarding/step-1-biometrics'}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-5 px-8 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg group"
          >
            <span>Comenzar mi Transformación</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            ⏱️ Tiempo estimado: 5 minutos • 🔒 Tus datos están seguros
          </p>
        </div>

        {/* Testimonial Mini */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
              👤
            </div>
            <div>
              <p className="text-slate-300 text-sm leading-relaxed italic mb-2">
                "El onboarding fue súper rápido y los planes que me generó Kiui están perfectamente adaptados a mi horario y objetivos. ¡Lo recomiendo!"
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">María G.</span>
                <span className="text-xs text-slate-500">• Usuario Kiui</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Help Link */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            ¿Necesitas ayuda?{' '}
            <a href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Contáctanos
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}