import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types/payment";

export const fetchMonthlyDues = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("monthly_dues")
    .select(`
      *,
      brother:brothers (*)
    `)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  return data;
};

export const registerPayment = async (paymentId: string, paidAt: string): Promise<void> => {
  const { error } = await supabase
    .from("monthly_dues")
    .update({
      status: "paid",
      paid_at: paidAt,
    })
    .eq("id", paymentId);

  if (error) throw error;
};
