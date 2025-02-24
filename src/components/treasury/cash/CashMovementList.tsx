
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CashMovement } from "@/types/cash";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface CashMovementListProps {
  movements: CashMovement[];
  onDelete?: (id: string) => void;
}

export function CashMovementList({ movements, onDelete }: CashMovementListProps) {
  const { isAdmin } = useIsAdmin();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getCategoryLabel = (category: CashMovement["category"]) => {
    switch (category) {
      case "monthly_fee":
        return "Mensalidade";
      case "solidarity_trunk":
        return "Tronco de Solidariedade";
      case "other_income":
        return "Outras Entradas";
      case "expense":
        return "Saída";
      default:
        return category;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Descrição</TableHead>
            {isAdmin && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>
                {format(new Date(movement.createdAt), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                {movement.type === "income" ? "Entrada" : "Saída"}
              </TableCell>
              <TableCell>{getCategoryLabel(movement.category)}</TableCell>
              <TableCell className={movement.type === "expense" ? "text-destructive" : "text-primary"}>
                {formatCurrency(movement.amount)}
              </TableCell>
              <TableCell>{movement.description || "-"}</TableCell>
              {isAdmin && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(movement.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
