import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/StatCard";
import {
  Briefcase, MessageSquare, Users, Star,
  FileText, UserCheck, ClipboardList, Activity,
  Stethoscope, PlusCircle, Clock, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// ─── Static data ─────────────────────────────────────────────────────
const doctorStats = [
  { title: "Applications Sent",  value: 8,     icon: Briefcase,     trend: "+2 this week",    trendUp: true  },
  { title: "Unread Messages",    value: 3,      icon: MessageSquare, trend: "12 total",                       },
  { title: "Profile Views",      value: 156,    icon: Users,         trend: "+24% this month", trendUp: true  },
  { title: "Rating",             value: "4.8",  icon: Star,          trend: "Based on 34 reviews"             },
];

const hospitalStats = [
  { title: "Active Listings",    value: 5,   icon: ClipboardList, trend: "2 new this week",  trendUp: true  },
  { title: "Total Applicants",   value: 47,  icon: UserCheck,     trend: "+12 this week",    trendUp: true  },
  { title: "Unread Messages",    value: 5,   icon: MessageSquare, trend: "18 total"                          },
  { title: "Hired This Month",   value: 3,   icon: FileText,      trend: "On track"                         },
];

const patientStats = [
  { title: "Doctors Found",      value: 24,  icon: Users,         trend: "In your area"                     },
  { title: "Upcoming Appts.",    value: 1,   icon: ClipboardList, trend: "3 total"                          },
  { title: "Unread Messages",    value: 1,   icon: MessageSquare, trend: "5 total"                          },
  { title: "Saved Doctors",      value: 8,   icon: Star,                                                    },
];

const adminStats = [
  { title: "Total Users",        value: "12,458", icon: Users,        trend: "+342 this month", trendUp: true },
  { title: "Active Doctors",     value: "3,241",  icon: Stethoscope,  trend: "+86 this week",   trendUp: true },
  { title: "Open Jobs",          value: 189,      icon: Briefcase,    trend: "+23 this week",   trendUp: true },
  { title: "System Uptime",      value: "99.9%",  icon: Activity,     trend: "Last 30 days"                  },
];

const statsMap = {
  doctor:   doctorStats,
  hospital: hospitalStats,
  patient:  patientStats,
  admin:    adminStats,
};

const greetingMap = {
  doctor:   "Doctor Dashboard",
  hospital: "Hospital Dashboard",
  patient:  "Patient Dashboard",
  admin:    "Admin Panel",
};

const quickActionsMap = {
  doctor: [
    { icon: Briefcase,    label: "Browse Jobs",      to: "/jobs",             desc: "Find open positions"     },
    { icon: MessageSquare,label: "Messages",          to: "/messages",         desc: "Check your inbox"        },
    { icon: ClipboardList,label: "My Applications",   to: "/my-applications",  desc: "Track your applications" },
    { icon: UserCheck,    label: "My Profile",        to: "/profile",          desc: "Update your info"        },
  ],
  hospital: [
    { icon: PlusCircle,   label: "Post a Job",        to: "/post-job",         desc: "Create a new listing"    },
    { icon: ClipboardList,label: "Manage Jobs",        to: "/manage-jobs",      desc: "Review active listings"  },
    { icon: UserCheck,    label: "Applicants",         to: "/applicants",       desc: "Review candidates"       },
    { icon: Users,        label: "Doctor Directory",   to: "/doctor-directory", desc: "Browse all doctors"      },
  ],
  patient: [
    { icon: Users,        label: "Find Doctors",       to: "/search-doctors",   desc: "Search by specialty"     },
    { icon: MessageSquare,label: "Messages",            to: "/messages",         desc: "Talk to your doctor"     },
  ],
  admin: [
    { icon: Users,        label: "User Management",    to: "/admin/users",      desc: "Manage all accounts"     },
    { icon: Activity,     label: "System Insights",    to: "/admin/insights",   desc: "Platform analytics"      },
  ],
};

// Placeholder activity — in production replace with useQuery from Supabase
const activityByRole = {
  doctor: [
    { text: "Your application to Cairo Medical was reviewed",  time: "2 hours ago",   dot: "bg-primary"     },
    { text: "New message from Dr. Nour about a referral",      time: "5 hours ago",   dot: "bg-secondary"   },
    { text: "Your profile appeared in 12 searches today",      time: "8 hours ago",   dot: "bg-muted-foreground" },
  ],
  hospital: [
    { text: "3 new applicants for Senior Cardiologist role",   time: "1 hour ago",    dot: "bg-primary"     },
    { text: "Job listing 'Pediatrics Specialist' is expiring", time: "3 hours ago",   dot: "bg-destructive" },
    { text: "Dr. Sara Hassan accepted your message request",   time: "Yesterday",     dot: "bg-secondary"   },
  ],
  patient: [
    { text: "Dr. Ahmed confirmed your consultation request",   time: "Just now",      dot: "bg-secondary"   },
    { text: "Appointment reminder: tomorrow at 10:00 AM",      time: "2 hours ago",   dot: "bg-primary"     },
    { text: "Dr. Nour replied to your message",                time: "Yesterday",     dot: "bg-muted-foreground" },
  ],
  admin: [
    { text: "42 new user registrations today",                 time: "1 hour ago",    dot: "bg-primary"     },
    { text: "System backup completed successfully",            time: "3 hours ago",   dot: "bg-secondary"   },
    { text: "Flagged content report requires review",          time: "5 hours ago",   dot: "bg-destructive" },
  ],
};

// ─── Animation ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Component ───────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const stats        = statsMap[user.role];
  const quickActions = quickActionsMap[user.role];
  const activity     = activityByRole[user.role];

  // First name only — looks friendlier
  const firstName = user.name.split(" ")[0];

  return (
    <div className="page-enter container mx-auto max-w-6xl px-4 py-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        className="mb-8"
        initial="hidden" animate="visible"
        variants={fadeUp} custom={0}
      >
        <p className="text-sm font-medium text-muted-foreground">
          {greetingMap[user.role]}
        </p>
        <h1 className="mt-0.5 text-3xl font-bold tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            initial="hidden" animate="visible"
            variants={fadeUp} custom={i + 1}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── Bottom grid ────────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">

        {/* Recent Activity */}
        <motion.div
          className="rounded-2xl border bg-card p-6 card-shadow"
          initial="hidden" animate="visible"
          variants={fadeUp} custom={stats.length + 1}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Activity</h2>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Live
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {activity.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
              >
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="leading-snug text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="rounded-2xl border bg-card p-6 card-shadow"
          initial="hidden" animate="visible"
          variants={fadeUp} custom={stats.length + 2}
        >
          <h2 className="font-semibold">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex flex-col gap-1.5 rounded-xl border bg-background p-4 text-sm transition-all duration-200 hover:border-primary/30 hover:bg-accent hover:card-shadow"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 transition-colors group-hover:bg-primary/14">
                  <a.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                </div>
                <span className="font-medium text-foreground">{a.label}</span>
                <span className="text-xs text-muted-foreground">{a.desc}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CTA banner (role-specific) ──────────────────────────── */}
      {user.role === "doctor" && (
        <motion.div
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-accent px-6 py-4"
          initial="hidden" animate="visible"
          variants={fadeUp} custom={stats.length + 3}
        >
          <div>
            <p className="font-semibold text-accent-foreground">Your profile is 70% complete</p>
            <p className="mt-0.5 text-sm text-accent-foreground/70">
              Complete your profile to get 3× more views from hospitals.
            </p>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5" asChild>
            <Link to="/profile">
              Complete Profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </motion.div>
      )}

      {user.role === "hospital" && (
        <motion.div
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-accent px-6 py-4"
          initial="hidden" animate="visible"
          variants={fadeUp} custom={stats.length + 3}
        >
          <div>
            <p className="font-semibold text-accent-foreground">You have 47 unreviewed applicants</p>
            <p className="mt-0.5 text-sm text-accent-foreground/70">
              Review candidates before listings expire.
            </p>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5" asChild>
            <Link to="/applicants">
              Review Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}