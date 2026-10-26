import React from 'react';

 
export const GridBackground = ({
  children,
  className = '',
  gridSize = 48,
  showGlow = true,
  glowPosition = 'both',
  mask = 'fade-bottom',
  isFullPage = false,
  ...props
}) => {
  // Determine mask style
  const getMaskClass = () => {
    switch (mask) {
      case 'fade-bottom':
        return '[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]';
      case 'radial':
        return '[mask-image:radial-gradient(ellipse_80%_60%_at_50%_25%,black_50%,transparent_100%)]';
      case 'none':
      default:
        return '';
    }
  };

  // Inline background grid styling for precise pixel sizing
  const gridStyle = {
    backgroundSize: `${gridSize}px ${gridSize}px`,
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-50 dark:bg-[#07080b] text-slate-900 dark:text-slate-100 transition-colors ${
        isFullPage ? 'min-h-screen w-full' : ''
      } ${className}`}
      {...props}
    >
      {/* Background Container Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Crisp Square Grid Pattern (Tailored for Dark Theme) */}
        <div
          style={gridStyle}
          className={`absolute inset-0 square-grid-pattern opacity-80 dark:opacity-100 ${getMaskClass()}`}
        />

        {/* Ambient Glow Effects (matching the uploaded design) */}
        {showGlow && (
          <>
            {/* Left/Corner Soft Violet-Amber Ambient Glow */}
            {(glowPosition === 'top-left' || glowPosition === 'both') && (
              <div className="absolute -top-12 -left-16 w-96 h-96 bg-gradient-to-br from-amber-500/15 via-primary/10 to-transparent dark:from-amber-600/10 dark:via-purple-900/10 dark:to-transparent rounded-full blur-3xl animate-pulse-glow" />
            )}

            {/* Center/Top Ambient Backlight */}
            {(glowPosition === 'center' || glowPosition === 'both') && (
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-gradient-to-b from-primary/15 via-yellow-500/10 to-transparent dark:from-primary/10 dark:via-amber-500/5 dark:to-transparent rounded-full blur-[110px]" />
            )}

            {/* Right Ambient Soft Glow */}
            {glowPosition === 'both' && (
              <div className="absolute top-1/4 -right-24 w-80 h-80 bg-gradient-to-bl from-primary/10 to-transparent dark:from-yellow-500/5 dark:to-transparent rounded-full blur-3xl animate-float-reverse" />
            )}
          </>
        )}
      </div>

      {/* Content Layer */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export default GridBackground;
