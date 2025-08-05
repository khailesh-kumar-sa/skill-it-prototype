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
    const { audio, question, role, idealAnswer } = await req.json();

    if (!audio || !question || !role || !idealAnswer) {
      throw new Error('Missing required fields');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // First, transcribe the audio
    console.log('Transcribing audio...');
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/wav' });
    formData.append('file', blob, 'audio.wav');
    formData.append('model', 'whisper-1');

    const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcribeResponse.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const transcription = await transcribeResponse.json();
    const userAnswer = transcription.text;

    console.log('Audio transcribed:', userAnswer);

    // Now analyze the response
    const analysisPrompt = `You are an expert interview coach and HR professional. Analyze this interview response comprehensively.

Interview Question: ${question}
Role Being Interviewed For: ${role}
Candidate's Answer: ${userAnswer}
Ideal Answer: ${idealAnswer}

Provide a detailed analysis comparing the candidate's answer to the ideal answer. Focus on:

1. Content accuracy and relevance
2. Communication clarity and structure
3. Professional presentation
4. Role-specific knowledge demonstration
5. Areas for improvement

Rate the following aspects on a scale where appropriate:
- Overall Score (0-100)
- Tone (Professional/Conversational/Needs Work)
- Clarity (Excellent/Good/Needs Work)
- Pronunciation (Clear/Mostly Clear/Unclear)

Provide specific feedback on:
- What they did well
- What could be improved
- Specific corrections and better phrasing suggestions

Return your response in this exact JSON format:
{
  "overallScore": 85,
  "tone": "Professional",
  "clarity": "Good",
  "pronunciation": "Clear",
  "userAnswer": "The candidate's transcribed answer",
  "feedback": "Detailed feedback paragraph about their performance",
  "corrections": "Specific suggestions for improvement and better phrasing"
}`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach and HR professional specializing in providing detailed, constructive feedback.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!analysisResponse.ok) {
      const error = await analysisResponse.json();
      throw new Error(error.error?.message || 'Failed to analyze response');
    }

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices[0].message.content;
    
    // Parse the JSON response
    const result = JSON.parse(analysisContent);
    
    // Ensure userAnswer is included
    result.userAnswer = userAnswer;

    console.log('Analysis complete for role:', role);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in interview-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});