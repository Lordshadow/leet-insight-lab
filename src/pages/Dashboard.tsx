import { useState } from "react";
import { Search, Trophy, Target, Flame } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/dashboard/StatsCard";
import DifficultyChart from "@/components/dashboard/DifficultyChart";
import RecommendationsCard from "@/components/dashboard/RecommendationsCard";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState("");

  const handleSearch = () => {
    if (username.trim()) {
      setSearchedUser(username);
      // In a real app, this would trigger an API call
    }
  };

  // Mock data for demonstration
  const mockStats = {
    totalSolved: 487,
    easySolved: 234,
    mediumSolved: 189,
    hardSolved: 64,
    contestRating: 1842,
    ranking: 15234,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="glass-card p-8 mb-8 neon-border">
          <h1 className="text-3xl font-orbitron font-bold mb-6 gradient-text">
            LeetCode Analytics Dashboard
          </h1>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter LeetCode username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="bg-input border-primary/30 focus:border-primary h-12 text-lg"
              />
            </div>
            <CyberButton variant="cyber" size="lg" onClick={handleSearch}>
              <Search className="w-5 h-5 mr-2" />
              Analyze
            </CyberButton>
          </div>
        </div>

        {searchedUser && (
          <>
            {/* Profile Header */}
            <div className="glass-card p-6 mb-8 neon-border animate-slide-up">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-cyber flex items-center justify-center text-3xl font-orbitron font-bold animate-glow-pulse">
                  {searchedUser.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-orbitron font-bold">{searchedUser}</h2>
                  <p className="text-muted-foreground">Rank: #{mockStats.ranking.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Solved"
                value={mockStats.totalSolved}
                icon={Target}
                trend="+12 this week"
                color="primary"
              />
              <StatsCard
                title="Contest Rating"
                value={mockStats.contestRating}
                icon={Trophy}
                trend="Top 15%"
                color="secondary"
              />
              <StatsCard
                title="Easy Problems"
                value={mockStats.easySolved}
                icon={Flame}
                color="chart-easy"
              />
              <StatsCard
                title="Hard Problems"
                value={mockStats.hardSolved}
                icon={Flame}
                color="chart-hard"
              />
            </div>

            {/* Charts and Recommendations */}
            <div className="grid lg:grid-cols-2 gap-8">
              <DifficultyChart
                easy={mockStats.easySolved}
                medium={mockStats.mediumSolved}
                hard={mockStats.hardSolved}
              />
              <RecommendationsCard username={searchedUser} />
            </div>
          </>
        )}

        {!searchedUser && (
          <div className="glass-card p-16 text-center neon-border">
            <div className="w-24 h-24 rounded-full bg-gradient-cyber/20 flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-orbitron font-bold mb-4">
              Start Your Analysis
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a LeetCode username above to view detailed analytics, performance metrics, and AI-powered problem recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
