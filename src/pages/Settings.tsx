import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Trash2, User, LogOut, LogIn } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Settings = () => {
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [newProfile, setNewProfile] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            loadProfiles();
          }, 0);
        } else {
          setSavedProfiles([]);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfiles();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_profiles")
        .select("leetcode_username")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSavedProfiles(data.map(p => p.leetcode_username));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load saved profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save profiles",
        variant: "destructive",
      });
      return;
    }

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

    try {
      const { error } = await supabase
        .from("saved_profiles")
        .insert({ 
          user_id: user.id, 
          leetcode_username: newProfile.trim() 
        });

      if (error) throw error;

      setSavedProfiles([...savedProfiles, newProfile.trim()]);
      setNewProfile("");
      
      toast({
        title: "Success!",
        description: "Profile saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProfile = async (username: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("saved_profiles")
        .delete()
        .eq("user_id", user.id)
        .eq("leetcode_username", username);

      if (error) throw error;

      setSavedProfiles(savedProfiles.filter(p => p !== username));
      
      toast({
        title: "Removed",
        description: "Profile removed from saved list",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out",
    });
  };

  const handleViewProfile = (username: string) => {
    navigate(`/dashboard?username=${username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="glass-card p-8 neon-border">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center animate-glow-pulse">
                <SettingsIcon className="w-6 h-6 text-background" />
              </div>
              <h1 className="text-3xl font-orbitron font-bold gradient-text">Settings</h1>
            </div>
            
            {user ? (
              <CyberButton variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </CyberButton>
            ) : (
              <CyberButton variant="cyber" onClick={() => navigate("/auth")}>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </CyberButton>
            )}
          </div>

          {!user && (
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-muted-foreground">
                Login to save your LeetCode profiles and access them from any device.
              </p>
            </div>
          )}

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
