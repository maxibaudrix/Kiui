// src/components/ui/Logo.tsx
import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'symbol' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorScheme?: 'default' | 'white' | 'black' | 'gradient';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { container: 32, text: 'text-lg', strokeWidth: 2.5 },
  md: { container: 48, text: 'text-2xl', strokeWidth: 2.5 },
  lg: { container: 64, text: 'text-3xl', strokeWidth: 2.5 },
  xl: { container: 96, text: 'text-5xl', strokeWidth: 2.5 },
};

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full',
  size = 'md',
  colorScheme = 'default',
  className = ''
}) => {
  const s = sizes[size];
  
  // Color schemes
  const colors = {
    default: {
      bracket: '#10B981',
      k: '#10B981',
      text: 'from-white to-slate-300'
    },
    white: {
      bracket: '#ffffff',
      k: '#ffffff',
      text: 'from-white to-white'
    },
    black: {
      bracket: '#000000',
      k: '#000000',
      text: 'from-slate-900 to-slate-900'
    },
    gradient: {
      bracket: 'url(#logoGradient)',
      k: 'url(#logoGradient)',
      text: 'from-emerald-400 to-teal-400'
    }
  };

  const currentColors = colors[colorScheme];

  const renderSymbol = () => (
    <svg 
      width={s.container} 
      height={s.container} 
      viewBox="0 0 48 48" 
      fill="none"
      className="flex-shrink-0"
    >
      {colorScheme === 'gradient' && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
      )}
      
      {/* Corchetes superiores (minimalista) */}
      <path 
        d="M 8 8 L 8 14 M 8 8 L 14 8" 
        stroke={currentColors.bracket} 
        strokeWidth={s.strokeWidth} 
        strokeLinecap="round"
      />
      <path 
        d="M 40 8 L 40 14 M 40 8 L 34 8" 
        stroke={currentColors.bracket} 
        strokeWidth={s.strokeWidth} 
        strokeLinecap="round"
      />
      
      {/* K simplificada y elegante */}
      <path 
        d="M 18 16 L 18 32" 
        stroke={currentColors.k} 
        strokeWidth={3.5} 
        strokeLinecap="round"
      />
      <path 
        d="M 18 24 L 30 16" 
        stroke={currentColors.k} 
        strokeWidth={3.5} 
        strokeLinecap="round"
      />
      <path 
        d="M 18 24 L 30 32" 
        stroke={currentColors.k} 
        strokeWidth={3.5} 
        strokeLinecap="round"
      />
      
      {/* Corchetes inferiores */}
      <path 
        d="M 8 40 L 8 34 M 8 40 L 14 40" 
        stroke={currentColors.bracket} 
        strokeWidth={s.strokeWidth} 
        strokeLinecap="round"
      />
      <path 
        d="M 40 40 L 40 34 M 40 40 L 34 40" 
        stroke={currentColors.bracket} 
        strokeWidth={s.strokeWidth} 
        strokeLinecap="round"
      />
    </svg>
  );

  const renderWordmark = () => (
    <span 
      className={`${s.text} font-bold tracking-tight bg-gradient-to-r ${currentColors.text} bg-clip-text text-transparent`}
    >
      Kiui
    </span>
  );

  if (variant === 'symbol') {
    return <div className={className}>{renderSymbol()}</div>;
  }

  if (variant === 'wordmark') {
    return <div className={className}>{renderWordmark()}</div>;
  }

  // variant === 'full'
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderSymbol()}
      {renderWordmark()}
    </div>
  );
};

// Export conveniente para casos específicos
export const LogoSymbol = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="symbol" />
);

export const LogoWordmark = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="wordmark" />
);

export default Logo;