
import { Session } from "@/types/session";
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
import { Edit, FilePlus, FileUp } from "lucide-react";
import { Input } from "../ui/input";

interface SessionListProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onAdd: () => void;
  onUploadBalaustre: (session: Session) => void;
}

export default function SessionList({
  sessions,
  onEdit,
  onAdd,
  onUploadBalaustre,
}: SessionListProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-header">Sessions</h2>
        <Button onClick={onAdd} className="space-x-2">
          <FilePlus className="h-4 w-4" />
          <span>Add Session</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Agenda</TableHead>
              <TableHead>Balaustre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{format(new Date(session.date), "PP")}</TableCell>
                <TableCell>{session.time}</TableCell>
                <TableCell>{session.degree}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {session.agenda}
                </TableCell>
                <TableCell>
                  {session.balaustreUrl ? (
                    <a
                      href={session.balaustreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUploadBalaustre(session)}
                      className="space-x-2"
                    >
                      <FileUp className="h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(session)}
                    className="space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
