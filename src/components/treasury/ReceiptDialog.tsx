
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payment } from "@/types/payment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download } from "lucide-react";

interface ReceiptDialogProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptDialog({
  payment,
  isOpen,
  onClose,
}: ReceiptDialogProps) {
  if (!payment.paidAt) return null;

  const handleDownload = () => {
    // TODO: Implementar download do recibo
    console.log("Download receipt for payment:", payment.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recibo de Pagamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">Detalhes do Pagamento</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Irmão:</span>
                <span>{payment.brother.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Competência:</span>
                <span>
                  {format(new Date(0, payment.month - 1), "MMMM/yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Valor:</span>
                <span>R$ {payment.amount}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Data do Pagamento:</span>
                <span>
                  {format(new Date(payment.paidAt), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
