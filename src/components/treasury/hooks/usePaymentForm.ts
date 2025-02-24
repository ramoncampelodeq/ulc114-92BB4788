
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { PaymentFormData } from "../types";
import type { Database } from "@/integrations/supabase/types";

// Tipos inferidos diretamente do schema do Supabase
type CashMovementInsert = Database['public']['Tables']['cash_movements']['Insert'];

export function usePaymentForm() {
  const queryClient = useQueryClient();
  const [selectedBrotherId, setSelectedBrotherId] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [amount, setAmount] = useState("100");
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  const resetForm = () => {
    setSelectedBrotherId("");
    setSelectedMonths([]);
    setSelectedYear(new Date().getFullYear().toString());
    setAmount("100");
    setIsPaid(false);
    setPaidAt(format(new Date(), "yyyy-MM-dd"));
  };

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const payments = data.months.map(month => ({
        brother_id: data.brotherId,
        month: month,
        year: data.year,
        amount: data.amount,
        status: data.status,
        paid_at: data.paidAt,
        due_date: format(new Date(data.year, month - 1, 10), "yyyy-MM-dd")
      }));

      const { data: existingPayments, error: checkError } = await supabase
        .from("monthly_dues")
        .select("month, year")
        .eq("brother_id", data.brotherId)
        .eq("year", data.year)
        .in("month", data.months);

      if (checkError) throw checkError;

      if (existingPayments && existingPayments.length > 0) {
        const existingMonths = existingPayments.map(p => p.month);
        throw new Error(`Já existem pagamentos registrados para os meses: ${existingMonths.join(", ")}`);
      }

      // Primeiro, vamos registrar os pagamentos
      const { error } = await supabase
        .from("monthly_dues")
        .insert(payments);
      
      if (error) throw error;

      // Se o pagamento foi registrado como pago, criar movimentações no caixa
      if (data.status === 'paid') {
        const cashMovements: CashMovementInsert[] = data.months.map(month => ({
          type: 'income',
          category: 'monthly_fee',
          amount: data.amount,
          month,
          year: data.year,
          description: `Mensalidade - Mês ${month}/${data.year}`
        }));

        console.log('Cash movements to be inserted:', cashMovements);

        const { error: cashError } = await supabase
          .from("cash_movements")
          .insert(cashMovements);

        if (cashError) {
          console.error('Error inserting cash movements:', cashError);
          throw cashError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-dues"] });
      queryClient.invalidateQueries({ queryKey: ["personal-payments"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-payments"] });
      queryClient.invalidateQueries({ queryKey: ["critical-overdue-brothers"] });
      queryClient.invalidateQueries({ queryKey: ["cash-balance"] });
      queryClient.invalidateQueries({ queryKey: ["cash-movements"] });
      
      toast({
        title: "Pagamentos registrados",
        description: "Os pagamentos foram registrados com sucesso."
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar pagamentos",
        description: error.message || "Ocorreu um erro ao tentar registrar os pagamentos.",
        variant: "destructive"
      });
    }
  });

  return {
    selectedBrotherId,
    setSelectedBrotherId,
    selectedYear,
    setSelectedYear,
    amount,
    setAmount,
    isPaid,
    setIsPaid,
    paidAt,
    setPaidAt,
    selectedMonths,
    setSelectedMonths,
    createPaymentMutation,
  };
}
