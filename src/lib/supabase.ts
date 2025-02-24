
import { createClient } from '@supabase/supabase-js';
import { Brother, BrotherFormData } from '@/types/brother';
import { Session } from '@/types/session';
import { Payment } from '@/types/payment';
import { Attendance } from '@/types/attendance';

const supabaseUrl = 'https://nxoixikuzrofjmvacsfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54b2l4aWt1enJvZmptdmFjc2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ1NzEsImV4cCI6MjA1NTAzMDU3MX0.0CLAC8PzYyhPW1gkO9lIDFAgkjmV3vQDVhZq8qmZfDY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Brothers
export async function fetchBrothers() {
  const { data, error } = await supabase
    .from('brothers')
    .select(`
      *,
      relatives (*),
      attendance (*)
    `);

  if (error) throw error;
  return data as Brother[];
}

export async function createBrother(brother: BrotherFormData) {
  const { data, error } = await supabase
    .from('brothers')
    .insert([brother])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBrother(id: string, brother: Partial<BrotherFormData>) {
  const { data, error } = await supabase
    .from('brothers')
    .update(brother)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Sessions
export async function fetchSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*');

  if (error) throw error;
  return data as Session[];
}

// Attendance
export async function fetchAttendance() {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      brothers (*)
    `);

  if (error) throw error;
  return data as Attendance[];
}

// Monthly Dues
export async function fetchMonthlyDues() {
  const { data, error } = await supabase
    .from('monthly_dues')
    .select(`
      *,
      brothers (*)
    `);

  if (error) throw error;
  return data as Payment[];
}
