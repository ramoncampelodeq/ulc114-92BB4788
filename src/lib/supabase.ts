
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { Payment, PaymentStatus } from "@/types/payment";
import { CriticalOverdueBrother } from "@/types/brother";

const supabaseUrl = "https://nxoixikuzrofjmvacsfz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54b2l4aWt1enJvZmptdmFjc2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ1NzEsImV4cCI6MjA1NTAzMDU3MX0.0CLAC8PzYyhPW1gkO9lIDFAgkjmV3vQDVhZq8qmZfDY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signUp = async (email: string, password: string, username: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  if (error) throw error;
};

export const fetchMonthlyDues = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("monthly_dues")
    .select(`
      id,
      brother_id,
      month,
      year,
      amount,
      status,
      paid_at,
      due_date,
      created_at,
      brother:brothers (
        id,
        name,
        email,
        degree,
        profession,
        birth_date,
        phone
      )
    `)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    brotherId: item.brother_id,
    brother: item.brother,
    month: item.month,
    year: item.year,
    amount: item.amount,
    status: item.status as PaymentStatus,
    paidAt: item.paid_at,
    dueDate: item.due_date,
    createdAt: item.created_at,
    updatedAt: item.created_at
  }));
};

export const fetchPersonalPayments = async (): Promise<Payment[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("monthly_dues")
    .select(`
      id,
      brother_id,
      month,
      year,
      amount,
      status,
      paid_at,
      due_date,
      created_at,
      brother:brothers (
        id,
        name,
        email,
        degree,
        profession,
        birth_date,
        phone
      )
    `)
    .eq("brother:brothers.user_id", user.id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    brotherId: item.brother_id,
    brother: item.brother,
    month: item.month,
    year: item.year,
    amount: item.amount,
    status: item.status as PaymentStatus,
    paidAt: item.paid_at,
    dueDate: item.due_date,
    createdAt: item.created_at,
    updatedAt: item.created_at
  }));
};

export const fetchCriticalOverdueBrothers = async (): Promise<CriticalOverdueBrother[]> => {
  // Using a direct select from the view instead of rpc
  const { data, error } = await supabase
    .from('critical_overdue_brothers')
    .select('*');

  if (error) throw error;
  if (!data) return [];

  return data.map(item => ({
    id: item.id || '',
    name: item.name || '',
    overdueCount: item.overdue_count || 0,
    latestDueDate: item.latest_due_date || ''
  }));
};

export const registerPayment = async (paymentId: string, paidAt: string): Promise<void> => {
  const { error } = await supabase
    .from("monthly_dues")
    .update({
      paid_at: paidAt,
      status: 'paid'
    })
    .eq("id", paymentId);

  if (error) throw error;
};
