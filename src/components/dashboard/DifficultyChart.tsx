import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DifficultyChartProps {
  easy: number;
  medium: number;
  hard: number;
}

const DifficultyChart = ({ easy, medium, hard }: DifficultyChartProps) => {
  const data = [
    { name: "Easy", value: easy, color: "hsl(150 80% 50%)" },
    { name: "Medium", value: medium, color: "hsl(40 95% 55%)" },
    { name: "Hard", value: hard, color: "hsl(0 85% 60%)" },
  ];

  return (
    <div className="data-card">
      <h3 className="text-xl font-orbitron font-bold mb-6">Problem Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="hsl(220 40% 6%)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(220 40% 20%)",
              border: "2px solid hsl(190 60% 50%)",
              borderRadius: "8px",
              color: "hsl(0 0% 98%)",
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            }}
            itemStyle={{
              color: "hsl(0 0% 98%)",
            }}
            labelStyle={{
              color: "hsl(0 0% 98%)",
              fontWeight: "bold",
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-orbitron font-bold text-chart-easy">{easy}</div>
          <div className="text-xs text-muted-foreground">Easy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-orbitron font-bold text-chart-medium">{medium}</div>
          <div className="text-xs text-muted-foreground">Medium</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-orbitron font-bold text-chart-hard">{hard}</div>
          <div className="text-xs text-muted-foreground">Hard</div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyChart;
