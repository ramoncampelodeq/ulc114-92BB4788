
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brother } from "@/types/brother";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrotherDetailsProps {
  brother: Brother | null;
  onClose: () => void;
}

export default function BrotherDetails({ brother, onClose }: BrotherDetailsProps) {
  if (!brother) return null;

  return (
    <Dialog open={!!brother} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Brother Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Name</h3>
                <p className="text-muted-foreground">{brother.name}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Profession</h3>
                <p className="text-muted-foreground">{brother.profession}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Birth Date</h3>
                <p className="text-muted-foreground">
                  {format(new Date(brother.birthDate), "PP")}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Degree</h3>
                <p className="text-muted-foreground">{brother.degree}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <p className="text-muted-foreground">{brother.email}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Phone</h3>
                <p className="text-muted-foreground">{brother.phone}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Initiated Date</h3>
                <p className="text-muted-foreground">
                  {format(new Date(brother.dateInitiated), "PP")}
                </p>
              </div>
            </div>

            {brother.higherDegrees.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Higher Degrees</h3>
                <div className="space-y-2">
                  {brother.higherDegrees.map((degree, index) => (
                    <div
                      key={index}
                      className="bg-muted p-3 rounded-md grid grid-cols-3 gap-2"
                    >
                      <p>Degree {degree.degree}</p>
                      <p>{format(new Date(degree.dateReceived), "PP")}</p>
                      <p>{degree.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {brother.relatives.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Family Members</h3>
                <div className="space-y-2">
                  {brother.relatives.map((relative) => (
                    <div
                      key={relative.id}
                      className="bg-muted p-3 rounded-md grid grid-cols-3 gap-2"
                    >
                      <p>{relative.name}</p>
                      <p>{relative.relationship}</p>
                      <p>{format(new Date(relative.birthDate), "PP")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
