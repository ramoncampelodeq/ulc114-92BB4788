
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, X } from "lucide-react";
import { fetchPersonalPayments } from "@/lib/supabase";

export function PersonalPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["personal-payments"],
    queryFn: fetchPersonalPayments
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getPaymentStatus = (month: number) => {
    const payment = payments?.find(
      (p) => p.month === month && p.year === currentYear
    );
    return payment?.status || "pending";
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Minhas Mensalidades</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data do Pagamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {months.map((month) => {
              const payment = payments?.find(
                (p) => p.month === month && p.year === currentYear
              );
              const status = getPaymentStatus(month);

              return (
                <TableRow key={month}>
                  <TableCell>
                    {format(new Date(2024, month - 1), "MMMM", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {status === "paid" ? (
                        <>
                          <Check className="text-green-500" />
                          <span className="text-green-500">Pago</span>
                        </>
                      ) : (
                        <>
                          <X className="text-red-500" />
                          <span className="text-red-500">
                            {status === "overdue" ? "Atrasado" : "Pendente"}
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment?.paidAt
                      ? format(new Date(payment.paidAt), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
