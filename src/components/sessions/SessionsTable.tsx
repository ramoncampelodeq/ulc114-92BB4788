
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Session } from "@/types/session";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrunkAmountCell } from "./TrunkAmountCell";
import { MinutesUploadButton } from "./MinutesUploadButton";

interface SessionsTableProps {
  sessions: Session[];
  editingTrunkId: string | null;
  isUploading: string | null;
  onSelectSession: (session: Session) => void;
  onEditTrunk: (id: string) => void;
  onUpdateTrunk: (id: string, amount: string) => void;
  onCancelEdit: () => void;
  onFileUpload: (sessionId: string, file: File) => void;
}

export function SessionsTable({
  sessions,
  editingTrunkId,
  isUploading,
  onSelectSession,
  onEditTrunk,
  onUpdateTrunk,
  onCancelEdit,
  onFileUpload,
}: SessionsTableProps) {
  const getDegreeLabel = (degree: string) => {
    switch (degree) {
      case "aprendiz":
        return "Aprendiz";
      case "companheiro":
        return "Companheiro";
      case "mestre":
        return "Mestre";
      default:
        return degree;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Grau</TableHead>
            <TableHead>Tronco do Dia</TableHead>
            <TableHead className="max-w-[300px]">Agenda</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>{session.time}</TableCell>
              <TableCell>{getDegreeLabel(session.degree)}</TableCell>
              <TableCell>
                <TrunkAmountCell
                  session={session}
                  editingId={editingTrunkId}
                  onEdit={onEditTrunk}
                  onUpdate={onUpdateTrunk}
                  onCancel={onCancelEdit}
                />
              </TableCell>
              <TableCell className="max-w-[300px] truncate">
                {session.agenda}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectSession(session)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Presenças
                  </Button>
                  {session.minutes_url ? (
                    <a
                      href={session.minutes_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    <MinutesUploadButton
                      sessionId={session.id}
                      isUploading={isUploading === session.id}
                      onFileSelect={(file) => onFileUpload(session.id, file)}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
