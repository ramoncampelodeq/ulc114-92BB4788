
import { PaymentRecord } from "@/types/payment";
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
import { AlertCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaymentListProps {
  records: PaymentRecord[];
  onManagePayments: (brotherId: string) => void;
}

export default function PaymentList({ records, onManagePayments }: PaymentListProps) {
  const criticalOverdue = records.filter((record) => record.overdueCount >= 2);

  return (
    <div className="space-y-6 animate-fadeIn">
      {criticalOverdue.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Payment Alert</AlertTitle>
          <AlertDescription>
            {criticalOverdue.length} brothers have 2 or more overdue payments
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Overdue Months</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record.brother.id}
                className={record.overdueCount > 0 ? "bg-destructive/5" : ""}
              >
                <TableCell className="font-medium">
                  {record.brother.name}
                </TableCell>
                <TableCell>
                  {record.lastPayment
                    ? format(new Date(record.lastPayment.paidAt!), "PP")
                    : "No payments"}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      record.overdueCount > 0
                        ? "text-destructive font-medium"
                        : ""
                    }
                  >
                    {record.overdueCount}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onManagePayments(record.brother.id)}
                    className="space-x-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Manage Payments</span>
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
