
import { useEffect, useState } from "react";
import { AttendanceRecord } from "@/types/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, differenceInDays } from "date-fns";
import { Bell } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AttendanceListProps {
  records: AttendanceRecord[];
}

export default function AttendanceList({ records }: AttendanceListProps) {
  const [alerts, setAlerts] = useState<
    { brotherId: string; name: string; days: number }[]
  >([]);

  useEffect(() => {
    const now = new Date();
    const newAlerts = records
      .map((record) => {
        if (!record.lastAttendance) return null;
        const days = differenceInDays(now, new Date(record.lastAttendance));
        if (days >= 50) {
          return {
            brotherId: record.brother.id,
            name: record.brother.name,
            days,
          };
        }
        return null;
      })
      .filter((alert): alert is { brotherId: string; name: string; days: number } =>
        alert !== null
      );

    setAlerts(newAlerts);
  }, [records]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert
              key={alert.brotherId}
              variant={alert.days >= 60 ? "destructive" : "default"}
            >
              <Bell className="h-4 w-4" />
              <AlertTitle>Attendance Alert</AlertTitle>
              <AlertDescription>
                Brother {alert.name} hasn't attended in {alert.days} days
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total Sessions</TableHead>
              <TableHead>Attended Sessions</TableHead>
              <TableHead>Participation %</TableHead>
              <TableHead>Last Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.brother.id}>
                <TableCell className="font-medium">
                  {record.brother.name}
                </TableCell>
                <TableCell>{record.totalSessions}</TableCell>
                <TableCell>{record.attendedSessions}</TableCell>
                <TableCell>
                  {record.participationPercentage.toFixed(1)}%
                </TableCell>
                <TableCell>
                  {record.lastAttendance
                    ? format(new Date(record.lastAttendance), "PP")
                    : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
