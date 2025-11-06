import { useState, useEffect } from "react";
import { Brain, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  title: string;
  difficulty: string;
  tags: string[];
  reason: string;
  url: string;
}

interface UserStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

interface RecommendationsCardProps {
  userStats: UserStats;
}

const RecommendationsCard = ({ userStats }: RecommendationsCardProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-ai-recommendations', {
        body: userStats
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setRecommendations(data.recommendations);
      
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userStats.username]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-chart-easy/20 text-chart-easy border-chart-easy/30";
      case "Medium": return "bg-chart-medium/20 text-chart-medium border-chart-medium/30";
      case "Hard": return "bg-chart-hard/20 text-chart-hard border-chart-hard/30";
      default: return "bg-primary/20 text-primary";
    }
  };

  return (
    <div className="data-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center animate-glow-pulse">
          <Brain className="w-5 h-5 text-background" />
        </div>
        <h3 className="text-xl font-orbitron font-bold">AI Recommendations</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        AI-powered problem suggestions based on {userStats.username}'s performance
      </p>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Analyzing your profile...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold group-hover:text-primary transition-colors">
                {rec.title}
              </h4>
              <Badge className={getDifficultyColor(rec.difficulty)}>
                {rec.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {rec.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
            <CyberButton 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(rec.url, '_blank')}
              className="w-full"
            >
              Solve on LeetCode
              <ExternalLink className="w-3 h-3 ml-2" />
            </CyberButton>
          </div>
        ))}
          </div>

          <CyberButton 
            variant="outline" 
            className="w-full mt-6"
            onClick={fetchRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Recommendations
          </CyberButton>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No recommendations yet</p>
          <CyberButton 
            variant="cyber" 
            onClick={fetchRecommendations}
            disabled={isLoading}
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate Recommendations
          </CyberButton>
        </div>
      )}
    </div>
  );
};

export default RecommendationsCard;
