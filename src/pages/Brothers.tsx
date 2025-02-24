
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Brother } from "@/types/brother";
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
import { format } from "date-fns";
import { toast } from "sonner";

const Brothers = () => {
  const navigate = useNavigate();
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Irmãos</h1>
        </div>
        <Button onClick={() => console.log('Add new brother')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Irmão
        </Button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : brothers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum irmão cadastrado
        </div>
      ) : (
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
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Brothers;
