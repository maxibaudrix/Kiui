import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, ShoppingCart, 
  Utensils, User, Settings, LogOut, Menu, X, 
  Dumbbell, ScanLine
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

// --- SIDEBAR ITEM COMPONENT ---
const SidebarItem = ({ icon: Icon, label, href, active }: any) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
      active 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`} />
    <span className="font-medium">{label}</span>
  </Link>
);

// --- MAIN LAYOUT COMPONENT ---
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumen', href: '/dashboard' },
    { icon: BookOpen, label: 'Diario', href: '/diary' },
    { icon: Dumbbell, label: 'Entreno', href: '/training' },
    { icon: ShoppingCart, label: 'Compra', href: '/shopping' },
    { icon: Utensils, label: 'Recetas', href: '/recipes' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 fixed inset-y-0 left-0 z-40">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Logo />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              active={pathname === item.href} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarItem icon={User} label="Perfil" href="/profile" active={pathname === '/profile'} />
          <SidebarItem icon={Settings} label="Ajustes" href="/settings" active={pathname === '/settings'} />
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-900/10 hover:text-red-400 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 w-full h-16 bg-slate-950/90 backdrop-blur border-b border-slate-800 z-40 flex items-center justify-between px-4">
        <Logo showText={false} />
        <span className="font-bold text-white">Sporvit</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-slate-950 z-30 p-4 animate-in fade-in">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem key={item.href} {...item} active={pathname === item.href} />
            ))}
            <div className="h-px bg-slate-800 my-4" />
            <SidebarItem icon={Settings} label="Ajustes" href="/settings" />
            <SidebarItem icon={LogOut} label="Cerrar Sesión" href="#" />
          </nav>
        </div>
      )}

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile header */}
        
        {/* Content */}
        <main className="flex-1 relative">
          {children}
        </main>

        {/* --- MOBILE BOTTOM NAV (FAB) --- */}
        {/* Solo visible en móvil, acceso rápido al escáner */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Link href="/scanner">
            <button className="w-14 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-slate-950 hover:scale-110 transition-transform">
              <ScanLine className="w-7 h-7" />
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
};