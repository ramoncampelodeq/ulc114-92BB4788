
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

interface Session {
  id: string;
  date: string;
  degree: string;
  type: string;
  totalPresent: number;
  totalBrothers: number;
}

interface AttendanceTableProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

export const AttendanceTable = ({ sessions, onSessionClick }: AttendanceTableProps) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ordinaria":
        return "Ordinária";
      case "administrativa":
        return "Administrativa";
      case "branca":
        return "Branca";
      case "magna":
        return "Magna";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Grau</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Presentes</TableHead>
            <TableHead>% Presença</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const attendancePercentage = (session.totalPresent / session.totalBrothers) * 100;
            
            return (
              <TableRow 
                key={session.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => onSessionClick(session)}
              >
                <TableCell>
                  {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  {session.degree === "aprendiz"
                    ? "Aprendiz"
                    : session.degree === "companheiro"
                    ? "Companheiro"
                    : "Mestre"}
                </TableCell>
                <TableCell>
                  {getTypeLabel(session.type)}
                </TableCell>
                <TableCell>
                  {session.totalPresent} de {session.totalBrothers} irmãos
                </TableCell>
                <TableCell>
                  {attendancePercentage.toFixed(1)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
