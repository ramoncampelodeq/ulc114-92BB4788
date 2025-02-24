
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Brother, MasonicDegree } from "@/types/brother";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BrotherDialog } from "@/components/brothers/BrotherDialog";
import { BrothersTable } from "@/components/brothers/BrothersTable";

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
      birth_date: formData.get('birth_date') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      higher_degree: null,
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

        // Depois, criar o registro na tabela brothers vinculado ao usuário criado
        const { error: brotherError } = await supabase
          .from('brothers')
          .insert([{ 
            ...brotherData,
            id: authData.user.id,
            user_id: authData.user.id 
          }]);

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
        <BrotherDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedBrother={selectedBrother}
          onSubmit={handleSubmit}
        />
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : brothers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum irmão cadastrado
        </div>
      ) : (
        <BrothersTable
          brothers={brothers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Brothers;
