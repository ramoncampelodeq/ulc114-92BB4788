
import { Brother } from "@/types/brother";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isValid, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

interface BrothersTableProps {
  brothers: Brother[];
  onEdit: (brother: Brother) => void;
  onDelete: (id: string) => void;
}

export function BrothersTable({ brothers, onEdit, onDelete }: BrothersTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy') : '-';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Grau</TableHead>
            <TableHead>Profissão</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brothers.map((brother) => (
            <TableRow key={brother.id}>
              <TableCell>{brother.name}</TableCell>
              <TableCell>{brother.degree}</TableCell>
              <TableCell>{brother.profession}</TableCell>
              <TableCell>
                {formatDate(brother.birthDate)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(brother)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(brother.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
