import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userStats: UserStats = await req.json();
    
    if (!userStats.username) {
      throw new Error('User stats are required');
    }

    console.log(`Generating AI recommendations for: ${userStats.username}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Calculate user's skill distribution
    const total = userStats.totalSolved;
    const easyPercent = ((userStats.easySolved / total) * 100).toFixed(1);
    const mediumPercent = ((userStats.mediumSolved / total) * 100).toFixed(1);
    const hardPercent = ((userStats.hardSolved / total) * 100).toFixed(1);

    // Create a detailed prompt for AI recommendations
    const systemPrompt = `You are an expert LeetCode coach analyzing a user's coding performance. 
Based on their stats, recommend 5 specific LeetCode problems that will help them improve.
Consider their current skill distribution and suggest problems that will strengthen weak areas or advance their skills.
Return ONLY a valid JSON array without any markdown formatting or code blocks.`;

    const userPrompt = `User: ${userStats.username}
Total Problems Solved: ${total}
- Easy: ${userStats.easySolved} (${easyPercent}%)
- Medium: ${userStats.mediumSolved} (${mediumPercent}%)
- Hard: ${userStats.hardSolved} (${hardPercent}%)

Based on this distribution, recommend 5 LeetCode problems. Format as JSON array:
[
  {
    "title": "Problem Title",
    "difficulty": "Easy/Medium/Hard",
    "tags": ["Array", "Two Pointers"],
    "reason": "Why this problem helps the user",
    "url": "https://leetcode.com/problems/problem-slug"
  }
]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the AI response - it should be a JSON array
    let recommendations;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      recommendations = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI');
    }

    console.log(`Successfully generated ${recommendations.length} recommendations for ${userStats.username}`);

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-ai-recommendations:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
