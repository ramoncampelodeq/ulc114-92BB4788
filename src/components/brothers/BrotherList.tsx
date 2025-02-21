
import { useState } from "react";
import { Brother } from "@/types/brother";
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
import { Edit, UserPlus } from "lucide-react";

interface BrotherListProps {
  brothers: Brother[];
  onEdit: (brother: Brother) => void;
  onAdd: () => void;
}

export default function BrotherList({ brothers, onEdit, onAdd }: BrotherListProps) {
  const [sortField, setSortField] = useState<keyof Brother>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedBrothers = [...brothers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Brother) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-header">Brothers Directory</h2>
        <Button onClick={onAdd} className="space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Brother</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort("name")}
              >
                Name
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort("profession")}
              >
                Profession
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort("degree")}
              >
                Degree
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort("birthDate")}
              >
                Birthday
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBrothers.map((brother) => (
              <TableRow key={brother.id}>
                <TableCell className="font-medium">{brother.name}</TableCell>
                <TableCell>{brother.profession}</TableCell>
                <TableCell>{brother.degree}</TableCell>
                <TableCell>{format(new Date(brother.birthDate), "PP")}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(brother)}
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
