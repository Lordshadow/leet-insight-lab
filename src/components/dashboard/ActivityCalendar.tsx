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
  const dates = Object.keys(submissions).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Get last 365 days for a full year view
  const today = Math.floor(Date.now() / 1000);
  const oneYearAgo = today - (365 * 24 * 60 * 60);
  const recentDates = dates.filter(timestamp => parseInt(timestamp) >= oneYearAgo);

  // Organize dates into weeks (7 days per week, starting from Sunday)
  const getWeekData = () => {
    const weeks: { [key: string]: number }[][] = [];
    let currentWeek: { [key: string]: number }[] = [];
    
    // Get the day of week for the first date (0 = Sunday, 6 = Saturday)
    const firstDate = recentDates.length > 0 ? new Date(parseInt(recentDates[0]) * 1000) : new Date();
    const firstDayOfWeek = firstDate.getDay();
    
    // Fill empty cells at the start
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({});
    }
    
    // Fill in the actual dates
    recentDates.forEach((timestamp) => {
      const count = submissions[timestamp] || 0;
      currentWeek.push({ [timestamp]: count });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Fill remaining cells in the last week
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({});
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = getWeekData();

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
            <span className="text-sm text-muted-foreground">Last Year</span>
          </div>
          <p className="text-2xl font-bold text-chart-medium">
            {recentDates.filter(d => submissions[d] > 0).length} days
          </p>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => {
                const timestamp = Object.keys(day)[0];
                const count = timestamp ? day[timestamp] : 0;
                const isEmpty = !timestamp;
                
                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`w-3 h-3 rounded-sm border transition-all ${
                      isEmpty 
                        ? "bg-transparent border-transparent" 
                        : `hover:scale-150 cursor-pointer ${getIntensity(count)}`
                    }`}
                    title={
                      timestamp
                        ? `${new Date(parseInt(timestamp) * 1000).toLocaleDateString()}: ${count} submissions`
                        : ""
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 items-center mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-background/30 border border-primary/10" />
            <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/40 border border-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/70" />
            <div className="w-3 h-3 rounded-sm bg-primary border border-primary" />
          </div>
          <span>More</span>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCalendar;
