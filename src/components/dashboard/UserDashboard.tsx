
import { Brother, HigherDegree, Relative } from "@/types/brother";
import { MonthlyPayment } from "@/types/payment";
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
  UserCheck,
  DollarSign,
  GraduationCap,
  Users,
  Edit,
  Plus,
} from "lucide-react";

interface UserDashboardProps {
  brother: Brother;
  attendance: {
    totalSessions: number;
    attendedSessions: number;
    participationPercentage: number;
    recentSessions: { date: string; present: boolean }[];
  };
  payments: MonthlyPayment[];
  onEditProfile: () => void;
  onEditHigherDegrees: () => void;
  onManageRelatives: () => void;
}

export default function UserDashboard({
  brother,
  attendance,
  payments,
  onEditProfile,
  onEditHigherDegrees,
  onManageRelatives,
}: UserDashboardProps) {
  const overduePayments = payments.filter(
    (payment) => payment.status === "overdue"
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Attendance Rate"
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">
            {attendance.participationPercentage.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {attendance.attendedSessions} of {attendance.totalSessions} sessions
          </p>
        </DashboardCard>

        <DashboardCard
          title="Payment Status"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">
            {overduePayments > 0 ? (
              <span className="text-destructive">{overduePayments} Overdue</span>
            ) : (
              "Up to date"
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Higher Degrees"
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">
            {brother.higherDegrees.length > 0
              ? Math.max(...brother.higherDegrees.map((d) => d.degree))
              : "-"}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditHigherDegrees}
            className="mt-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </DashboardCard>

        <DashboardCard
          title="Family Members"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">{brother.relatives.length}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onManageRelatives}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Attendance</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.recentSessions.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(session.date), "PP")}</TableCell>
                    <TableCell>
                      <span
                        className={
                          session.present ? "text-green-600" : "text-destructive"
                        }
                      >
                        {session.present ? "Present" : "Absent"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Payments</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 5).map((payment, index) => (
                  <TableRow
                    key={index}
                    className={
                      payment.status === "overdue" ? "bg-destructive/5" : ""
                    }
                  >
                    <TableCell>
                      {new Date(0, payment.month - 1).toLocaleString("default", {
                        month: "long",
                      })}{" "}
                      {payment.year}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          payment.status === "overdue"
                            ? "text-destructive font-medium"
                            : payment.status === "paid"
                            ? "text-green-600 font-medium"
                            : ""
                        }
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(payment.dueDate), "PP")}</TableCell>
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
