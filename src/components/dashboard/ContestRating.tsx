import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";

interface ContestData {
  rating: number;
  globalRanking: number;
  topPercentage: number;
  attendedContestsCount: number;
}

interface ContestRatingProps {
  contest: ContestData | null;
}

const ContestRating = ({ contest }: ContestRatingProps) => {
  if (!contest) {
    return (
      <Card className="glass-card p-6 neon-border animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-orbitron font-bold gradient-text">
            Contest Performance
          </h3>
        </div>
        <p className="text-center text-muted-foreground py-8">
          No contest participation data
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 neon-border animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-orbitron font-bold gradient-text">
          Contest Performance
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Rating</span>
          </div>
          <p className="text-3xl font-bold text-accent">{Math.round(contest.rating)}</p>
        </div>

        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Global Rank</span>
          </div>
          <p className="text-3xl font-bold text-primary">
            #{contest.globalRanking.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-chart-medium" />
            <span className="text-sm text-muted-foreground">Top Percentage</span>
          </div>
          <p className="text-3xl font-bold text-chart-medium">
            {contest.topPercentage.toFixed(2)}%
          </p>
        </div>

        <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-chart-easy" />
            <span className="text-sm text-muted-foreground">Contests</span>
          </div>
          <p className="text-3xl font-bold text-chart-easy">
            {contest.attendedContestsCount}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ContestRating;
