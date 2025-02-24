
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Payment } from "@/types/payment";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface PaymentDialogProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentId: string, paidAt: string) => Promise<void>;
}

export function PaymentDialog({
  payment,
  isOpen,
  onClose,
  onSubmit,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const [paidAt, setPaidAt] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(payment.id, paidAt);
      toast({
        title: "Pagamento registrado com sucesso",
        description: `Mensalidade de ${format(new Date(0, payment.month - 1), "MMMM/yyyy", { locale: ptBR })} registrada.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao registrar pagamento",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div>
              <Label>Irmão</Label>
              <div className="mt-1.5 text-base">{payment.brother.name}</div>
            </div>
            
            <div>
              <Label>Mês/Ano</Label>
              <div className="mt-1.5 text-base">
                {format(new Date(0, payment.month - 1), "MMMM/yyyy", { locale: ptBR })}
              </div>
            </div>
            
            <div>
              <Label>Valor</Label>
              <div className="mt-1.5 text-base">R$ {payment.amount}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paidAt">Data do Pagamento</Label>
              <Input
                type="date"
                id="paidAt"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                max={format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Pagamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
