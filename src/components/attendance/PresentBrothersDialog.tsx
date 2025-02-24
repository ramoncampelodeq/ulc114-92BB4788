
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brother } from "@/types/brother";

interface PresentBrothersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionDate?: string;
  brothers: Brother[];
}

export const PresentBrothersDialog = ({
  isOpen,
  onOpenChange,
  sessionDate,
  brothers,
}: PresentBrothersDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Irmãos Presentes - {sessionDate && format(new Date(sessionDate), "dd/MM/yyyy")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {brothers.length > 0 ? (
            <div className="space-y-2">
              {brothers.map((brother) => (
                <div key={brother.id} className="p-2 rounded bg-muted">
                  <p className="font-medium">{brother.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {brother.degree} - {brother.profession}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Nenhum irmão presente nesta sessão
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
