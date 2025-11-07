import { Card } from "@/components/ui/card";
import { Calendar, Flame, Award } from "lucide-react";

interface CalendarData {
  streak: number;
  totalActiveDays: number;
  submissionCalendar: string;
}

interface ActivityCalendarProps {
  calendar: CalendarData;
}

const ActivityCalendar = ({ calendar }: ActivityCalendarProps) => {
  const parseCalendar = (calendarStr: string) => {
    try {
      return JSON.parse(calendarStr);
    } catch {
      return {};
    }
  };

  const submissions = parseCalendar(calendar.submissionCalendar);
  const dates = Object.keys(submissions).sort();
  const recentDates = dates.slice(-90); // Last 90 days

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-background/30 border-primary/10";
    if (count <= 2) return "bg-primary/20 border-primary/30";
    if (count <= 5) return "bg-primary/40 border-primary/50";
    if (count <= 10) return "bg-primary/60 border-primary/70";
    return "bg-primary border-primary";
  };

  return (
    <Card className="glass-card p-6 neon-border animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-orbitron font-bold gradient-text">
          Activity Calendar
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold text-accent">{calendar.streak} days</p>
        </div>

        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Days</span>
          </div>
          <p className="text-2xl font-bold text-primary">{calendar.totalActiveDays}</p>
        </div>

        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-chart-medium" />
            <span className="text-sm text-muted-foreground">Last 90 Days</span>
          </div>
          <p className="text-2xl font-bold text-chart-medium">
            {recentDates.filter(d => submissions[d] > 0).length} days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-15 gap-1 max-w-full overflow-x-auto custom-scrollbar pb-2">
        {recentDates.map((timestamp) => {
          const count = submissions[timestamp] || 0;
          return (
            <div
              key={timestamp}
              className={`w-3 h-3 rounded-sm border transition-all hover:scale-125 ${getIntensity(
                count
              )}`}
              title={`${new Date(parseInt(timestamp) * 1000).toLocaleDateString()}: ${count} submissions`}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityCalendar;
