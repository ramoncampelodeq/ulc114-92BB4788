
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { PaymentFormData } from "../types";
import type { Database } from "@/integrations/supabase/types";

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
      console.log('Iniciando criação de pagamento:', { data });

      // Validação inicial dos dados
      if (!data.brotherId || data.months.length === 0 || !data.amount) {
        console.error('Dados inválidos:', { data });
        throw new Error("Dados inválidos para o pagamento");
      }

      // Verificar pagamentos existentes
      const { data: existingPayments, error: checkError } = await supabase
        .from("monthly_dues")
        .select("month, year")
        .eq("brother_id", data.brotherId)
        .eq("year", data.year)
        .in("month", data.months);

      if (checkError) {
        console.error('Erro ao verificar pagamentos existentes:', checkError);
        throw checkError;
      }

      if (existingPayments && existingPayments.length > 0) {
        const existingMonths = existingPayments.map(p => p.month);
        console.warn('Pagamentos já existentes:', { existingMonths });
        throw new Error(`Já existem pagamentos registrados para os meses: ${existingMonths.join(", ")}`);
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      // Criar pagamentos
      const payments = data.months.map(month => ({
        brother_id: data.brotherId,
        month,
        year: data.year,
        amount: data.amount,
        status: data.status,
        paid_at: data.paidAt,
        due_date: format(new Date(data.year, month - 1, 10), "yyyy-MM-dd"),
        user_id: userId
      }));

      console.log('Tentando inserir pagamentos:', { payments });

      const { error: paymentsError } = await supabase
        .from("monthly_dues")
        .insert(payments);
    
      if (paymentsError) {
        console.error('Erro ao inserir pagamentos:', paymentsError);
        throw new Error(`Erro ao registrar pagamentos: ${paymentsError.message}`);
      }

      // Criar movimentações de caixa se o pagamento foi registrado como pago
      if (data.status === 'paid') {
        const cashMovements: CashMovementInsert[] = data.months.map(month => ({
          type: 'income',
          category: 'monthly_fee',
          amount: Number(data.amount),
          month,
          year: Number(data.year),
          description: `Mensalidade - Mês ${month}/${data.year}`,
          created_at: new Date().toISOString(),
          user_id: userId
        }));

        console.log('Tentando inserir movimentações:', cashMovements);

        const { error: cashError } = await supabase
          .from("cash_movements")
          .insert(cashMovements);

        if (cashError) {
          console.error('Erro ao inserir movimentações:', cashError);
          throw new Error(`Erro ao registrar movimentações: ${cashError.message}`);
        }
      }

      console.log('Operação concluída com sucesso');
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
      console.error('Erro na mutation:', error);
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
