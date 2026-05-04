import { useState } from "react";
import { mockJobs } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Users, Eye, Link2, PauseCircle, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

export default function ManageJobs() {
  const [jobs, setJobs] = useState(mockJobs.map(j => ({ ...j, active: true })));

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
    toast({ title: "Job deleted", description: "The listing has been removed." });
  };

  const toggleActive = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, active: !j.active } : j));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <h1 className="font-semibold">Manage Jobs</h1>
          <span className="text-xs text-muted-foreground ml-auto">{jobs.length} listings</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: jobs.length, color: "text-foreground" },
            { label: "Active", value: jobs.filter(j => j.active).length, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Paused", value: jobs.filter(j => !j.active).length, color: "text-amber-600 dark:text-amber-400" },
            { label: "Total Applicants", value: jobs.reduce((sum, j) => sum + j.applicants, 0), color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Job List */}
        <div className="space-y-2.5">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className={`group rounded-xl border bg-card p-4 transition-all duration-200 ${
                job.active ? "hover:border-primary/30 hover:shadow-sm" : "opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                  job.active ? "bg-primary/10" : "bg-muted"
                }`}>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{job.title}</h3>
                        <Badge variant="outline" className={`text-xs ${
                          job.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {job.active ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.specialization}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {job.applicants} applicants</span>
                    <span className="text-muted-foreground/60">{job.posted}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(job.id)}
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    title={job.active ? "Pause" : "Activate"}
                  >
                    {job.active
                      ? <PauseCircle className="h-4 w-4 text-muted-foreground" />
                      : <PlayCircle className="h-4 w-4 text-emerald-600" />
                    }
                  </button>
                  <button
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    onClick={() => toast({ title: "Edit mode", description: "Editing coming soon." })}
                  >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    onClick={() => toast({ title: "Link copied", description: "Share link copied to clipboard." })}
                  >
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Eye className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-muted-foreground">No active job listings</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">Create your first job posting to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
