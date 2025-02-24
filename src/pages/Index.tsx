
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="page-header">ULC 114 Dashboard</h1>
      <button 
        onClick={() => supabase.auth.signOut()} 
        className="absolute top-4 right-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Index;
