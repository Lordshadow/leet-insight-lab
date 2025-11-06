import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeetCodeResponse {
  data?: {
    matchedUser?: {
      username: string;
      profile: {
        ranking: number;
        realName: string;
      };
      submitStats: {
        acSubmissionNum: Array<{
          difficulty: string;
          count: number;
        }>;
      };
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    
    if (!username) {
      throw new Error('Username is required');
    }

    console.log(`Fetching LeetCode data for user: ${username}`);

    // LeetCode GraphQL API query
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            realName
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    // Fetch data from LeetCode's public GraphQL API
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data: LeetCodeResponse = await response.json();
    
    if (!data.data?.matchedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userData = data.data.matchedUser;
    const stats = userData.submitStats.acSubmissionNum;

    // Parse the submission stats
    const easySolved = stats.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = stats.find(s => s.difficulty === 'Hard')?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    const result = {
      username: userData.username,
      realName: userData.profile.realName,
      ranking: userData.profile.ranking,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
    };

    console.log(`Successfully fetched data for ${username}:`, result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-leetcode-data:', error);
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
