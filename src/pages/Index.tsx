
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
import { fetchBrothers, fetchSessions, fetchAttendance, fetchMonthlyDues, createBrother, updateBrother } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [editingBrother, setEditingBrother] = useState<Brother | undefined>();
  const [isAddingBrother, setIsAddingBrother] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-header">ULC 114 Management System</h1>

      {isAddingBrother ? (
        <div className="max-w-4xl mx-auto">
          <h2 className="section-header">Add New Brother</h2>
          <BrotherForm
            onSubmit={handleAddBrother}
            onCancel={() => setIsAddingBrother(false)}
          />
        </div>
      ) : editingBrother ? (
        <div className="max-w-4xl mx-auto">
          <h2 className="section-header">Edit Brother</h2>
          <BrotherForm
            brother={editingBrother}
            onSubmit={handleUpdateBrother}
            onCancel={() => setEditingBrother(undefined)}
          />
        </div>
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:w-[600px]">
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
      )}
    </div>
  );
};

export default Index;
