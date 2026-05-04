import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-12 flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="h-7 w-7" />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground/60">MidSpace</span>
            <div className="ml-auto">
              <button
                onClick={toggleTheme}
                className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
