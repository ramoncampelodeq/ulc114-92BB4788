
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Session } from "@/types/session";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface TrunkAmountCellProps {
  session: Session;
  editingId: string | null;
  onEdit: (id: string) => void;
  onUpdate: (id: string, amount: string) => void;
  onCancel: () => void;
}

export function TrunkAmountCell({
  session,
  editingId,
  onEdit,
  onUpdate,
  onCancel,
}: TrunkAmountCellProps) {
  const queryClient = useQueryClient();

  const handleUpdate = async (id: string, amount: string) => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Valor inválido");
      }

      const date = new Date(session.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      console.log('Atualizando valor do tronco:', {
        id,
        amount: numericAmount,
        month,
        year,
        date: date.toISOString()
      });

      // Registra o valor do tronco na sessão
      const { error: sessionError } = await supabase
        .from("sessions")
        .update({ daily_trunk_amount: numericAmount })
        .eq("id", id);

      if (sessionError) {
        console.error('Erro ao atualizar sessão:', sessionError);
        throw sessionError;
      }

      console.log('Sessão atualizada com sucesso');

      // Cria a movimentação no caixa
      const { data: cashData, error: cashError } = await supabase
        .from("cash_movements")
        .insert({
          type: "income",
          category: "solidarity_trunk",
          amount: numericAmount,
          month: month,
          year: year,
          description: `Tronco de Solidariedade - Sessão ${date.toLocaleDateString('pt-BR')}`
        })
        .select();

      if (cashError) {
        console.error('Erro ao criar movimentação:', cashError);
        throw cashError;
      }

      console.log('Movimentação criada com sucesso:', cashData);

      // Invalida os caches para forçar recarregamento
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["cash-balance"] });
      queryClient.invalidateQueries({ queryKey: ["cash-movements"] });

      toast({
        title: "Valor atualizado com sucesso!",
      });

      onUpdate(id, amount);
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar valor",
        description: error.message,
      });
    }
  };

  if (editingId === session.id) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          defaultValue={session.daily_trunk_amount}
          className="w-24"
          onBlur={(e) => handleUpdate(session.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate(session.id, e.currentTarget.value);
            }
            if (e.key === "Escape") {
              onCancel();
            }
          }}
          autoFocus
        />
      </div>
    );
  }

  return (
    <button onClick={() => onEdit(session.id)} className="hover:underline">
      {session.daily_trunk_amount
        ? `R$ ${session.daily_trunk_amount.toFixed(2)}`
        : "Adicionar valor"}
    </button>
  );
}
