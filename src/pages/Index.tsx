
import { useState } from "react";
import { Brother, BrotherFormData } from "@/types/brother";
import BrotherList from "@/components/brothers/BrotherList";
import BirthdayList from "@/components/brothers/BirthdayList";
import BrotherForm from "@/components/brothers/BrotherForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TreasuryReport from "@/components/reports/TreasuryReport";
import AttendanceReport from "@/components/reports/AttendanceReport";

const Index = () => {
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [editingBrother, setEditingBrother] = useState<Brother | undefined>();
  const [isAddingBrother, setIsAddingBrother] = useState(false);
  const { toast } = useToast();

  const handleAddBrother = (data: BrotherFormData) => {
    const newBrother: Brother = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      higherDegrees: [],
      relatives: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBrothers([...brothers, newBrother]);
    setIsAddingBrother(false);
    toast({
      title: "Brother Added",
      description: "The new brother has been successfully added to the directory.",
    });
  };

  const handleUpdateBrother = (data: BrotherFormData) => {
    if (!editingBrother) return;

    const updatedBrother: Brother = {
      ...editingBrother,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    setBrothers(
      brothers.map((b) => (b.id === editingBrother.id ? updatedBrother : b))
    );
    setEditingBrother(undefined);
    toast({
      title: "Brother Updated",
      description: "The brother's information has been successfully updated.",
    });
  };

  // Mock data for demonstration
  const mockAttendanceData = brothers.map((brother) => ({
    brother,
    totalSessions: 10,
    attendedSessions: Math.floor(Math.random() * 11),
    participationPercentage: Math.random() * 100,
    lastAttendance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const mockPaymentData = brothers.map((brother) => ({
    brother,
    payments: [],
    overdueCount: Math.floor(Math.random() * 3),
    lastPayment: brother.id.length % 2 === 0 ? {
      id: "mock",
      brotherId: brother.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: 100,
      status: "paid" as const,
      paidAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } : undefined,
  }));

  const mockSessionData = Array.from({ length: 5 }, (_, i) => ({
    id: `mock-${i}`,
    date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: "19:00",
    degree: "Master Mason" as const,
    topic: "Regular Session",
    agenda: "Monthly Regular Meeting",
    minutes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

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
              sessions={mockSessionData}
              payments={mockPaymentData}
              attendance={mockAttendanceData}
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
            <AttendanceReport records={mockAttendanceData} />
          </TabsContent>

          <TabsContent value="treasury" className="mt-6">
            <TreasuryReport records={mockPaymentData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Index;
