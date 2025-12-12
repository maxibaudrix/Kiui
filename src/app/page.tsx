// src/app/page  
'use client';
import React, { useState, useEffect } from 'react';
import { Camera, Dumbbell, Brain, ChevronRight, Check, Menu, X, Star, TrendingUp, Zap, Target, Calendar, BarChart3, Award, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SporvitLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Scanner Inteligente",
      description: "Escanea cualquier producto y descubre si es bueno PARA TI según tus objetivos personales",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA Adaptativa",
      description: "Tu entrenamiento se ajusta automáticamente según lo que comes. Come más, entrena más intenso",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Chef Zero Desperdicio",
      description: "Escanea tu despensa y obtén recetas perfectas que cumplen tus macros del día",
      color: "from-orange-500 to-amber-600"
    }
  ];

  const stats = [
    { value: "100K+", label: "Productos Escaneados" },
    { value: "15K+", label: "Usuarios Activos" },
    { value: "95%", label: "Satisfacción" },
    { value: "4.8", label: "Rating App" }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Pérdida de 12kg en 4 meses",
      image: "MG",
      text: "Finalmente entiendo qué alimentos son buenos para MI objetivo. El scanner me cambió la vida.",
      rating: 5
    },
    {
      name: "Carlos Ruiz",
      role: "Ganancia muscular limpia",
      image: "CR",
      text: "La IA adaptativa es brutal. Si me paso de calorías, me ajusta el entreno automáticamente.",
      rating: 5
    },
    {
      name: "Laura Martín",
      role: "Triatleta amateur",
      image: "LM",
      text: "Las recetas generadas desde mi despensa me ahorran 3 horas semanales de planificación.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      period: "siempre",
      features: [
        "5 escaneos diarios",
        "Calculadoras básicas",
        "Diario nutricional",
        "Comunidad Sporvit"
      ],
      cta: "Empezar Gratis",
      highlighted: false
    },
    {
      name: "Pro",
      price: "9.99",
      period: "mes",
      features: [
        "Escaneos ilimitados",
        "IA Adaptativa completa",
        "Generador de recetas",
        "Meal Planner semanal",
        "Sin anuncios",
        "Soporte prioritario"
      ],
      cta: "Prueba 7 días gratis",
      highlighted: true,
      badge: "MÁS POPULAR"
    },
    {
      name: "Pro Annual",
      price: "99",
      period: "año",
      savings: "Ahorra 20€",
      features: [
        "Todo de Pro",
        "2 meses gratis",
        "Acceso beta features",
        "Consulta nutricional",
        "Exportar datos"
      ],
      cta: "Mejor Valor",
      highlighted: false
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Configura tu perfil",
      description: "Completa el onboarding de 3 minutos: objetivos, actividad y preferencias dietéticas",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: "2",
      title: "Escanea y descubre",
      description: "Usa el scanner en el súper. Verde ✓ para ti, Rojo ✗ mejor evítalo",
      icon: <Camera className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Entrena inteligente",
      description: "La IA ajusta tu entrenamiento según tu ingesta real. Sin pensar, solo fluye",
      icon: <Zap className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Alcanza tu objetivo",
      description: "Seguimiento en tiempo real de tu progreso con predicciones basadas en datos",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">   
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Lanzamiento 2024 - Únete a 15K usuarios</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Tu nutrición y entreno,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              perfectamente sincronizados
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            La única app que adapta tu entrenamiento según lo que comes en tiempo real. 
            Scanner IA + Nutrición + Fitness en una sola plataforma.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Empezar Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-full font-semibold text-lg hover:bg-slate-800 transition-all backdrop-blur-sm">
              Ver Demo (2 min)
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-slate-950"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-slate-950"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-slate-950"></div>
              </div>
              <span>+15K usuarios activos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>4.8/5 rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>App del mes</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Screenshot */}
        <div className="container mx-auto mt-16 px-4">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/50 backdrop-blur-sm">
              <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="text-center space-y-4">
                  <Camera className="w-24 h-24 mx-auto text-emerald-400 opacity-50" />
                  <p className="text-slate-500">Screenshot de la app - Scanner en acción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tres herramientas,
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> un objetivo</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Tecnología que se adapta a ti, no tú a ella
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 flex items-center text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Descubre más</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Empieza en <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">3 minutos</span>
            </h2>
            <p className="text-xl text-slate-400">Sin complicaciones, sin curva de aprendizaje</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start gap-6 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-emerald-400">{item.icon}</div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que dicen nuestros <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">usuarios</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {testimonials[activeTestimonial].image}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex mb-3">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xl text-slate-300 mb-6 leading-relaxed italic">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  <div>
                    <div className="font-bold text-lg">{testimonials[activeTestimonial].name}</div>
                    <div className="text-emerald-400">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeTestimonial === index 
                        ? 'bg-emerald-400 w-8' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Planes para cada <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">objetivo</span>
            </h2>
            <p className="text-xl text-slate-400">Comienza gratis, escala cuando quieras</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105'
                    : 'bg-slate-800/50 border border-slate-700/50'
                } backdrop-blur-sm`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1 mb-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-slate-400 mb-2">€/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-emerald-400 text-sm font-medium">{plan.savings}</div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-slate-400">
            <p>¿Eres empresa o profesional? <Link href="/under-construction" className="text-emerald-400 hover:underline">Ver planes B2B</Link></p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 text-center border border-slate-700/50">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Empieza hoy tu <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">transformación</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Únete a miles de personas que ya están alcanzando sus objetivos con Sporvit
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
                Comenzar Gratis - Sin Tarjeta
              </button>
              <p className="text-sm text-slate-500 mt-4">7 días de prueba Pro · Cancela cuando quieras</p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default SporvitLanding;


