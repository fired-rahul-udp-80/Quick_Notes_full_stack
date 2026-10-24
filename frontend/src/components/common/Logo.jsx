import React from 'react';
import { BookOpen } from 'lucide-react';

export const Logo = ({ size = 'md', className = '', onClick }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs ${
        isLarge ? 'w-11 h-11' : isSmall ? 'w-7 h-7' : 'w-9 h-9'
      }`}>
        <BookOpen className={isLarge ? 'w-6 h-6 stroke-[2.2]' : isSmall ? 'w-4 h-4' : 'w-5 h-5 stroke-[2.2]'} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-900 ${
          isLarge ? 'text-2xl leading-none' : isSmall ? 'text-base leading-none' : 'text-lg leading-tight'
        }`}>
          NIU <span className="text-indigo-600">Notes</span>
        </span>
        {isLarge && (
          <span className="text-xs text-slate-500 font-medium mt-0.5 tracking-normal">
            Your notes. Your courses. Your learning.
          </span>
        )}
      </div>
    </div>
  );
};
