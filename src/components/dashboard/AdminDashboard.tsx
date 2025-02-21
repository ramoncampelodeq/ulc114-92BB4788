
import { Brother } from "@/types/brother";
import { Session } from "@/types/session";
import { PaymentRecord } from "@/types/payment";
import { AttendanceRecord } from "@/types/attendance";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  AlertCircle,
  Plus,
} from "lucide-react";

interface AdminDashboardProps {
  brothers: Brother[];
  sessions: Session[];
  payments: PaymentRecord[];
  attendance: AttendanceRecord[];
  onAddBrother: () => void;
  onAddSession: () => void;
  onManageAttendance: (sessionId: string) => void;
  onManagePayments: (brotherId: string) => void;
}

export default function AdminDashboard({
  brothers,
  sessions,
  payments,
  attendance,
  onAddBrother,
  onAddSession,
  onManageAttendance,
  onManagePayments,
}: AdminDashboardProps) {
  const totalBrothers = brothers.length;
  const totalSessions = sessions.length;
  
  const averageAttendance = attendance.reduce(
    (sum, record) => sum + record.participationPercentage,
    0
  ) / attendance.length;

  const overduePayments = payments.filter(
    (record) => record.overdueCount > 0
  ).length;

  const criticalOverdue = payments.filter(
    (record) => record.overdueCount >= 2
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Brothers"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">{totalBrothers}</div>
        </DashboardCard>

        <DashboardCard
          title="Total Sessions"
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">{totalSessions}</div>
        </DashboardCard>

        <DashboardCard
          title="Average Attendance"
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">
            {averageAttendance.toFixed(1)}%
          </div>
        </DashboardCard>

        <DashboardCard
          title="Overdue Payments"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold text-destructive">
            {overduePayments}
          </div>
          {criticalOverdue > 0 && (
            <p className="text-xs text-destructive mt-1">
              {criticalOverdue} brothers with 2+ months overdue
            </p>
          )}
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Sessions</h3>
            <Button onClick={onAddSession} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.slice(0, 5).map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{format(new Date(session.date), "PP")}</TableCell>
                    <TableCell>{session.degree}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onManageAttendance(session.id)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Overdue Payments</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brother</TableHead>
                  <TableHead>Months Overdue</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments
                  .filter((record) => record.overdueCount > 0)
                  .slice(0, 5)
                  .map((record) => (
                    <TableRow key={record.brother.id}>
                      <TableCell>{record.brother.name}</TableCell>
                      <TableCell>
                        <span className="text-destructive font-medium">
                          {record.overdueCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onManagePayments(record.brother.id)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
