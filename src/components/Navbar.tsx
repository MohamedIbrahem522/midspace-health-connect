import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Stethoscope, Building2, User } from "lucide-react";
import { useState } from "react";

const roleIcon = {
  doctor: Stethoscope,
  hospital: Building2,
  patient: User,
};

const roleLinks = {
  doctor: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    { to: "/jobs", label: "Jobs" },
    { to: "/messages", label: "Messages" },
  ],
  hospital: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/post-job", label: "Post Job" },
    { to: "/manage-jobs", label: "Manage Jobs" },
    { to: "/applicants", label: "Applicants" },
  ],
  patient: [
    { to: "/search-doctors", label: "Find Doctors" },
    { to: "/messages", label: "Messages" },
  ],
};

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? roleLinks[user.role] : [];
  const Icon = user ? roleIcon[user.role] : null;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Stethoscope className="h-4 w-4 text-primary-foreground" />
          </div>
          MidSpace
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
                {Icon && <Icon className="h-4 w-4 text-primary" />}
                <span className="font-medium">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { logout(); navigate("/"); }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}
                className="mt-2 rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted"
              >
                Log out
              </button>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="ghost" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Log in</Button>
                <Button onClick={() => { navigate("/register"); setMobileOpen(false); }}>Sign up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
