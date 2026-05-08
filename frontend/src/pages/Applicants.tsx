import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Briefcase, Clock, Eye, MessageSquare, FileText } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";

interface Applicant {
  id: number;
  doctorName: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Pending" | "Accepted" | "Rejected">("all");

  const fetchApplicants = async () => {
    try {
      const res = await api.get("/jobs/applications");
      setApplicants(res.data);
    } catch {
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplicants(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/jobs/0/applications/${id}/status`, { status });
      setApplicants(applicants.map((a) => a.id === id ? { ...a, status } : a));
    } catch {}
  };

  const filtered = filter === "all" ? applicants : applicants.filter(a => a.status === filter);
  const counts = {
    all: applicants.length,
    Pending: applicants.filter(a => a.status === "Pending").length,
    Accepted: applicants.filter(a => a.status === "Accepted").length,
    Rejected: applicants.filter(a => a.status === "Rejected").length,
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Applicants</h1>
          <span className="text-xs text-muted-foreground ml-auto">{counts.all} total</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-5">
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-5 overflow-x-auto">
          {(["all", "Pending", "Accepted", "Rejected"] as const).map((tab) => {
            const Icon = tab === "Pending" ? Clock : tab === "Accepted" ? Check : tab === "Rejected" ? X : null;
            return (
              <button key={tab} onClick={() => setFilter(tab)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filter === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {tab === "all" ? "All" : tab}
                <span className="text-muted-foreground/70">({counts[tab]})</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2.5">
          {filtered.map((a, i) => (
            <motion.div key={a.id} custom={i} initial="hidden" animate="visible" variants={fadeInUp} layout className="group rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {a.doctorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm">{a.doctorName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.jobTitle}</p>
                    </div>
                    {a.status !== "Pending" && (
                      <Badge variant="outline" className={`text-xs shrink-0 ${a.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {a.status}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {a.jobTitle}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(a.appliedAt).toLocaleDateString()}</span>
                  </div>

                  {a.status === "Pending" && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="h-8 text-xs gap-1" onClick={() => updateStatus(a.id, "Accepted")}>
                        <Check className="h-3.5 w-3.5" /> Accept
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1 text-destructive hover:bg-destructive/10" onClick={() => updateStatus(a.id, "Rejected")}>
                        <X className="h-3.5 w-3.5" /> Reject
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
            <h3 className="font-medium text-muted-foreground">No {filter === "all" ? "" : filter.toLowerCase()} applicants</h3>
          </motion.div>
        )}
      </div>
    </div>
  );
}
