
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subMonths } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Brother } from "@/types/brother";
import { Header } from "@/components/layout/Header";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceChart } from "@/components/attendance/AttendanceChart";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { PresentBrothersDialog } from "@/components/attendance/PresentBrothersDialog";
import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/components/ui/use-toast";

const Attendance = () => {
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedBrother, setSelectedBrother] = useState<Brother | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [presentBrothers, setPresentBrothers] = useState<Brother[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions-with-attendance", selectedDegree, selectedType, selectedPeriod],
    queryFn: async () => {
      let query = supabase
        .from("sessions")
        .select(`
          *,
          attendance (
            brother_id,
            present,
            brother:brothers (
              id,
              name,
              degree,
              profession
            )
          )
        `)
        .order("date", { ascending: false });

      if (selectedDegree !== "all") {
        query = query.eq("degree", selectedDegree);
      }

      if (selectedType !== "all") {
        query = query.eq("type", selectedType);
      }

      if (selectedPeriod !== "all") {
        const monthsAgo = subMonths(new Date(), parseInt(selectedPeriod));
        query = query.gte("date", monthsAgo.toISOString());
      }

      const { data: sessionsData, error: sessionsError } = await query;

      if (sessionsError) throw sessionsError;

      const { data: brothersData, error: brothersError } = await supabase
        .from("brothers")
        .select("*");

      if (brothersError) throw brothersError;

      return sessionsData.map(session => ({
        ...session,
        totalPresent: session.attendance?.filter(a => a.present).length || 0,
        totalBrothers: brothersData.length,
        date: session.date
      }));
    }
  });

  const handleSessionClick = async (session: any) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas administradores podem gerenciar presenças",
      });
      return;
    }

    setSelectedSession(session);
    const presentBrothers = session.attendance
      ?.filter((a: any) => a.present)
      .map((a: any) => a.brother)
      .filter((b: any) => b !== null);
    
    setPresentBrothers(presentBrothers || []);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header currentPage="Presenças" />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-8 text-muted-foreground">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage="Presenças" />

      <div className="container mx-auto py-8 px-4">
        <AttendanceFilters
          selectedDegree={selectedDegree}
          setSelectedDegree={setSelectedDegree}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />

        {sessions && sessions.length > 0 ? (
          <div className="space-y-6">
            <AttendanceChart sessions={sessions} />
            <AttendanceTable
              sessions={sessions}
              onSessionClick={handleSessionClick}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum registro de presença encontrado
          </div>
        )}

        {isAdmin && (
          <PresentBrothersDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            sessionDate={selectedSession?.date}
            brothers={presentBrothers}
          />
        )}

        <AttendanceReport
          brother={selectedBrother}
          isOpen={!!selectedBrother}
          onClose={() => setSelectedBrother(null)}
        />
      </div>
    </div>
  );
}

export default Attendance;
