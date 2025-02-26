
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
    icon: <Users className="h-8 w-8" />,
    path: "/brothers",
  },
  {
    title: "Sessões",
    description: "Agendar e gerenciar sessões",
    icon: <CalendarDays className="h-8 w-8" />,
    path: "/sessions",
  },
  {
    title: "Presenças",
    description: "Controlar presenças nas sessões",
    icon: <UserCheck className="h-8 w-8" />,
    path: "/attendance",
  },
  {
    title: "Tesouraria",
    description: "Gerenciar pagamentos de mensalidades",
    icon: <DollarSign className="h-8 w-8" />,
    path: "/treasury",
  },
  {
    title: "Enquetes",
    description: "Gerenciar e participar de votações",
    icon: <Vote className="h-8 w-8" />,
    path: "/polls",
  },
];

export function DashboardCards() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {menuItems.map((item) => (
        <Card
          key={item.title}
          className="hover:bg-accent transition-colors cursor-pointer active:scale-95"
          onClick={() => navigate(item.path)}
        >
          <CardHeader>
            <div className="flex items-center space-x-4">
              {item.icon}
              <div>
                <CardTitle className="text-base md:text-lg">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
