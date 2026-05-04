import { useState } from "react";
import { mockApplicants } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Briefcase, Clock, Eye, MessageSquare, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

export default function Applicants() {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setApplicants(applicants.map((a) => a.id === id ? { ...a, status } : a));
    toast({
      title: status === "accepted" ? "Applicant accepted" : "Applicant rejected",
      description: status === "accepted" ? "Notification sent to the applicant." : "Applicant has been notified.",
    });
  };

  const filtered = filter === "all" ? applicants : applicants.filter(a => a.status === filter);
  const counts = {
    all: applicants.length,
    pending: applicants.filter(a => a.status === "pending").length,
    accepted: applicants.filter(a => a.status === "accepted").length,
    rejected: applicants.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Applicants</h1>
          <span className="text-xs text-muted-foreground ml-auto">{counts.all} total</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-5">
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-5 overflow-x-auto">
          {(["all", "pending", "accepted", "rejected"] as const).map((tab) => {
            const icon = tab === "pending" ? Clock : tab === "accepted" ? Check : tab === "rejected" ? X : null;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  filter === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {icon && <icon className="h-3.5 w-3.5" />}
                {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="text-muted-foreground/70">({counts[tab]})</span>
              </button>
            );
          })}
        </div>

        {/* Applicant Cards */}
        <div className="space-y-2.5">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              layout
              className="group rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm">{a.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.specialization} · {a.experience} years exp.</p>
                    </div>
                    {a.status !== "pending" && (
                      <Badge variant="outline" className={`text-xs shrink-0 ${
                        a.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-700/50"
                      }`}>
                        {a.status === "accepted" ? "Accepted" : "Rejected"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {a.jobTitle}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.appliedDate}</span>
                  </div>

                  {/* Actions for pending */}
                  {a.status === "pending" && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="h-8 text-xs gap-1" onClick={() => updateStatus(a.id, "accepted")}>
                        <Check className="h-3.5 w-3.5" /> Accept
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1 text-destructive hover:bg-destructive/10" onClick={() => updateStatus(a.id, "rejected")}>
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <Eye className="h-3.5 w-3.5" /> View Profile
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> Message
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <FileText className="h-3.5 w-3.5" /> CV
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-muted-foreground">No {filter === "all" ? "" : filter} applicants</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {filter === "all" ? "Applicants will appear here once they apply" : `No ${filter} applicants yet`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
