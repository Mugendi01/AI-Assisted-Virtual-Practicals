import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-200
      ${hover ? 'hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
