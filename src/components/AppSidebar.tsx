import {
  Stethoscope,
  Building2,
  User,
  LayoutDashboard,
  UserCircle,
  Briefcase,
  MessageSquare,
  PlusCircle,
  ClipboardList,
  UserCheck,
  Search,
  ShieldCheck,
  Users,
  Activity,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
  useSidebar,
} from "@/components/ui/sidebar";

const roleIcon: Record<UserRole, typeof Stethoscope> = {
  doctor: Stethoscope,
  hospital: Building2,
  patient: User,
  admin: ShieldCheck,
};

const roleLabel: Record<UserRole, string> = {
  doctor: "Doctor Portal",
  hospital: "Hospital Portal",
  patient: "Patient Portal",
  admin: "Admin Panel",
};

const roleLinks: Record<UserRole, { to: string; label: string; icon: typeof Stethoscope }[]> = {
  doctor: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "My Profile", icon: UserCircle },
    { to: "/jobs", label: "Job Board", icon: Briefcase },
    { to: "/my-applications", label: "My Applications", icon: ClipboardList },
    { to: "/messages", label: "Messages", icon: MessageSquare },
  ],
  hospital: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/post-job", label: "Post Job", icon: PlusCircle },
    { to: "/manage-jobs", label: "Manage Jobs", icon: ClipboardList },
    { to: "/applicants", label: "Applicants", icon: UserCheck },
    { to: "/doctor-directory", label: "Doctor Directory", icon: Search },
    { to: "/messages", label: "Messages", icon: MessageSquare },
  ],
  patient: [
    { to: "/search-doctors", label: "Find Doctors", icon: Search },
    { to: "/messages", label: "Messages", icon: MessageSquare },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "User Management", icon: Users },
    { to: "/admin/insights", label: "System Insights", icon: Activity },
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
  const Icon = roleIcon[user.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Stethoscope className="h-4 w-4" />
              </div>
              {!collapsed && <span className="text-lg font-bold text-foreground">MidSpace</span>}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Icon className="mr-2 h-4 w-4" />
            {!collapsed && roleLabel[user.role]}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                  >
                    <NavLink
                      to={item.to}
                      end
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => { logout(); navigate("/"); }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
