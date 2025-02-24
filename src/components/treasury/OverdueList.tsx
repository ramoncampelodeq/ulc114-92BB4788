
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
import { OverduePayment } from "@/types/payment";

export function OverdueList() {
  const { data: overduePayments } = useQuery({
    queryKey: ["overdue-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_dues")
        .select(`
          brother_id,
          brother:brothers (
            id,
            name
          ),
          month,
          year
        `)
        .eq("status", "overdue");

      if (error) throw error;

      const groupedByBrother = (data || []).reduce<Record<string, OverduePayment>>((acc, payment) => {
        const brotherId = payment.brother_id;
        if (!brotherId || !payment.brother) return acc;

        if (!acc[brotherId]) {
          acc[brotherId] = {
            brotherId,
            brotherName: payment.brother.name,
            overdueMonths: [],
            totalOverdue: 0
          };
        }

        acc[brotherId].overdueMonths.push(`${payment.month}/${payment.year}`);
        acc[brotherId].totalOverdue += 1;

        return acc;
      }, {});

      return Object.values(groupedByBrother);
    }
  });

  const handleGenerateReport = () => {
    // Implementar geração do relatório
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Irmãos Inadimplentes</h2>
        <Button onClick={handleGenerateReport}>
          Gerar Relatório de Inadimplentes
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Irmão</TableHead>
              <TableHead>Meses Pendentes</TableHead>
              <TableHead>Total de Mensalidades Atrasadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overduePayments?.map((payment) => (
              <TableRow key={payment.brotherId}>
                <TableCell>{payment.brotherName}</TableCell>
                <TableCell>{payment.overdueMonths.join(", ")}</TableCell>
                <TableCell>{payment.totalOverdue}</TableCell>
              </TableRow>
            ))}
            {(!overduePayments || overduePayments.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
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
