import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash, UserCheck } from "lucide-react";
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
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface SessionsTableProps {
  sessions: Session[];
  editingTrunkId: string | null;
  isUploading: string | null;
  onSelectSession: (session: Session) => void;
  onEditTrunk: (id: string) => void;
  onUpdateTrunk: (id: string, amount: string) => void;
  onCancelEdit: () => void;
  onFileUpload: (sessionId: string, file: File) => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
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
  onEditSession,
  onDeleteSession,
}: SessionsTableProps) {
  const { isAdmin } = useIsAdmin();

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
            {isAdmin && <TableHead>Ações</TableHead>}
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
                {isAdmin ? (
                  <TrunkAmountCell
                    session={session}
                    editingId={editingTrunkId}
                    onEdit={onEditTrunk}
                    onUpdate={onUpdateTrunk}
                    onCancel={onCancelEdit}
                  />
                ) : (
                  <span>
                    {session.daily_trunk_amount
                      ? `R$ ${session.daily_trunk_amount.toFixed(2)}`
                      : "-"}
                  </span>
                )}
              </TableCell>
              <TableCell className="max-w-[300px] truncate">
                {session.agenda}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectSession(session)}
                    >
                      <UserCheck className="h-4 w-4" />
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditSession(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteSession(session.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
