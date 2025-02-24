
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Brother, MasonicDegree } from "@/types/brother";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format } from "date-fns";
import { toast } from "sonner";

const Brothers = () => {
  const navigate = useNavigate();
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrother, setSelectedBrother] = useState<Brother | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBrothers();
  }, []);

  const fetchBrothers = async () => {
    try {
      const { data, error } = await supabase
        .from('brothers')
        .select('*');
      
      if (error) throw error;
      
      setBrothers(data || []);
    } catch (error) {
      console.error('Error fetching brothers:', error);
      toast.error('Erro ao carregar lista de irmãos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const brotherData = {
      name: formData.get('name') as string,
      profession: formData.get('profession') as string,
      degree: formData.get('degree') as MasonicDegree,
      birthDate: formData.get('birthDate') as string,
      dateInitiated: formData.get('dateInitiated') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      higherDegrees: [],
      relatives: [],
    };

    try {
      if (selectedBrother) {
        const { error } = await supabase
          .from('brothers')
          .update(brotherData)
          .eq('id', selectedBrother.id);

        if (error) throw error;
        toast.success('Irmão atualizado com sucesso');
      } else {
        // Primeiro, criar o usuário no auth
        const password = formData.get('password') as string;
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: brotherData.email,
          password: password,
          options: {
            data: {
              name: brotherData.name,
              role: 'brother'
            }
          }
        });

        if (authError) throw authError;

        if (!authData.user) throw new Error('Erro ao criar usuário');

        // Depois, criar o registro na tabela brothers
        const { error: brotherError } = await supabase
          .from('brothers')
          .insert([{ ...brotherData, id: authData.user.id }]);

        if (brotherError) throw brotherError;

        toast.success('Irmão cadastrado com sucesso');
      }

      setIsDialogOpen(false);
      setSelectedBrother(null);
      fetchBrothers();
    } catch (error: any) {
      console.error('Error saving brother:', error);
      toast.error(error.message || 'Erro ao salvar dados do irmão');
    }
  };

  const handleEdit = (brother: Brother) => {
    setSelectedBrother(brother);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este irmão?')) return;

    try {
      // Primeiro deletar o usuário do auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // O registro na tabela brothers será deletado automaticamente pela foreign key cascade
      
      toast.success('Irmão removido com sucesso');
      fetchBrothers();
    } catch (error) {
      console.error('Error deleting brother:', error);
      toast.error('Erro ao remover irmão');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Irmãos</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedBrother(null)}>
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={selectedBrother?.birthDate}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateInitiated">Data de Iniciação</Label>
                  <Input
                    id="dateInitiated"
                    name="dateInitiated"
                    type="date"
                    defaultValue={selectedBrother?.dateInitiated}
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
                  onClick={() => setIsDialogOpen(false)}
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
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : brothers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum irmão cadastrado
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Grau</TableHead>
                <TableHead>Profissão</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brothers.map((brother) => (
                <TableRow key={brother.id}>
                  <TableCell>{brother.name}</TableCell>
                  <TableCell>{brother.degree}</TableCell>
                  <TableCell>{brother.profession}</TableCell>
                  <TableCell>
                    {format(new Date(brother.birthDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(brother)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(brother.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Brothers;
