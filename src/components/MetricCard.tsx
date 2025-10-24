import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  accentColor?: string;
}

export function MetricCard({ title, icon: Icon, children, accentColor = '#00ff88' }: MetricCardProps) {
  return (
    <div
      className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden"
      style={{
        boxShadow: `0 0 20px ${accentColor}20`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${accentColor}40`;
        e.currentTarget.style.borderColor = accentColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}20`;
        e.currentTarget.style.borderColor = '#1f2937';
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-100">{title}</h3>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon size={24} style={{ color: accentColor }} />
          </div>
        </div>

        <div className="space-y-3">
          {children}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
