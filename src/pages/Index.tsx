
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
  Vote,
} from "lucide-react";
import BirthdayList from "@/components/brothers/BirthdayList";
import { Brother, Relative } from "@/types/brother";
import { Poll } from "@/types/poll";

const Index = () => {
  const navigate = useNavigate();
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [openPolls, setOpenPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
    fetchBrothers();
    fetchOpenPolls();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchBrothers = async () => {
    try {
      const { data, error } = await supabase
        .from('brothers')
        .select('*, relatives (*)');
      
      if (error) throw error;
      
      const formattedBrothers: Brother[] = (data || []).map(brother => ({
        id: brother.id,
        name: brother.name,
        email: brother.email,
        degree: brother.degree,
        profession: brother.profession,
        birth_date: brother.birth_date,
        phone: brother.phone,
        higher_degree: brother.higher_degree || undefined,
        relatives: (brother.relatives || []).map((relative: any): Relative => ({
          id: relative.id,
          name: relative.name,
          relationship: relative.relationship,
          birthDate: relative.birth_date
        }))
      }));
      
      setBrothers(formattedBrothers);
    } catch (error) {
      console.error('Error fetching brothers:', error);
    }
  };

  const fetchOpenPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpenPolls(data);
    } catch (error) {
      console.error('Error fetching open polls:', error);
    }
  };

  const menuItems = [
    {
      title: "Irmãos",
      description: "Gerenciar cadastro dos irmãos",
      icon: <Users className="h-8 w-8" />,
      onClick: () => navigate("/brothers"),
    },
    {
      title: "Sessões",
      description: "Agendar e gerenciar sessões",
      icon: <CalendarDays className="h-8 w-8" />,
      onClick: () => navigate("/sessions"),
    },
    {
      title: "Presenças",
      description: "Controlar presenças nas sessões",
      icon: <UserCheck className="h-8 w-8" />,
      onClick: () => navigate("/attendance"),
    },
    {
      title: "Tesouraria",
      description: "Gerenciar pagamentos de mensalidades",
      icon: <DollarSign className="h-8 w-8" />,
      onClick: () => navigate("/treasury"),
    },
    {
      title: "Enquetes",
      description: "Gerenciar e participar de votações",
      icon: <Vote className="h-8 w-8" />,
      onClick: () => navigate("/polls"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
              alt="ULC 114 Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-serif text-primary">ULC 114</h1>
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

      <main className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {menuItems.map((item) => (
            <Card
              key={item.title}
              className="hover:bg-accent transition-colors cursor-pointer"
              onClick={item.onClick}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {item.icon}
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 mt-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <p className="text-muted-foreground">
                  Aqui serão exibidas as atividades recentes da loja.
                </p>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <BirthdayList brothers={brothers} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enquetes Abertas</CardTitle>
              <CardDescription>Votações em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {openPolls.length === 0 ? (
                  <p className="text-muted-foreground">
                    Não há enquetes abertas no momento.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {openPolls.map((poll) => (
                      <div
                        key={poll.id}
                        className="p-4 rounded-lg border cursor-pointer hover:bg-accent"
                        onClick={() => navigate(`/polls/${poll.id}`)}
                      >
                        <h3 className="font-medium">{poll.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {poll.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
