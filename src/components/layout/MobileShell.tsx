import React from 'react';

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col ${className}`}>
      {children}
    </div>
  );
};
