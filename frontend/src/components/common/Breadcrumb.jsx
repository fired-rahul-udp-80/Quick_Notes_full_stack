import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center text-xs sm:text-sm text-slate-500 font-medium mb-4 overflow-x-auto whitespace-nowrap py-1">
      <button
        onClick={() => navigate('/student/dashboard')}
        className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors text-slate-500 cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold">{item.label}</span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-indigo-600 transition-colors text-slate-500"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
