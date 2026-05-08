import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Briefcase, MessageSquare, Eye, Filter, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital?: string;
  bio?: string;
  location?: string;
  yearsOfExperience: number;
  isVerified: boolean;
  consultationFee?: number;
  profileImage?: string;
}

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                        (d.specialty?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Doctor Directory</h1>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} doctors</span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-5">
        {/* Search */}
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border/60"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" disabled>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
                <div className="h-12 w-12 rounded-xl bg-muted" />
                <div className="h-4 w-32 bg-muted rounded mt-3" />
                <div className="h-3 w-24 bg-muted rounded mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="group rounded-xl border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {d.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate">{d.name}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{d.specialty || "General"}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-2">
                  {d.isVerified && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>Verified</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{d.yearsOfExperience} years experience</span>
                  </div>
                  {d.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{d.location}</span>
                    </div>
                  )}
                  {d.hospital && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{d.hospital}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-border/50 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5" asChild>
                    <Link to={`/doctors/${d.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                  </Button>
                  <Button size="sm" className="h-8 text-xs gap-1.5" asChild>
                    <Link to={`/doctors/${d.id}/contact`}>
                      <MessageSquare className="h-3.5 w-3.5" />
                      Contact
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Search className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-muted-foreground">No doctors found</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
