
import { useQuery } from "@tanstack/react-query";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchCriticalOverdueBrothers } from "@/lib/supabase";
import type { CriticalOverdueBrother } from "@/types/brother";

export function CriticalOverdueReport() {
  const { data: criticalBrothers } = useQuery({
    queryKey: ["critical-overdue-brothers"],
    queryFn: fetchCriticalOverdueBrothers
  });

  const totalBrothers = criticalBrothers?.length || 0;
  const overduePercentage = totalBrothers > 0 ? (totalBrothers / 100) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Inadimplência Crítica</CardTitle>
        <CardDescription>
          Irmãos com 2 ou mais mensalidades atrasadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Total de Irmãos Críticos
              </h4>
              <p className="text-2xl font-bold">{totalBrothers}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Percentual de Inadimplência
              </h4>
              <p className="text-2xl font-bold">{overduePercentage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Irmão</TableHead>
                  <TableHead>Mensalidades Atrasadas</TableHead>
                  <TableHead>Último Vencimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalBrothers?.map((brother: CriticalOverdueBrother) => (
                  <TableRow key={brother.id}>
                    <TableCell>{brother.name}</TableCell>
                    <TableCell>{brother.overdueCount}</TableCell>
                    <TableCell>
                      {format(new Date(brother.latestDueDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                {(!criticalBrothers || criticalBrothers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      Nenhum irmão em situação crítica encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
