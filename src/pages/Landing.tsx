import { useNavigate } from "react-router-dom";
import { CyberButton } from "@/components/ui/cyber-button";
import { Search, TrendingUp, Brain, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-gradient-dark z-0" />
        <div className="cyber-grid absolute inset-0 z-0" />
        
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 glow-text">
              LEET INSIGHTS
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track, Visualize, and Dominate Your LeetCode Performance with AI-Powered Analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CyberButton 
                variant="gradient" 
                size="xl"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Tracking
              </CyberButton>
              <CyberButton 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto"
              >
                View Demo
              </CyberButton>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-16 gradient-text">
            Supercharge Your Coding Journey
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="data-card group">
              <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <TrendingUp className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Deep dive into your problem-solving patterns with detailed breakdowns by difficulty, topic, and performance trends.
              </p>
            </div>

            <div className="data-card group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <Brain className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3">AI Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized problem suggestions based on your strengths, weaknesses, and learning patterns.
              </p>
            </div>

            <div className="data-card group">
              <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3">Real-Time Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your progress in real-time with live data updates and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card p-12 max-w-3xl mx-auto neon-border">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 glow-text">
              Ready to Level Up?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers tracking their LeetCode journey with Leet Insights
            </p>
            <CyberButton 
              variant="cyber" 
              size="xl"
              onClick={() => navigate('/dashboard')}
            >
              Get Started Now
            </CyberButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
