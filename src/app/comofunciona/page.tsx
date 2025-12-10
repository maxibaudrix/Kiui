import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronLeft, UserCircle, Target, Play, 
  LineChart, ArrowRight, CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cómo Funciona | Sporvit',
  description: 'Entiende el proceso de transformación con Sporvit: Desde el análisis biométrico hasta el cumplimiento de objetivos.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Tu Perfil Biométrico",
      desc: "Todo empieza con datos. No usamos fórmulas genéricas. Analizamos tu edad, género, actividad diaria, historial de lesiones y preferencias alimentarias para crear un modelo base de tu metabolismo.",
      icon: UserCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      num: "02",
      title: "Definición de Objetivos",
      desc: "¿Quieres ganar fuerza máxima? ¿Perder grasa manteniendo músculo? ¿Correr una maratón? La IA configura tus macros y volumen de entreno específicamente para esa meta, ajustando la velocidad de progreso que desees.",
      icon: Target,
      color: "text-red-400",
      bg: "bg-red-500/10"
    },
    {
      num: "03",
      title: "El Ciclo Diario",
      desc: "Aquí ocurre la magia. Escaneas tus comidas y registras tus entrenos. La IA analiza tu rendimiento y adherencia en tiempo real. Si un día comes menos, el sistema te sugiere un snack nocturno o ajusta el entreno siguiente.",
      icon: Play,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      num: "04",
      title: "Adaptación y Mejora",
      desc: "Cada semana, revisas tu progreso con gráficos claros. Si te estancas, Sporvit detecta por qué (¿falta de sueño? ¿baja proteína?) y modifica el plan automáticamente para romper la meseta.",
      icon: LineChart,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      
    <main className="pt-16 pb-16">

        {/* --- HERO --- */}
        <section className="container mx-auto px-6 text-center mb-24 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            La ciencia de la <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Consistencia</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Sporvit no es magia, es ingeniería de datos aplicada a tu fisiología. 
            Olvídate de las dietas de moda; este es un sistema diseñado para funcionar a largo plazo.
          </p>
        </section>

        {/* --- TIMELINE STEPS --- */}
        <section className="container mx-auto px-6 relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 transform -translate-x-1/2" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Image / Visual Placeholder */}
                <div className="flex-1 w-full">
                  <div className="relative aspect-square md:aspect-[4/3] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl group">
                     {/* Step Number Overlay */}
                     <div className="absolute top-6 left-6 text-8xl font-black text-slate-800/50 select-none pointer-events-none">
                        {step.num}
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center shadow-lg`}>
                            <step.icon className={`w-10 h-10 ${step.color}`} />
                        </div>
                     </div>
                     {/* Mock UI Elements */}
                     <div className="absolute bottom-8 left-8 right-8 bg-slate-950/80 backdrop-blur p-4 rounded-xl border border-slate-800">
                        <div className="h-2 w-2/3 bg-slate-700 rounded mb-2"></div>
                        <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                     </div>
                  </div>
                </div>

                {/* Connector Dot (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-950 border-2 border-emerald-500 rounded-full z-10 items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>

                {/* Text Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${step.color}`}>Paso {step.num}</h3>
                  <h2 className="text-3xl font-bold text-white mb-4">{step.title}</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ MINI --- */}
        <section className="container mx-auto px-6 mt-32 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Preguntas Comunes</h2>
            <div className="space-y-4">
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-2">¿Necesito ir al gimnasio?</h4>
                    <p className="text-slate-400 text-sm">No. Sporvit puede generar planes para casa (con o sin equipo), calistenia o gimnasio completo.</p>
                </div>
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-white mb-2">¿Funciona para veganos?</h4>
                    <p className="text-slate-400 text-sm">Sí. Nuestro Chef IA prioriza fuentes de proteína vegetal completas y sugiere suplementación si es necesaria.</p>
                </div>
            </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section className="mt-24 py-20 bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Tu transformación comienza con un clic</h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-slate-400 mb-8">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Plan Gratuito disponible</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Sin compromiso</span>
                </div>
                <Link 
                    href="/onboarding" 
                    className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 text-slate-950 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
                >
                    Crear mi Plan Gratis
                </Link>
            </div>
        </section>

      </main>
    </div>
  );
}