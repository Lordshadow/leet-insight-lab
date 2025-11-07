import { Card } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Code2 } from "lucide-react";

interface SkillCategory {
  tagName: string;
  problemsSolved: number;
}

interface SkillsData {
  advanced: SkillCategory[];
  intermediate: SkillCategory[];
  fundamental: SkillCategory[];
}

interface SkillsRadarProps {
  skills: SkillsData;
}

const SkillsRadar = ({ skills }: SkillsRadarProps) => {
  const allSkills = [
    ...(skills.advanced || []),
    ...(skills.intermediate || []),
    ...(skills.fundamental || []),
  ];

  const skillMap = allSkills.reduce((acc, skill) => {
    if (!acc[skill.tagName]) {
      acc[skill.tagName] = 0;
    }
    acc[skill.tagName] += skill.problemsSolved;
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({
      skill: name,
      solved: value,
    }));

  return (
    <Card className="glass-card p-6 neon-border animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-orbitron font-bold gradient-text">
          Skills Breakdown
        </h3>
      </div>

      {topSkills.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={topSkills}>
              <PolarGrid stroke="hsl(var(--primary) / 0.3)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, "auto"]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Radar
                name="Problems Solved"
                dataKey="solved"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {topSkills.map((skill) => (
              <div
                key={skill.skill}
                className="p-3 rounded-lg bg-background/30 border border-primary/20"
              >
                <span className="text-sm font-medium">{skill.skill}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {skill.solved} problems
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No skill data available
        </p>
      )}
    </Card>
  );
};

export default SkillsRadar;
