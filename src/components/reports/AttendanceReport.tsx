
import { AttendanceRecord } from "@/types/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, differenceInDays } from "date-fns";
import { AlertCircle } from "lucide-react";

interface AttendanceReportProps {
  records: AttendanceRecord[];
}

export default function AttendanceReport({ records }: AttendanceReportProps) {
  // Sort records by participation percentage in descending order
  const sortedRecords = [...records].sort(
    (a, b) => b.participationPercentage - a.participationPercentage
  );

  // Get brothers who haven't attended in 50+ days
  const now = new Date();
  const inactiveRecords = records.filter((record) => {
    if (!record.lastAttendance) return true;
    const days = differenceInDays(now, new Date(record.lastAttendance));
    return days >= 50;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {inactiveRecords.length > 0 && (
        <div className="space-y-4">
          {inactiveRecords.map((record) => {
            const days = record.lastAttendance
              ? differenceInDays(now, new Date(record.lastAttendance))
              : Infinity;

            return (
              <Alert
                key={record.brother.id}
                variant={days >= 60 ? "destructive" : "default"}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attendance Alert</AlertTitle>
                <AlertDescription>
                  Brother {record.brother.name} hasn't attended in{" "}
                  {record.lastAttendance
                    ? `${days} days`
                    : "any recorded sessions"}
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brother</TableHead>
              <TableHead>Total Sessions</TableHead>
              <TableHead>Attended</TableHead>
              <TableHead>Participation</TableHead>
              <TableHead>Last Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((record) => (
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
