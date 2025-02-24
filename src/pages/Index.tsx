import { useState, useEffect } from "react";
import { Brother, BrotherFormData } from "@/types/brother";
import BrotherList from "@/components/brothers/BrotherList";
import BirthdayList from "@/components/brothers/BirthdayList";
import BrotherForm from "@/components/brothers/BrotherForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TreasuryReport from "@/components/reports/TreasuryReport";
import AttendanceReport from "@/components/reports/AttendanceReport";
import { fetchBrothers, fetchSessions, fetchAttendance, fetchMonthlyDues, createBrother, updateBrother, supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch data using React Query
  const { data: brothers = [] } = useQuery({
    queryKey: ['brothers'],
    queryFn: fetchBrothers,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance'],
    queryFn: fetchAttendance,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['monthly-dues'],
    queryFn: fetchMonthlyDues,
  });

  const [editingBrother, setEditingBrother] = useState<Brother | undefined>();
  const [isAddingBrother, setIsAddingBrother] = useState(false);

  const handleAddBrother = async (data: BrotherFormData) => {
    try {
      await createBrother(data);
      queryClient.invalidateQueries({ queryKey: ['brothers'] });
      setIsAddingBrother(false);
      toast({
        title: "Brother Added",
        description: "The new brother has been successfully added to the directory.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add brother. Please try again.",
      });
    }
  };

  const handleUpdateBrother = async (data: BrotherFormData) => {
    if (!editingBrother) return;

    try {
      await updateBrother(editingBrother.id, data);
      queryClient.invalidateQueries({ queryKey: ['brothers'] });
      setEditingBrother(undefined);
      toast({
        title: "Brother Updated",
        description: "The brother's information has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update brother. Please try again.",
      });
    }
  };

  // Calculate attendance records
  const attendanceRecords = brothers.map((brother) => {
    const brotherAttendance = attendance.filter((a) => a.brotherId === brother.id);
    const totalSessions = sessions.length;
    const attendedSessions = brotherAttendance.filter((a) => a.present).length;
    const participationPercentage = (attendedSessions / totalSessions) * 100;
    const lastAttendance = brotherAttendance
      .filter((a) => a.present)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt;

    return {
      brother,
      totalSessions,
      attendedSessions,
      participationPercentage,
      lastAttendance,
    };
  });

  // Calculate payment records
  const paymentRecords = brothers.map((brother) => {
    const brotherPayments = payments.filter((p) => p.brotherId === brother.id);
    const overdueCount = brotherPayments.filter((p) => p.status === "overdue").length;
    const lastPayment = brotherPayments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      brother,
      payments: brotherPayments,
      overdueCount,
      lastPayment,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-primary font-semibold">ULC 114</h1>
          <Button 
            variant="ghost" 
            onClick={async () => {
              try {
                await supabase.auth.signOut();
                navigate('/auth');
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to sign out. Please try again.",
                });
              }
            }}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px] mx-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="brothers">Brothers</TabsTrigger>
              <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="treasury">Treasury</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <AdminDashboard
                brothers={brothers}
                sessions={sessions}
                payments={paymentRecords}
                attendance={attendanceRecords}
                onAddBrother={() => setIsAddingBrother(true)}
                onAddSession={() => {}}
                onManageAttendance={() => {}}
                onManagePayments={() => {}}
              />
            </TabsContent>

            <TabsContent value="brothers" className="mt-6">
              <BrotherList
                brothers={brothers}
                onEdit={setEditingBrother}
                onAdd={() => setIsAddingBrother(true)}
              />
            </TabsContent>

            <TabsContent value="birthdays" className="mt-6">
              <BirthdayList brothers={brothers} />
            </TabsContent>

            <TabsContent value="attendance" className="mt-6">
              <AttendanceReport records={attendanceRecords} />
            </TabsContent>

            <TabsContent value="treasury" className="mt-6">
              <TreasuryReport records={paymentRecords} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
