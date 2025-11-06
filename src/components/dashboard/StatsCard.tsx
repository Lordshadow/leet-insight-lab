import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, color = "primary" }: StatsCardProps) => {
  const colorClass = color === "primary" ? "text-primary" : 
                     color === "secondary" ? "text-secondary" :
                     color === "chart-easy" ? "text-chart-easy" :
                     color === "chart-hard" ? "text-chart-hard" :
                     "text-primary";

  return (
    <div className="data-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center group-hover:animate-glow-pulse`}>
          <Icon className="w-6 h-6 text-background" />
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <div className={`text-3xl font-orbitron font-bold mb-1 ${colorClass}`}>
        {value.toLocaleString()}
      </div>
      {trend && (
        <p className="text-xs text-muted-foreground">{trend}</p>
      )}
    </div>
  );
};

export default StatsCard;
