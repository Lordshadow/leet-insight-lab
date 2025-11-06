import { Settings as SettingsIcon, Save } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

const Settings = () => {
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
                Your frequently viewed LeetCode profiles will appear here.
              </p>
              <div className="p-8 rounded-lg border-2 border-dashed border-primary/30 text-center">
                <p className="text-muted-foreground">No saved profiles yet</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-orbitron font-bold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20">
                  <div>
                    <div className="font-medium">Auto-refresh Data</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically update stats when viewing profiles
                    </div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-primary/20 border border-primary/50 cursor-pointer" />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20">
                  <div>
                    <div className="font-medium">AI Recommendations</div>
                    <div className="text-sm text-muted-foreground">
                      Show personalized problem suggestions
                    </div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-primary border border-primary cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <CyberButton variant="cyber" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </CyberButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
