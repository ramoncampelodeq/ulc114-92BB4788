
import { useState, useEffect } from "react";
import { Brother } from "@/types/brother";
import { Session } from "@/types/session";
import { Attendance } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface AttendanceFormProps {
  session: Session;
  brothers: Brother[];
  existingAttendance?: Attendance[];
  onSubmit: (attendance: Attendance[]) => void;
  onCancel: () => void;
}

export default function AttendanceForm({
  session,
  brothers,
  existingAttendance,
  onSubmit,
  onCancel,
}: AttendanceFormProps) {
  const [attendance, setAttendance] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    const initialAttendance = new Map<string, boolean>();
    brothers.forEach((brother) => {
      const existing = existingAttendance?.find(
        (a) => a.brotherId === brother.id
      );
      initialAttendance.set(brother.id, existing?.present || false);
    });
    setAttendance(initialAttendance);
  }, [brothers, existingAttendance]);

  const handleSubmit = () => {
    const attendanceRecords: Attendance[] = Array.from(attendance.entries()).map(
      ([brotherId, present]) => ({
        id: Math.random().toString(36).substr(2, 9),
        sessionId: session.id,
        brotherId,
        present,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    onSubmit(attendanceRecords);
  };

  const totalPresent = Array.from(attendance.values()).filter(
    (present) => present
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Session Details</h3>
        <p>Date: {format(new Date(session.date), "PP")}</p>
        <p>Time: {session.time}</p>
        <p>Degree: {session.degree}</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Present</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Degree</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brothers.map((brother) => (
              <TableRow key={brother.id}>
                <TableCell>
                  <Checkbox
                    checked={attendance.get(brother.id) || false}
                    onCheckedChange={(checked) => {
                      setAttendance(new Map(attendance.set(brother.id, !!checked)));
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{brother.name}</TableCell>
                <TableCell>{brother.degree}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="font-medium">
          Total Present: {totalPresent} out of {brothers.length} brothers
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Attendance</Button>
      </div>
    </div>
  );
}
