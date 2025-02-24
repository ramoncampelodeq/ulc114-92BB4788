
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Brother } from "@/types/brother";

interface AttendanceReportProps {
  brother: Brother | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttendanceReport({ brother, isOpen, onClose }: AttendanceReportProps) {
  const { data: sessionAttendance, isLoading } = useQuery({
    queryKey: ["brother-attendance", brother?.id],
    queryFn: async () => {
      if (!brother) return [];

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select(`
          *,
          attendance!inner (
            present
          )
        `)
        .eq("attendance.brother_id", brother.id)
        .order("date", { ascending: false });

      if (sessionsError) throw sessionsError;

      return sessionsData;
    },
    enabled: !!brother
  });

  if (!brother) return null;

  const totalSessions = sessionAttendance?.length || 0;
  const totalPresent = sessionAttendance?.filter(session => 
    session.attendance.some(a => a.present)
  ).length || 0;
  const attendancePercentage = totalSessions ? (totalPresent / totalSessions) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Relatório de Presenças - {brother.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total de Sessões</p>
              <p className="text-2xl font-semibold">{totalSessions}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Presenças</p>
              <p className="text-2xl font-semibold">{totalPresent}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">% Presença</p>
              <p className="text-2xl font-semibold">{attendancePercentage.toFixed(1)}%</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : sessionAttendance && sessionAttendance.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Grau</TableHead>
                    <TableHead>Presente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionAttendance.map((session) => (
                    <TableRow key={session.id}>
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
                        {session.attendance.some(a => a.present) ? "Sim" : "Não"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registro de presença encontrado
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
