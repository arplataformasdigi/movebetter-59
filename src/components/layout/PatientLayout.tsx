
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Calendar, FileText, Home, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Início",
    icon: Home,
    href: "/paciente",
  },
  {
    title: "Planos",
    icon: ListChecks,
    href: "/paciente/planos",
  },
  {
    title: "Agenda",
    icon: Calendar,
    href: "/paciente/agenda",
  },
  {
    title: "Prontuário",
    icon: FileText,
    href: "/paciente/prontuario",
  }
];

interface PatientLayoutProps {
  children: React.ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Logo />
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name || ""} />
                <AvatarFallback className="bg-movebetter-primary text-white">
                  {user?.name ? user.name.charAt(0) : "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
          </div>
        </div>
      </header>
      <div className="flex">
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Menu do Paciente</h2>
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
              <h4 className="font-medium text-sm text-movebetter-primary">Seu progresso</h4>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-movebetter-primary rounded-full" style={{ width: "45%" }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">45% do seu plano de tratamento completo</p>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
