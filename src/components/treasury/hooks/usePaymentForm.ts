import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PaymentFormData } from "../types";
import type { Database } from "@/integrations/supabase/types";
import { ptBR } from "date-fns/locale";

type CashMovementInsert = Database['public']['Tables']['cash_movements']['Insert'];

export function usePaymentForm() {
  const queryClient = useQueryClient();
  const [selectedBrotherId, setSelectedBrotherId] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [paidMonths, setPaidMonths] = useState<number[]>([]);

  // Fetch the calculated monthly fee when component mounts
  useEffect(() => {
    const fetchMonthlyFee = async () => {
      const { data, error } = await supabase.rpc('calculate_monthly_fee');
      
      if (error) {
        console.error('Erro ao buscar valor da mensalidade:', error);
        return;
      }

      setAmount(data.toString());
    };

    fetchMonthlyFee();
  }, []);

  // Buscar pagamentos existentes quando o irmão ou ano for alterado
  useEffect(() => {
    const fetchExistingPayments = async () => {
      if (!selectedBrotherId || !selectedYear) return;

      try {
        const { data: payments, error } = await supabase
          .from("monthly_dues")
          .select("month")
          .eq("brother_id", selectedBrotherId)
          .eq("year", parseInt(selectedYear))
          .not("status", "eq", "overdue");

        if (error) throw error;

        // Atualizar os meses já pagos
        setPaidMonths(payments?.map(p => p.month) || []);
      } catch (error) {
        console.error("Erro ao buscar pagamentos existentes:", error);
        toast.error("Erro ao verificar pagamentos existentes");
      }
    };

    fetchExistingPayments();
  }, [selectedBrotherId, selectedYear]);

  const resetForm = () => {
    setSelectedBrotherId("");
    setSelectedMonths([]);
    setPaidMonths([]);
    setSelectedYear(new Date().getFullYear().toString());
    setIsPaid(false);
    setPaidAt(format(new Date(), "yyyy-MM-dd"));
  };

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      console.log('Iniciando criação de pagamento:', { data });

      if (!data.brotherId || data.months.length === 0 || !data.amount) {
        console.error('Dados inválidos:', { data });
        throw new Error("Dados inválidos para o pagamento");
      }

      // Buscar informações do irmão
      const { data: brotherData, error: brotherError } = await supabase
        .from("brothers")
        .select('name')
        .eq('id', data.brotherId)
        .single();

      if (brotherError) {
        console.error('Erro ao buscar informações do irmão:', brotherError);
        throw brotherError;
      }

      // Verificar pagamentos existentes
      const { data: existingPayments, error: checkError } = await supabase
        .from("monthly_dues")
        .select('id, month')
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

      // Buscar o valor calculado da mensalidade
      const { data: calculatedFee, error: feeError } = await supabase.rpc('calculate_monthly_fee');
      
      if (feeError) {
        console.error('Erro ao calcular valor da mensalidade:', feeError);
        throw feeError;
      }

      // Preparar os dados para inserção usando o valor calculado
      const payments = data.months.map(month => ({
        brother_id: data.brotherId,
        month,
        year: data.year,
        amount: calculatedFee,
        status: data.status,
        paid_at: data.paidAt,
        due_date: format(new Date(data.year, month - 1, 10), "yyyy-MM-dd")
      }));

      console.log('Tentando inserir pagamentos:', { payments });

      // Inserir pagamentos
      const { error: paymentsError } = await supabase
        .from("monthly_dues")
        .insert(payments);
    
      if (paymentsError) {
        console.error('Erro ao inserir pagamentos:', paymentsError);
        throw new Error(`Erro ao registrar pagamentos: ${paymentsError.message}`);
      }

      // Se o pagamento foi marcado como pago, registrar as movimentações de caixa
      if (data.status === 'paid') {
        const cashMovements: CashMovementInsert[] = data.months.map(month => ({
          type: 'income',
          category: 'monthly_fee',
          amount: Number(calculatedFee),
          month,
          year: Number(data.year),
          description: `Mensalidade - ${brotherData.name} - ${format(new Date(data.year, month - 1), "MMMM 'de' yyyy", { locale: ptBR })}`,
          is_recurring: false
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
      
      toast.success("Pagamentos registrados com sucesso");
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Erro na mutation:', error);
      toast.error(error.message || "Ocorreu um erro ao tentar registrar os pagamentos.");
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
    paidMonths,
    createPaymentMutation,
  };
}
