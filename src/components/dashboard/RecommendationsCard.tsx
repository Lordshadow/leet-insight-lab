import { Brain, ExternalLink } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Badge } from "@/components/ui/badge";

interface RecommendationsCardProps {
  username: string;
}

const RecommendationsCard = ({ username }: RecommendationsCardProps) => {
  // Mock recommendations - in real app, this would come from AI
  const recommendations = [
    {
      title: "Two Sum II",
      difficulty: "Medium",
      tags: ["Array", "Two Pointers"],
      reason: "Strengthen your two-pointer technique",
      url: "https://leetcode.com/problems/two-sum-ii"
    },
    {
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      tags: ["String", "Dynamic Programming"],
      reason: "Practice DP patterns",
      url: "https://leetcode.com/problems/longest-palindromic-substring"
    },
    {
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      tags: ["Tree", "DFS"],
      reason: "Challenge your tree traversal skills",
      url: "https://leetcode.com/problems/binary-tree-maximum-path-sum"
    },
  ];

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
        Personalized problem suggestions based on {username}'s profile
      </p>

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

      <CyberButton variant="outline" className="w-full mt-6">
        <Brain className="w-4 h-4 mr-2" />
        Get More Recommendations
      </CyberButton>
    </div>
  );
};

export default RecommendationsCard;
