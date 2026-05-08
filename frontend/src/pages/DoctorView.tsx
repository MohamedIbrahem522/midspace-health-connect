import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Star, Briefcase, Building2, ArrowLeft,
  MessageSquare, Heart, Share2, Clock, GraduationCap, Award, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";

interface DoctorDetail {
  id: number;
  userId: number;
  name: string;
  specialty?: string;
  hospital?: string;
  bio?: string;
  location?: string;
  isVerified: boolean;
  yearsOfExperience: number;
  consultationFee?: number;
}

export default function DoctorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        <Briefcase className="h-7 w-7 mx-auto mb-4" />
        <h3 className="font-semibold text-lg">Doctor not found</h3>
        <Link to="/search-doctors" className="text-sm text-primary hover:underline mt-2 inline-block">Back to search</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
        <Link to="/search-doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card overflow-hidden">
        <div className="h-28 md:h-36 bg-gradient-to-r from-primary/20 via-primary/10 to-cyan-400/20 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>
        <div className="px-5 pb-5 -mt-14 relative">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-xl border-4 border-background bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            </div>
            <div className="flex-1 pt-14 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">{doctor.name}</h1>
                    {doctor.isVerified && <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700">Verified</Badge>}
                  </div>
                  {doctor.specialty && <p className="text-base text-primary font-medium mt-0.5">{doctor.specialty}</p>}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    {doctor.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {doctor.location}</span>}
                    {doctor.hospital && <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {doctor.hospital}</span>}
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {doctor.yearsOfExperience} years</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="h-9 text-sm bg-primary hover:bg-primary/90" onClick={() => navigate(`/doctors/${doctor.userId}/contact`)}>
                    <MessageSquare className="h-4 w-4 mr-1" /> Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About */}
      {doctor.bio && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 rounded-xl border bg-card p-5">
          <h2 className="font-semibold text-base flex items-center gap-2 mb-3"><Award className="h-4 w-4 text-primary" /> About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
        </motion.div>
      )}

      {/* Details */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold text-base flex items-center gap-2 mb-3"><Briefcase className="h-4 w-4 text-primary" /> Experience</h2>
          <div className="space-y-3">
            {doctor.hospital && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-primary" /></div>
                <div><p className="text-sm font-medium">{doctor.hospital}</p><p className="text-xs text-muted-foreground">Current</p></div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Clock className="h-4 w-4 text-muted-foreground" /></div>
              <div><p className="text-sm font-medium">{doctor.yearsOfExperience}+ years</p><p className="text-xs text-muted-foreground">Total experience</p></div>
            </div>
          </div>
        </motion.div>
        {doctor.consultationFee != null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold text-base flex items-center gap-2 mb-3"><GraduationCap className="h-4 w-4 text-primary" /> Consultation</h2>
            <p className="text-sm font-medium">{doctor.consultationFee} EGP / visit</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
