
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchPersonalPayments } from "@/lib/supabase";
import { Check, X } from "lucide-react";

export function PersonalPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["personal-payments"],
    queryFn: fetchPersonalPayments,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Mensalidades</CardTitle>
          <CardDescription>
            Histórico de pagamentos das suas mensalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payments?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Mensalidades</CardTitle>
          <CardDescription>
            Histórico de pagamentos das suas mensalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma mensalidade encontrada.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Mensalidades</CardTitle>
        <CardDescription>
          Histórico de pagamentos das suas mensalidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês/Ano</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Pagamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(0, payment.month - 1), "MMMM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(payment.dueDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {payment.status === "paid" ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Pago</span>
                      </>
                    ) : payment.status === "overdue" ? (
                      <>
                        <X className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">Atrasado</span>
                      </>
                    ) : (
                      <span className="text-yellow-600">Pendente</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {payment.paidAt
                    ? format(new Date(payment.paidAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
