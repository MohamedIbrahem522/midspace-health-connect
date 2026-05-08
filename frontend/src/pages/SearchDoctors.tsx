import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Stethoscope, Star, ChevronRight, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { specializations, locations } from "@/data/mockData";
import api from "@/services/api";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital?: string;
  location?: string;
  isVerified: boolean;
  yearsOfExperience: number;
  consultationFee?: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

export default function SearchDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.specialty?.toLowerCase().includes(q) || d.hospital?.toLowerCase().includes(q);
  });

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Find Doctors</h1>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} doctors</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-5">
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input placeholder="Search by name, specialty, or hospital..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl" />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} custom={i} initial="hidden" animate="visible" variants={fadeInUp} layout
              className="group rounded-xl border bg-card p-4 md:p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/doctors/${doc.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {doc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{doc.name}</h3>
                        {doc.isVerified && <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {doc.specialty} · {doc.yearsOfExperience} years exp.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    {doc.hospital && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {doc.hospital}</span>}
                    {doc.consultationFee != null && <span className="flex items-center gap-1">{doc.consultationFee} EGP / visit</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Search className="h-7 w-7 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-muted-foreground">No doctors found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
