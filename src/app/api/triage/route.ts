import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Service Role for backend inserts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { messages, patientId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Call Vercel AI SDK with structured output
    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      system: `You are an expert physiotherapist assistant. Your goal is to triage the patient based on their conversation and generate a clinical summary. 
      You must extract the injury type, onset of the injury, current pain scale (1-10), a brief clinical summary, and a recommended slot duration for their appointment (either 30, 45, or 60 minutes based on severity).`,
      messages,
      schema: z.object({
        injury_type: z.string().describe('The type of injury or condition, e.g., "Lower Back Pain", "Rotator Cuff Tear"'),
        onset: z.string().describe('When and how the injury started, e.g., "2 weeks ago while lifting"'),
        pain_scale: z.number().min(1).max(10).describe('Current pain level from 1 to 10'),
        clinical_summary: z.string().describe('A brief summary of the patient symptoms and potential issues'),
        recommended_slot_duration: z.union([z.literal(30), z.literal(45), z.literal(60)]).describe('Recommended duration for the appointment in minutes'),
      }),
    });

    // Save the structured output to Supabase
    if (supabaseUrl && supabaseServiceKey) {
      const { error } = await supabase
        .from('patient_intake')
        .insert([
          {
            patient_id: patientId || null, // Null if not logged in
            injury_type: object.injury_type,
            onset: object.onset,
            pain_scale: object.pain_scale,
            clinical_summary: object.clinical_summary,
            recommended_slot_duration: object.recommended_slot_duration,
          }
        ]);

      if (error) {
        console.error('Error saving to Supabase:', error);
        // We still return the object even if saving fails, so the UI can proceed
      }
    } else {
      console.warn('Supabase credentials not found. Skipping database insertion.');
    }

    return NextResponse.json(object);

  } catch (error) {
    console.error('AI Triage Error:', error);
    return NextResponse.json({ error: 'Failed to process triage' }, { status: 500 });
  }
}
