import { Home, Package, Users, FileText, BarChart3, Target, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Package, label: "Insumos", path: "/insumos" },
  { icon: Users, label: "Fornecedores", path: "/fornecedores" },
  { icon: DollarSign, label: "Preços de Ingredientes", path: "/precos-ingredientes" },
  { icon: FileText, label: "Fichas Técnicas", path: "/fichas-tecnicas" },
  { icon: Target, label: "Engenharia de Cardápio", path: "/engenharia-cardapio" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <img src="src/assets/logo.png" alt="Fooder Logo" className="h-8 w-10 text-sidebar-primary" />
        <h1 className="text-xl font-bold text-sidebar-foreground">Fooder</h1>
      </div>

      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
