import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import StatCard from "@/components/StatCard";
import { Navigate } from "react-router-dom";
import {
  Briefcase, MessageSquare, Users, Star,
  FileText, UserCheck, ClipboardList, Activity,
  Stethoscope, PlusCircle, ArrowRight, Clock,
  Sun, Moon, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

interface ActivityItem {
  text: string;
  time: string;
  color: string;
}

interface DashboardData {
  stats: StatItem[];
  activity: ActivityItem[];
  profileCompletion: number;
}

const iconMap: Record<string, React.ElementType> = {
  Applications: Briefcase,
  Messages: MessageSquare,
  "Profile views": Users,
  Rating: Star,
  "Active listings": ClipboardList,
  Applicants: UserCheck,
  Hired: FileText,
  "Available doctors": Users,
  Appointments: ClipboardList,
  "Saved doctors": Star,
  "Total users": Users,
  "Active doctors": Stethoscope,
  "Open jobs": Briefcase,
  "System uptime": Activity,
};

const quickActionsMap = {
  doctor: [
    { icon: Briefcase, label: "Browse jobs", to: "/jobs", desc: "Find opportunities" },
    { icon: MessageSquare, label: "Messages", to: "/messages", desc: "Check your inbox" },
    { icon: ClipboardList, label: "Applications", to: "/my-applications", desc: "Track status" },
    { icon: UserCheck, label: "My profile", to: "/profile", desc: "Update info" },
  ],
  hospital: [
    { icon: PlusCircle, label: "Post a job", to: "/post-job", desc: "Create listing" },
    { icon: ClipboardList, label: "Manage jobs", to: "/manage-jobs", desc: "Review listings" },
    { icon: UserCheck, label: "Applicants", to: "/applicants", desc: "Review candidates" },
    { icon: Users, label: "Directory", to: "/doctor-directory", desc: "Browse doctors" },
  ],
  patient: [
    { icon: Users, label: "Find doctors", to: "/search-doctors", desc: "Search now" },
    { icon: MessageSquare, label: "Messages", to: "/messages", desc: "Chat with doctors" },
  ],
  admin: [
    { icon: Users, label: "Users", to: "/admin/users", desc: "Manage accounts" },
    { icon: Activity, label: "Insights", to: "/admin/insights", desc: "View analytics" },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const roleBadgeMap = {
  doctor: { label: "Doctor", cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  hospital: { label: "Hospital", cls: "border-primary/30 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/15 dark:text-primary" },
  patient: { label: "Patient", cls: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  admin: { label: "Admin", cls: "border-muted-foreground/30 bg-muted/50 text-muted-foreground" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        const mappedStats = res.data.stats.map((s: { title: string; value: string; trend?: string; trendUp?: boolean }) => ({
          title: s.title,
          value: s.value,
          icon: iconMap[s.title] || Briefcase,
          trend: s.trend,
          trendUp: s.trendUp,
        }));
        setDashboardData({
          stats: mappedStats,
          activity: res.data.recentActivity.map((a: { text: string; time: string; color: string }) => ({
            text: a.text,
            time: a.time,
            color: a.color,
          })),
          profileCompletion: res.data.profileCompletion,
        });
      } catch {
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role !== "patient") {
      fetchDashboard();
    }
  }, [user]);

  if (!user) return null;
  if (user.role === "patient") return <Navigate to="/patient/dashboard" replace />;
  if (loading) return <div className="container mx-auto max-w-5xl px-4 py-6 text-center">Loading dashboard...</div>;
  if (!dashboardData) return <div className="container mx-auto max-w-5xl px-4 py-6 text-center text-red-500">Failed to load dashboard</div>;

  const quickActions = quickActionsMap[user.role];
  const firstName = user.name.split(" ")[0];
  const roleBadge = roleBadgeMap[user.role];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="container mx-auto max-w-5xl px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={`text-xs font-medium ${roleBadge.cls}`}>
              {roleBadge.label}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {firstName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            {theme === "light" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
          </button>
          <Button size="sm" variant="outline" className="h-8 text-sm" asChild>
            <Link to="/messages">
              <MessageSquare className="h-4 w-4 mr-1" />
              Inbox
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {dashboardData.stats.map((s) => (
          <motion.div key={s.title} variants={fadeUp}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Main content - LinkedIn style grid */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Activity Feed */}
        <motion.div variants={fadeUp} className="lg:col-span-2 rounded-xl border bg-card">
          <div className="px-5 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent activity</h2>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Updated live
            </span>
          </div>
          <div className="divide-y">
            {dashboardData.activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-card">
            <div className="px-5 py-3 border-b">
              <h2 className="font-semibold text-sm">Quick actions</h2>
            </div>
            <div className="p-3 space-y-1">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <a.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile CTA */}
      {user.role === "doctor" && (
        <motion.div
          variants={fadeUp}
          className="mt-4 rounded-xl border bg-card p-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm">Profile is {dashboardData.profileCompletion}% complete</p>
              <div className="w-full sm:w-56 h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
                <div className={`h-full bg-primary rounded-full`} style={{ width: `${dashboardData.profileCompletion}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Add your credentials for 3x more hospital views
              </p>
            </div>
            <Button size="sm" className="h-8 text-sm bg-primary hover:bg-primary/90 shrink-0" asChild>
              <Link to="/profile">
                Complete <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
