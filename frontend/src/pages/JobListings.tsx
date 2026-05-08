import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, DollarSign, Search, Briefcase, Clock, Filter, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
  }),
};

const typeColors: Record<string, string> = {
  "Full-time": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700",
  "Part-time": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700",
  "Remote": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-700",
  "Contract": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-700",
};

interface Job {
  id: number;
  title: string;
  description: string;
  specialty: string;
  location?: string;
  salary?: string;
  employmentType: string;
  hospitalName: string;
  createdAt: string;
}

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.hospitalName.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleApply = async (jobId: number, title: string, hospital: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`, { coverLetter: "" });
      toast({ title: "Application submitted!", description: `You applied for ${title} at ${hospital}.` });
    } catch {
      toast({ title: "Error", description: "Login as a Doctor to apply." });
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">Jobs</h1>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            {filtered.length} opportunities
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-5">

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 mb-5"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder="Search by title, hospital, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/60"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl shrink-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 p-4 rounded-xl border bg-card"
            >
              <div className="w-full text-xs font-medium text-muted-foreground mb-1">Specialization</div>
            {["All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Surgery", "Radiology"].map((s) => (
              <button
                key={s}
                onClick={() => setSearch(s === "All" ? "" : s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${search === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
              >
                {s}
              </button>
            ))}

            <div className="w-full text-xs font-medium text-muted-foreground mt-3 mb-1">Type</div>
            {["all", "Full-time", "Part-time", "Remote", "Contract"].map((t) => (
              <button
                key={t}
                onClick={() => {}}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-border hover:bg-secondary`}
              >
                  {t === "all" ? "All Types" : t}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Job Cards */}
        <motion.div layout className="grid gap-3">
          {filtered.map((job, i) => {
            const isSaved = saved.has(job.id);
            return (
              <motion.div
                key={job.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                layout
                className="group rounded-xl border bg-card p-4 md:p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{job.hospitalName}</p>
                      </div>
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`shrink-0 h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${isSaved ? "border-amber-300 bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:border-amber-700" : "border-border hover:bg-secondary"}`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-muted-foreground">
                      {job.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>}
                      {job.salary && <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> {job.salary}</span>}
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">{job.specialty}</Badge>
                      <Badge variant="outline" className={`text-xs ${typeColors[job.employmentType] || ""}`}>{job.employmentType}</Badge>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      className="h-9 text-xs gap-1.5"
                      onClick={() => handleApply(job.id, job.title, job.hospitalName)}
                    >
                      Apply Now <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Search className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-muted-foreground">No jobs found</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
