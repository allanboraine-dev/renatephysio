import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      appointmentType,
      date,
      time,
      medicalAidProvider,
      medicalAidNumber,
    } = data;

    if (!firstName || !lastName || !phone || !appointmentType || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let patientId: string = '';

    // 1. Try to find an existing patient by email (if provided)
    if (email && email.trim() !== '') {
      const { data: existingPatients, error: searchError } = await supabaseAdmin
        .from('patients')
        .select('id')
        .eq('email', email.trim())
        .limit(1);

      if (searchError) {
        console.error('Error searching for patient:', searchError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      if (existingPatients && existingPatients.length > 0) {
        patientId = existingPatients[0].id;
      }
    }

    // 2. If no patient was found (or no email provided), create a new patient
    if (!patientId) {
      const { data: newPatient, error: insertError } = await supabaseAdmin
        .from('patients')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone_number: phone,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating patient:', insertError);
        return NextResponse.json({ error: 'Failed to create patient profile' }, { status: 500 });
      }

      patientId = newPatient.id;

      // 3. Insert medical aid details if provided (only for new patients to avoid duplicates/overwrites, or you could update existing)
      if (medicalAidProvider && medicalAidNumber) {
        const { error: medicalAidError } = await supabaseAdmin
          .from('medical_aid_details')
          .insert({
            patient_id: patientId,
            provider_name: medicalAidProvider,
            medical_aid_number: medicalAidNumber,
          });
        
        if (medicalAidError) {
          console.error('Error adding medical aid:', medicalAidError);
          // We don't fail the whole booking if medical aid fails, but we log it.
        }
      }
    }

    // 4. Create the appointment
    // Note: The date received from the frontend is a UTC ISO string, we only need the YYYY-MM-DD part
    const appointmentDate = new Date(date).toISOString().split('T')[0];
    
    // Time is likely coming as "08:00 AM". Let's convert it to a format postgres TIME accepts (HH:MM:SS) if needed, 
    // or just pass it if Postgres can parse it. Postgres can usually parse "08:00 AM" into "08:00:00".
    const { error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .insert({
        patient_id: patientId,
        appointment_type: appointmentType,
        appointment_date: appointmentDate,
        appointment_time: time,
        status: 'Pending'
      });

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Appointment booked successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Server error processing booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
