import {
  Stethoscope,
  LayoutDashboard,
  UserCircle,
  Briefcase,
  MessageSquare,
  PlusCircle,
  ClipboardList,
  UserCheck,
  Search,
  Users,
  Activity,
  LogOut,
  HeartPulse,
  Calendar,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const roleLinks: Record<UserRole, { to: string; label: string; icon: typeof Stethoscope }[]> = {
  doctor: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/my-profile", label: "My Profile", icon: UserCircle },
    { to: "/profile", label: "Edit Profile", icon: UserCheck },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/my-applications", label: "Applications", icon: ClipboardList },
    { to: "/messages", label: "Messaging", icon: MessageSquare },
  ],
  hospital: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/post-job", label: "Post Job", icon: PlusCircle },
    { to: "/manage-jobs", label: "Manage Jobs", icon: ClipboardList },
    { to: "/applicants", label: "Applicants", icon: UserCheck },
    { to: "/doctor-directory", label: "Directory", icon: Search },
    { to: "/messages", label: "Messaging", icon: MessageSquare },
  ],
  patient: [
    { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/search-doctors", label: "Find Doctors", icon: Search },
    { to: "/patient/appointments", label: "Appointments", icon: Calendar },
    { to: "/patient/profile", label: "My Health", icon: HeartPulse },
    { to: "/messages", label: "Messages", icon: MessageSquare },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/insights", label: "Insights", icon: Activity },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const links = roleLinks[user.role];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          {!collapsed && <span className="text-base font-semibold text-foreground">MidSpace</span>}
        </div>
      </SidebarHeader>

      <Separator className="opacity-20" />

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {links.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`h-9 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                      }`}
                    >
                      <NavLink to={item.to} end>
                        <item.icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                        {!collapsed && <span className="text-[13px]">{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator className="opacity-20" />

      <SidebarFooter className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-sidebar-border/30">
            <AvatarFallback className="text-xs bg-primary/20 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground/60">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/50 hover:text-foreground"
                onClick={() => { logout(); navigate("/"); }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
