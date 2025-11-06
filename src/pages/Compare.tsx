import { GitCompare } from "lucide-react";

const Compare = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="glass-card p-16 text-center neon-border">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
            <GitCompare className="w-12 h-12 text-background" />
          </div>
          <h1 className="text-3xl font-orbitron font-bold mb-4 gradient-text">
            Compare Profiles
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Side-by-side comparison feature coming soon. Compare two LeetCode profiles to see performance differences and competitive insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Compare;
