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
        userAvatar?: string;
        reputation?: number;
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

    // Fetch basic profile and stats
    const profileQuery = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            realName
            userAvatar
            reputation
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const profileResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: profileQuery,
        variables: { username },
        operationName: 'userPublicProfile'
      }),
    });

    if (!profileResponse.ok) {
      throw new Error(`LeetCode API error: ${profileResponse.status}`);
    }

    const profileData: LeetCodeResponse = await profileResponse.json();
    
    if (!profileData.data?.matchedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch calendar data separately
    const calendarQuery = `
      query userProfileCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;

    const calendarResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: calendarQuery,
        variables: { username },
        operationName: 'userProfileCalendar'
      }),
    });

    let calendarData = null;
    if (calendarResponse.ok) {
      const calRes = await calendarResponse.json();
      calendarData = calRes.data?.matchedUser?.userCalendar;
    }

    // Fetch contest ranking separately
    const contestQuery = `
      query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          rating
          globalRanking
          topPercentage
          attendedContestsCount
        }
      }
    `;

    const contestResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: contestQuery,
        variables: { username },
        operationName: 'userContestRankingInfo'
      }),
    });

    let contestData = null;
    if (contestResponse.ok) {
      const contRes = await contestResponse.json();
      contestData = contRes.data?.userContestRanking;
    }

    // Fetch skills separately
    const skillsQuery = `
      query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced {
              tagName
              problemsSolved
            }
            intermediate {
              tagName
              problemsSolved
            }
            fundamental {
              tagName
              problemsSolved
            }
          }
        }
      }
    `;

    const skillsResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: skillsQuery,
        variables: { username },
        operationName: 'skillStats'
      }),
    });

    let skillsData = null;
    if (skillsResponse.ok) {
      const skillRes = await skillsResponse.json();
      skillsData = skillRes.data?.matchedUser?.tagProblemCounts;
    }

    // Fetch recent submissions separately
    const submissionsQuery = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `;

    const submissionsResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: submissionsQuery,
        variables: { username, limit: 10 },
        operationName: 'recentAcSubmissions'
      }),
    });

    let recentSubmissions = [];
    if (submissionsResponse.ok) {
      const subRes = await submissionsResponse.json();
      recentSubmissions = subRes.data?.recentAcSubmissionList || [];
    }

    const userData = profileData.data.matchedUser;
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
      avatar: userData.profile.userAvatar,
      reputation: userData.profile.reputation,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      calendar: calendarData,
      contestRanking: contestData,
      skills: skillsData,
      recentSubmissions: recentSubmissions.map((sub: any) => ({
        title: sub.title,
        timestamp: sub.timestamp,
        statusDisplay: 'Accepted',
        lang: 'N/A'
      })),
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
