
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Brother } from "@/types/brother";
import { Poll } from "@/types/poll";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { OpenPolls } from "@/components/dashboard/OpenPolls";
import BirthdayList from "@/components/brothers/BirthdayList";
import { Card, CardContent } from "@/components/ui/card";

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
        relatives: (brother.relatives || []).map((relative: any) => ({
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto py-4 px-3 md:py-8 md:px-8">
        <DashboardCards />

        <div className="grid gap-4 md:gap-6 mt-4 md:mt-8 grid-cols-1 md:grid-cols-3">
          <RecentActivities />
          
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <BirthdayList brothers={brothers} />
            </CardContent>
          </Card>

          <OpenPolls polls={openPolls} />
        </div>
      </main>
    </div>
  );
};

export default Index;
