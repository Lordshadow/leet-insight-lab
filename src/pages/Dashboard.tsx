import { useState, useEffect } from "react";
import { Search, Target, Flame, Loader2 } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import StatsCard from "@/components/dashboard/StatsCard";
import DifficultyChart from "@/components/dashboard/DifficultyChart";
import RecommendationsCard from "@/components/dashboard/RecommendationsCard";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import RecentSubmissions from "@/components/dashboard/RecentSubmissions";
import ActivityCalendar from "@/components/dashboard/ActivityCalendar";
import ContestRating from "@/components/dashboard/ContestRating";
import SkillsRadar from "@/components/dashboard/SkillsRadar";

interface UserStats {
  username: string;
  realName?: string;
  ranking: number;
  avatar?: string;
  reputation?: number;
  starRating?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  calendar?: any;
  contestRanking?: any;
  skills?: any;
  recentSubmissions?: any[];
}

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
      handleSearch(usernameParam);
    }
  }, [searchParams]);

  const handleSearch = async (usernameToSearch?: string) => {
    const userToSearch = usernameToSearch || username;
    if (!userToSearch.trim()) {
      toast({
        title: "Error",
        description: "Please enter a LeetCode username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-leetcode-data', {
        body: { username: userToSearch.trim() }
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

      setUserStats(data);
      setSearchedUser(userToSearch.trim());
      
      toast({
        title: "Success!",
        description: `Loaded stats for ${data.username}`,
      });

    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch LeetCode data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <CyberButton 
              variant="cyber" 
              size="lg" 
              onClick={() => handleSearch()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Analyze
                </>
              )}
            </CyberButton>
          </div>
        </div>

        {searchedUser && userStats && (
          <>
            {/* Profile Header */}
            <ProfileHeader
              username={userStats.username}
              realName={userStats.realName}
              ranking={userStats.ranking}
              avatar={userStats.avatar}
              reputation={userStats.reputation}
              starRating={userStats.starRating}
            />

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
              <StatsCard
                title="Total Solved"
                value={userStats.totalSolved}
                icon={Target}
                color="primary"
              />
              <StatsCard
                title="Easy Problems"
                value={userStats.easySolved}
                icon={Flame}
                color="chart-easy"
              />
              <StatsCard
                title="Medium Problems"
                value={userStats.mediumSolved}
                icon={Flame}
                color="chart-medium"
              />
              <StatsCard
                title="Hard Problems"
                value={userStats.hardSolved}
                icon={Flame}
                color="chart-hard"
              />
            </div>

            {/* Activity and Contest */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {userStats.calendar && <ActivityCalendar calendar={userStats.calendar} />}
              <ContestRating contest={userStats.contestRanking} />
            </div>

            {/* Charts and Skills */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <DifficultyChart
                easy={userStats.easySolved}
                medium={userStats.mediumSolved}
                hard={userStats.hardSolved}
              />
              {userStats.skills && <SkillsRadar skills={userStats.skills} />}
            </div>

            {/* Recent Submissions and Recommendations */}
            <div className="grid lg:grid-cols-2 gap-8">
              {userStats.recentSubmissions && (
                <RecentSubmissions submissions={userStats.recentSubmissions} />
              )}
              <RecommendationsCard userStats={userStats} />
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
