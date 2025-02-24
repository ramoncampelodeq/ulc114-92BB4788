
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { CashBalance, CashMovement } from "@/types/cash";
import { CashBalanceCard } from "./CashBalanceCard";
import { CashMovementDialog } from "./CashMovementDialog";
import { CashMovementList } from "./CashMovementList";

export function CashControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { data: balance } = useQuery({
    queryKey: ["cash-balance", currentMonth, currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_balance")
        .select("*")
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .single();

      if (error) throw error;

      return {
        month: data.month,
        year: data.year,
        monthlyFeesTotal: data.monthly_fees_total || 0,
        solidarityTrunkTotal: data.solidarity_trunk_total || 0,
        otherIncomeTotal: data.other_income_total || 0,
        expensesTotal: data.expenses_total || 0,
        totalBalance: data.total_balance || 0,
      } as CashBalance;
    },
  });

  const { data: movements } = useQuery({
    queryKey: ["cash-movements", currentMonth, currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_movements")
        .select("*")
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((movement) => ({
        id: movement.id,
        createdAt: movement.created_at,
        userId: movement.user_id,
        type: movement.type,
        category: movement.category,
        amount: movement.amount,
        description: movement.description,
        month: movement.month,
        year: movement.year,
      })) as CashMovement[];
    },
  });

  const createMovement = useMutation({
    mutationFn: async (data: {
      type: CashMovementType;
      category: CashMovementCategory;
      amount: number;
      description?: string;
    }) => {
      const { error } = await supabase
        .from("cash_movements")
        .insert([{
          ...data,
          month: currentMonth,
          year: currentYear,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-balance"] });
      queryClient.invalidateQueries({ queryKey: ["cash-movements"] });
      toast({
        title: "Movimentação registrada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao registrar movimentação",
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(new Date(currentYear, currentMonth - 1), "MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      {balance && <CashBalanceCard balance={balance} />}

      {movements && movements.length > 0 ? (
        <CashMovementList movements={movements} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma movimentação encontrada
        </div>
      )}

      <CashMovementDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (data) => {
          await createMovement.mutateAsync(data);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
