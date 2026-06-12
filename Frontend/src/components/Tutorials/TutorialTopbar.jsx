import React from "react";
import { Search, Bell, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/GlobalAuthContext";

const TutorialTopbar = () => {
  const { toggleMobileMenu } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight hidden sm:block">Tutorials</h1>
      </div>

      <div className="flex-1 max-w-md px-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tutorials..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-full focus:outline-none focus:border-border focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="border-border/60" />

        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground hidden sm:flex">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </Button>

        <div className="flex items-center gap-3 ml-2 border-l pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name || "Student"}</p>
            <p className="text-xs text-muted-foreground mt-1">Profile & Settings</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-sm border border-primary/20">
            {(user?.name || "S")[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TutorialTopbar;
