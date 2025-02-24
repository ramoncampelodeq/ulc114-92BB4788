
import { Session, SessionFormData } from "@/types/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormData) => Promise<void>;
  session?: Session;
}

export function SessionForm({
  isOpen,
  onClose,
  onSubmit,
  session,
}: SessionFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: SessionFormData = {
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      degree: formData.get("degree") as "aprendiz" | "companheiro" | "mestre",
      agenda: formData.get("agenda") as string,
    };

    console.log("Form data being submitted:", data); // Debug log
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {session ? "Editar Sessão" : "Nova Sessão"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={session?.date}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={session?.time}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="degree">Grau</Label>
              <Select 
                name="degree" 
                defaultValue={session?.degree || "aprendiz"}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprendiz">Aprendiz</SelectItem>
                  <SelectItem value="companheiro">Companheiro</SelectItem>
                  <SelectItem value="mestre">Mestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                name="agenda"
                defaultValue={session?.agenda}
                required
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {session ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
