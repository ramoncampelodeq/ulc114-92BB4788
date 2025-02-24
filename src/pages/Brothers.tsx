
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Brother, MasonicDegree } from "@/types/brother";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
} from "lucide-react";
import { BrotherDialog } from "@/components/brothers/BrotherDialog";
import { BrothersTable } from "@/components/brothers/BrothersTable";
import { toast } from "sonner";

const Brothers = () => {
  const navigate = useNavigate();
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrother, setSelectedBrother] = useState<Brother | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const menuItems = [
    {
      title: "Irmãos",
      icon: <Users className="h-5 w-5" />,
      onClick: () => navigate("/brothers"),
    },
    {
      title: "Sessões",
      icon: <CalendarDays className="h-5 w-5" />,
      onClick: () => navigate("/sessions"),
    },
    {
      title: "Presenças",
      icon: <UserCheck className="h-5 w-5" />,
      onClick: () => navigate("/attendance"),
    },
    {
      title: "Tesouraria",
      icon: <DollarSign className="h-5 w-5" />,
      onClick: () => navigate("/treasury"),
    },
  ];

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
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      toast.success('Irmão removido com sucesso');
      fetchBrothers();
    } catch (error) {
      console.error('Error deleting brother:', error);
      toast.error('Erro ao remover irmão');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
              alt="ULC 114 Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-serif text-primary">ULC 114</h1>
          </div>
          
          <div className="flex items-center space-x-2 ml-8">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant={item.title === "Irmãos" ? "default" : "ghost"}
                className="flex items-center gap-2"
                onClick={item.onClick}
              >
                {item.icon}
                {item.title}
              </Button>
            ))}
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <BrotherDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            selectedBrother={selectedBrother}
            onSubmit={handleSubmit}
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando...
          </div>
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
    </div>
  );
};

export default Brothers;
