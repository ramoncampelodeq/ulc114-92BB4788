
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  Vote,
} from "lucide-react";

const menuItems = [
  {
    title: "Irmãos",
    description: "Gerenciar cadastro dos irmãos",
    icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
    path: "/brothers",
  },
  {
    title: "Sessões",
    description: "Agendar e gerenciar sessões",
    icon: <CalendarDays className="h-6 w-6 md:h-8 md:w-8" />,
    path: "/sessions",
  },
  {
    title: "Presenças",
    description: "Controlar presenças nas sessões",
    icon: <UserCheck className="h-6 w-6 md:h-8 md:w-8" />,
    path: "/attendance",
  },
  {
    title: "Tesouraria",
    description: "Gerenciar pagamentos de mensalidades",
    icon: <DollarSign className="h-6 w-6 md:h-8 md:w-8" />,
    path: "/treasury",
  },
  {
    title: "Enquetes",
    description: "Gerenciar e participar de votações",
    icon: <Vote className="h-6 w-6 md:h-8 md:w-8" />,
    path: "/polls",
  },
];

export function DashboardCards() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {menuItems.map((item) => (
        <Card
          key={item.title}
          className="hover:bg-accent transition-colors cursor-pointer active:scale-95 touch-manipulation"
          onClick={() => navigate(item.path)}
        >
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
