import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: '/siempre',
      description: 'Para empezar tu viaje fitness sin barreras.',
      features: [
        '5 escaneos diarios',
        'Calculadoras básicas (IMC, TDEE)',
        'Diario nutricional simple',
        'Acceso a Comunidad Sporvit'
      ],
      cta: 'Empezar Gratis',
      ctaLink: '/register',
      highlight: false
    },
    {
      name: 'Pro Mensual',
      price: '9.99',
      period: '/mes',
      description: 'Potencia máxima para resultados rápidos.',
      features: [
        'Escaneos ilimitados',
        'IA Adaptativa completa',
        'Generador de recetas ilimitado',
        'Meal Planner semanal',
        'Sin anuncios',
        'Soporte prioritario'
      ],
      cta: 'Prueba 7 días gratis',
      ctaLink: '/register?plan=pro_monthly',
      highlight: true,
      badge: 'MÁS POPULAR'
    },
    {
      name: 'Pro Anual',
      price: '99',
      period: '/año',
      description: 'Compromiso serio con tu salud.',
      features: [
        'Todo lo incluido en Pro',
        '2 meses gratis (Ahorra 20€)',
        'Acceso anticipado a Beta features',
        '1 Consulta nutricional anual',
        'Exportar datos completos'
      ],
      cta: 'Elegir Anual',
      ctaLink: '/register?plan=pro_yearly',
      highlight: false,
      savings: 'Mejor Valor'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      
      <main className="pt-32 pb-20 px-4 container mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Planes para cada objetivo
          </h1>
          <p className="text-xl text-slate-400">
            Comienza gratis, escala cuando quieras. Sin contratos de permanencia.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                plan.highlight 
                  ? 'bg-slate-900/80 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 transform md:-translate-y-4 z-10' 
                  : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badges */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {plan.badge}
                </div>
              )}
              {plan.savings && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full shadow-lg">
                  {plan.savings}
                </div>
              )}

              {/* Header Card */}
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-200'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white">{plan.price}€</span>
                  <span className="text-slate-500 font-medium">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400 mt-4">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className={`mt-0.5 p-1 rounded-full ${plan.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link 
                href={plan.ctaLink}
                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02]'
                    : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Guarantee Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Garantía de devolución de dinero de 14 días en planes anuales.</span>
          </div>
        </div>

      </main>
    </div>
  );
}