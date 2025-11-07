import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface Submission {
  title: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface RecentSubmissionsProps {
  submissions: Submission[];
}

const RecentSubmissions = ({ submissions }: RecentSubmissionsProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Card className="glass-card p-6 neon-border animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-orbitron font-bold gradient-text">
          Recent Submissions
        </h3>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {submissions.length > 0 ? (
          submissions.map((sub, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-background/30 border border-primary/20 hover:border-primary/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{sub.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(sub.timestamp)} · {sub.lang}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {sub.statusDisplay === "Accepted" ? (
                    <CheckCircle2 className="w-5 h-5 text-chart-easy" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      sub.statusDisplay === "Accepted"
                        ? "text-chart-easy"
                        : "text-destructive"
                    }`}
                  >
                    {sub.statusDisplay}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No recent submissions found
          </p>
        )}
      </div>
    </Card>
  );
};

export default RecentSubmissions;
