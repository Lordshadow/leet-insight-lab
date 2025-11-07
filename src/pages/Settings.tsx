import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Trash2, User } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [newProfile, setNewProfile] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("leetcode-saved-profiles");
    if (saved) {
      setSavedProfiles(JSON.parse(saved));
    }
  }, []);

  const saveProfiles = (profiles: string[]) => {
    localStorage.setItem("leetcode-saved-profiles", JSON.stringify(profiles));
    setSavedProfiles(profiles);
  };

  const handleAddProfile = () => {
    if (!newProfile.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    if (savedProfiles.includes(newProfile.trim())) {
      toast({
        title: "Already Saved",
        description: "This profile is already in your saved list",
        variant: "destructive",
      });
      return;
    }

    const updated = [...savedProfiles, newProfile.trim()];
    saveProfiles(updated);
    setNewProfile("");
    
    toast({
      title: "Success!",
      description: "Profile saved successfully",
    });
  };

  const handleRemoveProfile = (username: string) => {
    const updated = savedProfiles.filter(p => p !== username);
    saveProfiles(updated);
    
    toast({
      title: "Removed",
      description: "Profile removed from saved list",
    });
  };

  const handleViewProfile = (username: string) => {
    navigate(`/dashboard?username=${username}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="glass-card p-8 neon-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center animate-glow-pulse">
              <SettingsIcon className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold gradient-text">Settings</h1>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-orbitron font-bold mb-4">Saved Profiles</h3>
              <p className="text-muted-foreground mb-4">
                Save your frequently viewed LeetCode profiles for quick access.
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter LeetCode username..."
                  value={newProfile}
                  onChange={(e) => setNewProfile(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddProfile()}
                  className="bg-input border-primary/30 focus:border-primary"
                />
                <CyberButton variant="cyber" onClick={handleAddProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Add
                </CyberButton>
              </div>

              {savedProfiles.length > 0 ? (
                <div className="space-y-2">
                  {savedProfiles.map((username) => (
                    <div
                      key={username}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <span className="font-medium">{username}</span>
                      </div>
                      <div className="flex gap-2">
                        <CyberButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(username)}
                        >
                          View
                        </CyberButton>
                        <CyberButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProfile(username)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </CyberButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-lg border-2 border-dashed border-primary/30 text-center">
                  <p className="text-muted-foreground">No saved profiles yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
