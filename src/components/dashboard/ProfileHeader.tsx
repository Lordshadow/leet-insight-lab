import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, TrendingUp } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  realName?: string;
  ranking: number;
  avatar?: string;
  reputation?: number;
  starRating?: number;
}

const ProfileHeader = ({ 
  username, 
  realName, 
  ranking, 
  avatar,
  reputation,
  starRating 
}: ProfileHeaderProps) => {
  return (
    <div className="glass-card p-6 neon-border animate-slide-up">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24 border-2 border-primary/50 animate-glow-pulse">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback className="bg-gradient-cyber text-2xl font-orbitron font-bold">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-3xl font-orbitron font-bold gradient-text mb-2">
            {username}
          </h2>
          {realName && (
            <p className="text-lg text-muted-foreground mb-3">{realName}</p>
          )}
          
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm">
                <span className="text-muted-foreground">Rank:</span>{" "}
                <span className="font-bold text-primary">#{ranking.toLocaleString()}</span>
              </span>
            </div>
            
            {reputation !== undefined && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-chart-medium" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Reputation:</span>{" "}
                  <span className="font-bold">{reputation}</span>
                </span>
              </div>
            )}
            
            {starRating !== undefined && starRating > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Rating:</span>{" "}
                  <span className="font-bold">{starRating.toFixed(1)}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
