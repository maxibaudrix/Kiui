import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Camera, Brain, Dumbbell, ScanLine, Zap, ChefHat, 
  ShieldCheck, BarChart3, ArrowRight, ChevronLeft 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Funcionalidades | Sporvit',
  description: 'Descubre las herramientas de IA que Sporvit pone a tu disposición: Escáner nutricional, Entrenador adaptativo y Chef Zero Desperdicio.',
};

export default function FeaturesPage() {
  const featuresList = [
    {
      id: 'scanner',
      icon: <Camera className="w-12 h-12 text-emerald-400" />,
      title: "Scanner Inteligente Contextual",
      subtitle: "No solo lee etiquetas, las interpreta para TI.",
      description: "La mayoría de apps te dicen las calorías. Sporvit te dice si ese producto te acerca o te aleja de tu objetivo específico. Analiza el grado de procesamiento (NOVA), el impacto ambiental (Eco-Score) y la densidad nutricional en segundos.",
      details: [
        "Detección de aditivos ocultos",
        "Análisis de micronutrientes",
        "Semáforo de compatibilidad con tu dieta",
        "Alternativas más saludables al instante"
      ],
      image: "https://placehold.co/600x400/064e3b/10b981?text=Scanner+Interface"
    },
    {
      id: 'ai-coach',
      icon: <Brain className="w-12 h-12 text-blue-400" />,
      title: "IA Adaptativa en Tiempo Real",
      subtitle: "Un plan que evoluciona contigo, cada día.",
      description: "Tu cuerpo no es estático, tu plan tampoco debería serlo. Si hoy comes más de la cuenta, la IA ajusta tu entrenamiento de mañana. Si te saltas un entreno, recalibra tus macros para compensar. Es como tener un entrenador personal vigilando 24/7.",
      details: [
        "Ajuste automático de cargas (Sobrecarga Progresiva)",
        "Recálculo de macros diario",
        "Gestión de fatiga y descanso",
        "Adaptación a lesiones o dolor"
      ],
      image: "https://placehold.co/600x400/1e1b4b/60a5fa?text=AI+Brain+Metrics"
    },
    {
      id: 'zero-waste',
      icon: <ChefHat className="w-12 h-12 text-orange-400" />,
      title: "Chef Zero Desperdicio",
      subtitle: "Ahorra dinero y come delicioso.",
      description: "¿Tienes la nevera llena de ingredientes sueltos? Nuestro algoritmo de 'Despensa Inversa' genera recetas gourmet que utilizan exactamente lo que tienes, cuadrando perfectamente con tus macros del día.",
      details: [
        "Generación de recetas por ingredientes",
        "Filtros por tiempo de cocción",
        "Instrucciones paso a paso",
        "Lista de la compra inteligente"
      ],
      image: "https://placehold.co/600x400/451a03/fbbf24?text=Smart+Kitchen"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      
      <main className="pt-16 pb-16">
        
        {/* --- HERO SECTION --- */}
        <section className="container mx-auto px-6 text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" /> Tecnología Propietaria
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Más que una App de Fitness
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Un ecosistema completo de herramientas diseñadas para eliminar la fricción entre tú y tus objetivos.
          </p>
        </section>

        {/* --- DEEP DIVE FEATURES --- */}
        <section className="container mx-auto px-6 space-y-32">
          {featuresList.map((feature, index) => (
            <div key={feature.id} id={feature.id} className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 mb-4 shadow-xl">
                  {feature.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {feature.title}
                </h2>
                <p className="text-xl text-emerald-400 font-medium">
                  {feature.subtitle}
                </p>
                <p className="text-slate-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Content */}
              <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Floating UI Elements Simulation */}
                  <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur p-4 rounded-xl border border-slate-800 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-mono text-emerald-200">Análisis completado con éxito</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </section>

        {/* --- EXTRA GRID --- */}
        <section className="container mx-auto px-6 mt-32">
          <h2 className="text-3xl font-bold text-center mb-16">Y mucho más...</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
              <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Analíticas Avanzadas</h3>
              <p className="text-slate-400 text-sm">Visualiza tu progreso con gráficos detallados de composición corporal.</p>
            </div>
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
              <ScanLine className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Código de Barras</h3>
              <p className="text-slate-400 text-sm">Base de datos con más de 2 millones de productos locales.</p>
            </div>
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 text-yellow-400 mb-4 font-bold text-2xl">⚡</div>
              <h3 className="text-xl font-bold mb-2">Rápido y Ligero</h3>
              <p className="text-slate-400 text-sm">Diseñado para no hacerte perder tiempo en el gimnasio.</p>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="container mx-auto px-6 mt-32 text-center">
          <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 p-12 rounded-3xl border border-emerald-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para probarlo?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">Empieza hoy con el plan gratuito y experimenta la diferencia de entrenar con inteligencia.</p>
            <Link 
              href="/onboarding" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
            >
              Comenzar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}