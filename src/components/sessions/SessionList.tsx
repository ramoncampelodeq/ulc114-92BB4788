
import { Session } from "@/types/session";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SessionListProps {
  sessions: Session[];
  onAttendanceClick: (session: Session) => void;
  onFileUpload: (sessionId: string, file: File) => void;
  isUploading: string | null;
}

export function SessionList({
  sessions,
  onAttendanceClick,
  onFileUpload,
  isUploading,
}: SessionListProps) {
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
              <TableCell className="max-w-[300px] truncate">
                {session.agenda}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAttendanceClick(session)}
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
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`file-${session.id}`}
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onFileUpload(session.id, file);
                          }
                        }}
                      />
                      <label
                        htmlFor={`file-${session.id}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading === session.id ? "Enviando..." : "Anexar PDF"}
                      </label>
                    </div>
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
