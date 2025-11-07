import { useState } from "react";
import { GitCompare, Loader2, Search } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import DifficultyChart from "@/components/dashboard/DifficultyChart";
import { Target, Flame } from "lucide-react";

const Compare = () => {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [user1Data, setUser1Data] = useState<any>(null);
  const [user2Data, setUser2Data] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!username1.trim() || !username2.trim()) {
      toast({
        title: "Error",
        description: "Please enter both usernames",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const [result1, result2] = await Promise.all([
        supabase.functions.invoke('fetch-leetcode-data', {
          body: { username: username1.trim() }
        }),
        supabase.functions.invoke('fetch-leetcode-data', {
          body: { username: username2.trim() }
        })
      ]);

      if (result1.error) throw new Error(`User 1: ${result1.error.message}`);
      if (result2.error) throw new Error(`User 2: ${result2.error.message}`);
      if (result1.data.error) throw new Error(`User 1: ${result1.data.error}`);
      if (result2.data.error) throw new Error(`User 2: ${result2.data.error}`);

      setUser1Data(result1.data);
      setUser2Data(result2.data);
      
      toast({
        title: "Success!",
        description: "Loaded comparison data",
      });

    } catch (error) {
      console.error('Error comparing users:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch data",
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
          <div className="flex items-center gap-3 mb-6">
            <GitCompare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-orbitron font-bold gradient-text">
              Compare Profiles
            </h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              placeholder="First LeetCode username..."
              value={username1}
              onChange={(e) => setUsername1(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCompare()}
              className="bg-input border-primary/30 focus:border-primary h-12"
            />
            <Input
              type="text"
              placeholder="Second LeetCode username..."
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCompare()}
              className="bg-input border-primary/30 focus:border-primary h-12"
            />
          </div>
          
          <CyberButton 
            variant="cyber" 
            size="lg" 
            onClick={handleCompare}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Compare
              </>
            )}
          </CyberButton>
        </div>

        {user1Data && user2Data && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* User 1 */}
            <div className="space-y-6">
              <ProfileHeader
                username={user1Data.username}
                realName={user1Data.realName}
                ranking={user1Data.ranking}
                avatar={user1Data.avatar}
                reputation={user1Data.reputation}
                starRating={user1Data.starRating}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <StatsCard
                  title="Total Solved"
                  value={user1Data.totalSolved}
                  icon={Target}
                  color="primary"
                />
                <StatsCard
                  title="Easy"
                  value={user1Data.easySolved}
                  icon={Flame}
                  color="chart-easy"
                />
                <StatsCard
                  title="Medium"
                  value={user1Data.mediumSolved}
                  icon={Flame}
                  color="chart-medium"
                />
                <StatsCard
                  title="Hard"
                  value={user1Data.hardSolved}
                  icon={Flame}
                  color="chart-hard"
                />
              </div>
              
              <DifficultyChart
                easy={user1Data.easySolved}
                medium={user1Data.mediumSolved}
                hard={user1Data.hardSolved}
              />
            </div>

            {/* User 2 */}
            <div className="space-y-6">
              <ProfileHeader
                username={user2Data.username}
                realName={user2Data.realName}
                ranking={user2Data.ranking}
                avatar={user2Data.avatar}
                reputation={user2Data.reputation}
                starRating={user2Data.starRating}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <StatsCard
                  title="Total Solved"
                  value={user2Data.totalSolved}
                  icon={Target}
                  color="primary"
                />
                <StatsCard
                  title="Easy"
                  value={user2Data.easySolved}
                  icon={Flame}
                  color="chart-easy"
                />
                <StatsCard
                  title="Medium"
                  value={user2Data.mediumSolved}
                  icon={Flame}
                  color="chart-medium"
                />
                <StatsCard
                  title="Hard"
                  value={user2Data.hardSolved}
                  icon={Flame}
                  color="chart-hard"
                />
              </div>
              
              <DifficultyChart
                easy={user2Data.easySolved}
                medium={user2Data.mediumSolved}
                hard={user2Data.hardSolved}
              />
            </div>
          </div>
        )}

        {!user1Data && !user2Data && (
          <div className="glass-card p-16 text-center neon-border">
            <GitCompare className="w-24 h-24 text-primary/50 mx-auto mb-6" />
            <h3 className="text-2xl font-orbitron font-bold mb-4">
              Ready to Compare
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter two LeetCode usernames above to see a side-by-side comparison of their performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
