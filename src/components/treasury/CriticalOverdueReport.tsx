
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
import { AlertTriangle } from "lucide-react";
import { fetchCriticalOverdueBrothers } from "@/lib/supabase";

export function CriticalOverdueReport() {
  const { data: criticalBrothers, isLoading } = useQuery({
    queryKey: ["critical-overdue-brothers"],
    queryFn: fetchCriticalOverdueBrothers,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inadimplentes Críticos</CardTitle>
          <CardDescription>
            Irmãos com 2 ou mais mensalidades em atraso
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

  if (!criticalBrothers?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inadimplentes Críticos</CardTitle>
          <CardDescription>
            Irmãos com 2 ou mais mensalidades em atraso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Nenhum irmão com inadimplência crítica.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Inadimplentes Críticos</CardTitle>
        </div>
        <CardDescription>
          Irmãos com 2 ou mais mensalidades em atraso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Mensalidades em Atraso</TableHead>
              <TableHead>Último Vencimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criticalBrothers.map((brother) => (
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
