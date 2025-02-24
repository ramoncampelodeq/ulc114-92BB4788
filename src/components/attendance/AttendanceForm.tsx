
import { useState, useEffect } from "react";
import { Brother } from "@/types/brother";
import { Session } from "@/types/session";
import { Attendance } from "@/types/attendance";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface AttendanceFormProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

export function AttendanceForm({ session, isOpen, onClose }: AttendanceFormProps) {
  const { toast } = useToast();
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [attendance, setAttendance] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(true);

  // Buscar irmãos e presenças existentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar todos os irmãos
        const { data: brothersData, error: brothersError } = await supabase
          .from("brothers")
          .select("*")
          .order("name");

        if (brothersError) throw brothersError;

        // Buscar presenças existentes para esta sessão
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*")
          .eq("session_id", session.id);

        if (attendanceError) throw attendanceError;

        // Inicializar o mapa de presenças
        const initialAttendance = new Map<string, boolean>();
        brothersData.forEach((brother) => {
          const existing = attendanceData?.find(
            (a) => a.brother_id === brother.id
          );
          initialAttendance.set(brother.id, existing?.present || false);
        });

        setBrothers(brothersData);
        setAttendance(initialAttendance);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message,
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, session.id, toast]);

  const handleSave = async () => {
    try {
      const records = Array.from(attendance.entries()).map(([brotherId, present]) => ({
        session_id: session.id,
        brother_id: brotherId,
        present,
      }));

      // Deletar registros existentes
      const { error: deleteError } = await supabase
        .from("attendance")
        .delete()
        .eq("session_id", session.id);

      if (deleteError) throw deleteError;

      // Inserir novos registros
      const { error: insertError } = await supabase
        .from("attendance")
        .insert(records);

      if (insertError) throw insertError;

      toast({
        title: "Presenças registradas com sucesso!",
      });

      onClose();
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar presenças",
        description: error.message,
      });
    }
  };

  const totalPresent = Array.from(attendance.values()).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registro de Presenças</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Presente</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Grau</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brothers.map((brother) => (
                    <TableRow key={brother.id}>
                      <TableCell>
                        <Checkbox
                          checked={attendance.get(brother.id) || false}
                          onCheckedChange={(checked) => {
                            setAttendance(
                              new Map(attendance.set(brother.id, !!checked))
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>{brother.name}</TableCell>
                      <TableCell>{brother.degree}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Total de Presentes: {totalPresent} de {brothers.length} irmãos
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar Presenças</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
