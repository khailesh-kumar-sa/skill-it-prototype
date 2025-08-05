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
    const { role, difficulty } = await req.json();

    if (!role) {
      throw new Error('Role is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert HR professional specializing in ${role} interviews. Generate a relevant interview question and provide an ideal answer.

Role: ${role}
Difficulty: ${difficulty}

Generate a question that would be asked by an HR professional for this specific role. The question should test relevant skills, experience, and knowledge for ${role}.

Then provide an ideal answer that demonstrates:
- Technical knowledge appropriate for ${role}
- Professional experience
- Problem-solving abilities
- Communication skills

Return your response in this exact JSON format:
{
  "question": "Your interview question here",
  "idealAnswer": "Your ideal answer here"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate an interview question for a ${role} position at ${difficulty} level.`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate question');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const result = JSON.parse(content);

    console.log('Generated question and answer for role:', role);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});