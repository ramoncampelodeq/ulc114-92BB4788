
import { Brother, MasonicDegree } from "@/types/brother";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BrotherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBrother: Brother | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function BrotherDialog({
  isOpen,
  onOpenChange,
  selectedBrother,
  onSubmit,
}: BrotherDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Irmão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedBrother ? 'Editar Irmão' : 'Novo Irmão'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedBrother?.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={selectedBrother?.email}
                required
              />
            </div>
            {/* Agora mostramos a seleção de role mesmo ao editar */}
            <div className="grid gap-2">
              <Label htmlFor="role">Tipo de Usuário</Label>
              <Select name="role" defaultValue="brother">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brother">Usuário Normal</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!selectedBrother && (
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="profession">Profissão</Label>
              <Input
                id="profession"
                name="profession"
                defaultValue={selectedBrother?.profession}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="degree">Grau</Label>
              <Select name="degree" defaultValue={selectedBrother?.degree || "Apprentice"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apprentice">Aprendiz</SelectItem>
                  <SelectItem value="Fellow Craft">Companheiro</SelectItem>
                  <SelectItem value="Master Mason">Mestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={selectedBrother?.birth_date}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={selectedBrother?.phone}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {selectedBrother ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
