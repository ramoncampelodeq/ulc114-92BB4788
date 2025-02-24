
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OverdueBrother } from "@/types/payment";

export function OverdueList() {
  const { data: overduePayments, isLoading } = useQuery<OverdueBrother[]>({
    queryKey: ["overdue-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_dues")
        .select(`
          id,
          brother_id,
          brother:brothers (
            id,
            name
          ),
          month,
          year,
          due_date,
          amount
        `)
        .eq("status", "overdue")
        .order("due_date");

      if (error) {
        console.error("Error fetching overdue payments:", error);
        throw error;
      }

      console.log("Overdue payments raw data:", data);

      // Agrupar por irmão
      const groupedByBrother = (data || []).reduce<Record<string, OverdueBrother>>((acc, payment) => {
        if (!payment.brother_id || !payment.brother) return acc;

        const key = payment.brother_id;
        if (!acc[key]) {
          acc[key] = {
            brotherId: payment.brother_id,
            brotherName: payment.brother.name,
            overdueMonths: [],
            totalOverdue: 0,
            totalAmount: 0
          };
        }

        acc[key].overdueMonths.push({
          month: payment.month,
          year: payment.year,
          dueDate: payment.due_date
        });
        acc[key].totalOverdue += 1;
        acc[key].totalAmount += payment.amount;

        return acc;
      }, {});

      console.log("Grouped overdue payments:", groupedByBrother);
      return Object.values(groupedByBrother);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Irmãos Inadimplentes</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Irmão</TableHead>
              <TableHead>Meses Pendentes</TableHead>
              <TableHead className="text-right">Total de Mensalidades</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overduePayments?.map((payment) => (
              <TableRow key={payment.brotherId}>
                <TableCell className="font-medium">{payment.brotherName}</TableCell>
                <TableCell>
                  {payment.overdueMonths
                    .sort((a, b) => {
                      if (a.year !== b.year) return a.year - b.year;
                      return a.month - b.month;
                    })
                    .map(({ month, year, dueDate }) => (
                      <div key={`${month}-${year}`} className="text-sm">
                        {format(new Date(year, month - 1), "MMMM 'de' yyyy", { locale: ptBR })}
                        <span className="text-muted-foreground ml-2">
                          (Vencimento: {format(new Date(dueDate), "dd/MM/yyyy")})
                        </span>
                      </div>
                    ))}
                </TableCell>
                <TableCell className="text-right">{payment.totalOverdue}</TableCell>
                <TableCell className="text-right font-medium">
                  R$ {payment.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {(!overduePayments || overduePayments.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum irmão inadimplente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
