
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Calendar,
  Users,
  Book,
  Trophy,
  User,
  Shield,
  CreditCard,
  Smartphone,
  Package,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Activity,
    href: "/",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Pacientes",
    icon: Users,
    href: "/pacientes",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Pacotes",
    icon: Package,
    href: "/pacotes",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Aplicativo",
    icon: Smartphone,
    href: "/aplicativo",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Planos",
    icon: Book,
    href: "/planos",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Calendário",
    icon: Calendar,
    href: "/calendario",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    href: "/financeiro",
    roles: ["admin", "manager", "professional"],
  },
  {
    title: "Ranking",
    icon: Trophy,
    href: "/ranking",
    roles: ["admin", "manager", "professional"],
  },
  // Novas opções de menu para perfil
  {
    title: "Meus Dados",
    icon: User,
    href: "/dados-pessoais",
    roles: ["admin", "manager", "professional", "patient"],
  },
  {
    title: "Acesso",
    icon: Shield,
    href: "/acesso",
    roles: ["admin", "manager", "professional", "patient"],
  },
  {
    title: "Assinatura",
    icon: CreditCard,
    href: "/assinatura",
    roles: ["admin", "manager", "professional"],
  }
];

export function Sidebar() {
  const { user } = useAuth();
  const roleString = user?.role || "";

  // Filtrar itens com base na role do usuário
  const filteredItems = sidebarItems.filter(
    item => item.roles.includes(roleString)
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Menu</h2>
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center py-2 px-4 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-movebetter-light text-movebetter-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="bg-movebetter-light rounded-lg p-4">
          <h4 className="font-medium text-sm text-movebetter-primary">Progresso da Clínica</h4>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-movebetter-primary rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">65% de sessões completadas este mês</p>
        </div>
      </div>
    </div>
  );
}
