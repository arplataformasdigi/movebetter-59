
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Calendar,
  Users,
  Book,
  Play,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Activity,
    href: "/",
  },
  {
    title: "Pacientes",
    icon: Users,
    href: "/pacientes",
  },
  {
    title: "Planos",
    icon: Book,
    href: "/planos",
  },
  {
    title: "Exercícios",
    icon: Play,
    href: "/exercicios",
  },
  {
    title: "Calendário",
    icon: Calendar,
    href: "/calendario",
  },
  {
    title: "Mensagens",
    icon: MessageCircle,
    href: "/mensagens",
  }
];

export function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Menu</h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
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
