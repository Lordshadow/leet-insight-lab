import { NavLink } from "@/components/NavLink";
import { Home, BarChart3, GitCompare, Settings } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center animate-glow-pulse">
              <span className="text-background font-orbitron font-bold">L</span>
            </div>
            <span className="font-orbitron font-bold text-xl gradient-text">
              Leet Insights
            </span>
          </NavLink>

          <div className="flex items-center space-x-1">
            <NavLink
              to="/"
              className="px-4 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 text-muted-foreground hover:text-primary"
              activeClassName="text-primary bg-primary/10"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>
            
            <NavLink
              to="/dashboard"
              className="px-4 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 text-muted-foreground hover:text-primary"
              activeClassName="text-primary bg-primary/10"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>
            
            <NavLink
              to="/compare"
              className="px-4 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 text-muted-foreground hover:text-primary"
              activeClassName="text-primary bg-primary/10"
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </NavLink>
            
            <NavLink
              to="/settings"
              className="px-4 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 text-muted-foreground hover:text-primary"
              activeClassName="text-primary bg-primary/10"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
