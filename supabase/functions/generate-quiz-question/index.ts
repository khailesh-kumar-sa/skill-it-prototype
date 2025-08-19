import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skillCategory, skillLevel, targetRole, questionNumber } = await req.json();

    if (!skillCategory || !skillLevel || !targetRole) {
      throw new Error('skillCategory, skillLevel, and targetRole are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert in ${skillCategory} skills and knowledge assessment. Generate a multiple-choice quiz question for someone who wants to teach ${skillCategory} at ${skillLevel} level for the role of ${targetRole}.

The question should:
- Test practical knowledge relevant to ${skillCategory} and ${targetRole}
- Be appropriate for ${skillLevel} level understanding
- Have one clearly correct answer and three plausible distractors
- Be answerable by someone who would confidently teach this skill

Return your response in this exact JSON format:
{
  "question": "Your quiz question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0
}

Where "correct" is the 0-based index of the correct answer in the options array.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate quiz question #${questionNumber} for ${skillCategory} at ${skillLevel} level for ${targetRole} role.`
          }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate quiz question');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from AI');
    }

    // Validate the response format
    if (!result.question || !Array.isArray(result.options) || result.options.length !== 4 || typeof result.correct !== 'number') {
      console.error('Invalid question format:', result);
      throw new Error('Invalid question format received');
    }

    console.log(`Generated quiz question for ${skillCategory} (${skillLevel}) - ${targetRole}`);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-quiz-question function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});