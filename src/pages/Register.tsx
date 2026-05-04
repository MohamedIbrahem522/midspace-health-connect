import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Building2, User, ShieldCheck, ArrowRight, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const roles: { value: UserRole; label: string; icon: typeof Stethoscope }[] = [
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "hospital", label: "Hospital", icon: Building2 },
  { value: "patient", label: "Patient", icon: User },
  { value: "admin", label: "Admin", icon: ShieldCheck },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("doctor");
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password, role);
    navigate(role === "patient" ? "/patient/dashboard" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left - Brand */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:w-1/2 lg:bg-primary lg:p-8 lg:text-white lg:relative lg:overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.06]" />

        {/* Floating orbs - continuous subtle animation */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="float-slow absolute -top-10 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="float-medium absolute bottom-20 right-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" style={{ animationDelay: "-5s" }} />
          <div className="float-slow absolute top-1/2 left-1/4 h-40 w-40 rounded-full bg-white/8 blur-2xl" style={{ animationDelay: "-10s" }} />
        </div>

        <div className="relative flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold">MidSpace</span>
        </div>

        <div className="relative max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold leading-tight"
          >
            Start building your healthcare career today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-sm text-white/60 leading-relaxed"
          >
            Join thousands of verified professionals across Egypt. Create your profile in under 2 minutes.
          </motion.p>
        </div>

        <div className="relative flex items-center justify-between">
          <p className="text-xs text-white/40">© 2026 MidSpace</p>
          <button onClick={toggleTheme} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={toggleTheme} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
            {theme === "light" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold">MidSpace</span>
          </Link>

          <div>
            <h2 className="text-2xl font-semibold">Create account</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Join Egypt's healthcare network</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block font-medium">I am a</Label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all ${
                      role === r.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-border/60"
                    }`}
                  >
                    <r.icon className="h-4 w-4" />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs text-muted-foreground mb-1.5 block font-medium">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Sara Hassan"
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-xs text-muted-foreground mb-1.5 block font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-xs text-muted-foreground mb-1.5 block font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-sm bg-primary hover:bg-primary/90 font-medium">
              Join now
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
