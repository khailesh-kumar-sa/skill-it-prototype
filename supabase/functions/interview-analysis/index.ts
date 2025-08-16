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
    console.log('Audio data length:', audio.length);
    
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    console.log('Binary audio length:', binaryAudio.length);
    
    const formData = new FormData();
    // Use webm format as that's what the browser actually records
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
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

    // Now analyze the response by comparing with the predefined ideal answer
    const analysisPrompt = `You are an expert interview coach and HR professional. Analyze this interview response by comparing it directly with the provided ideal answer.

Interview Question: ${question}
Role Being Interviewed For: ${role}
Candidate's Answer: ${userAnswer}
Predefined Ideal Answer: ${idealAnswer}

IMPORTANT: Compare the candidate's answer specifically against the predefined ideal answer provided above. This ideal answer contains the key points and approaches expected for this specific question and role.

Analyze the following:
1. Content Accuracy: How well does the candidate's answer align with the key points in the ideal answer?
2. Completeness: Did they cover the main topics mentioned in the ideal answer?
3. Communication Quality: Clarity, structure, and professionalism
4. Role-Specific Knowledge: Technical competence and industry understanding
5. Areas for Improvement: What key points from the ideal answer were missed?

Scoring criteria:
- 90-100: Covers all key points from ideal answer with excellent presentation
- 80-89: Covers most key points with good presentation
- 70-79: Covers some key points but missing important elements
- 60-69: Basic understanding but significant gaps compared to ideal answer
- Below 60: Major deficiencies in content and presentation

Provide specific feedback comparing their answer to the ideal answer and suggest improvements.

Return your response in this exact JSON format:
{
  "overallScore": 85,
  "tone": "Professional",
  "clarity": "Good",
  "pronunciation": "Clear",
  "userAnswer": "The candidate's transcribed answer",
  "feedback": "Detailed feedback comparing their answer to the ideal answer provided",
  "corrections": "Specific suggestions based on what was missing from the ideal answer"
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