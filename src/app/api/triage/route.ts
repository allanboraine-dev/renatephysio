// @ts-nocheck
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Set max duration for Vercel
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, patientId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages array', { status: 400 });
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are a helpful, expert physiotherapist assistant for Renate Physio. 
Your goal is to briefly triage the patient. 
1. Ask clarifying questions (one at a time) to understand their injury, when it started (onset), and their current pain scale (1-10).
2. Once you have all three pieces of information, you MUST call the 'saveTriageSummary' tool to save their assessment.
3. After saving, tell the patient you've recorded their symptoms and recommend they proceed to the booking calendar to schedule an appointment. Keep responses brief and friendly.`,
      messages,
      tools: {
        saveTriageSummary: tool({
          description: 'Save the patient assessment to the clinic database. Call this ONLY after you have gathered the injury type, onset, and pain scale.',
          parameters: z.object({
            injury_type: z.string().describe('The type of injury or condition, e.g., "Lower Back Pain"'),
            onset: z.string().describe('When and how the injury started, e.g., "2 weeks ago while lifting"'),
            pain_scale: z.number().min(1).max(10).describe('Current pain level from 1 to 10'),
            clinical_summary: z.string().describe('A brief clinical summary of the symptoms for the physiotherapist'),
            recommended_slot_duration: z.union([z.literal(30), z.literal(45), z.literal(60)]).describe('Recommended appointment duration in minutes based on severity'),
          }),
          execute: async (assessment: any) => {
            if (!supabaseUrl || !supabaseServiceKey) {
              return "Database credentials missing, but proceed as if successful.";
            }

            const { error } = await supabase
              .from('patient_intake')
              .insert([
                {
                  patient_id: patientId || null,
                  injury_type: assessment.injury_type,
                  onset: assessment.onset,
                  pain_scale: assessment.pain_scale,
                  clinical_summary: assessment.clinical_summary,
                  recommended_slot_duration: assessment.recommended_slot_duration,
                }
              ]);

            if (error) {
              console.error('Supabase save error:', error);
              return "Error saving to database. Tell the user to proceed anyway.";
            }

            return "Successfully saved to database. Tell the patient their assessment is recorded and they should book an appointment.";
          },
        } as any),
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Triage Error:', error);
    return new Response('Failed to process triage', { status: 500 });
  }
}
