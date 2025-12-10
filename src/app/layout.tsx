import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// NOTA: Asumiendo que PublicHeader y PublicFooter están tipados en sus archivos originales
import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer';

// Define la fuente Inter
const inter = Inter({ subsets: ['latin'] });

// 1. Metadatos (ya correctamente definidos)
export const metadata: Metadata = {
  title: {
    template: '%s | Web App',
    default: 'Web App - Tu Nutricionista y Entrenador IA',
  },
  description: 'Logra tus objetivos físicos con planes de alimentación y entrenamiento generados por Inteligencia Artificial.',
  keywords: ['nutrición', 'ia', 'fitness', 'entrenamiento', 'dieta', 'salud'],
  authors: [{ name: 'Web App Team' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://webapp.com',
    siteName: 'Web App',
  },
};

// 2. Definición del PublicLayout (como un componente simple)
// NOTA: En la estructura de Next.js 13/14, si este es un layout anidado,
// se define como una función exportada por defecto. Aquí lo definimos como un componente.
// He asumido que quieres que sea el layout principal (RootLayout) con el header y footer.

interface PublicLayoutProps {
  children: React.ReactNode;
}

// Renombramos el export default original a RootLayout para mantener la convención de Next.js
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      {/* Contenido principal con padding para que el header fijo no lo cubra */}
      <main className="min-h-screen pt-16 pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}

// 3. RootLayout que envuelve la estructura HTML básica
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-white antialiased min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200`}>
        {/* Aquí renderizamos el layout con Header/Footer */}
        <PublicLayout>
          {children}
        </PublicLayout>
      </body>
    </html>
  );
}