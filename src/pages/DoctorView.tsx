import { useParams, Link } from "react-router-dom";
import { mockDoctors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Briefcase,
  Building2,
  ArrowLeft,
  MessageSquare,
  Heart,
  Share2,
  Clock,
  GraduationCap,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorView() {
  const { id } = useParams();
  const doctor = mockDoctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-7 w-7" />
        </div>
        <h3 className="font-semibold text-lg">Doctor not found</h3>
        <Link to="/search-doctors" className="text-sm text-primary hover:underline mt-2 inline-block">
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4"
      >
        <Link
          to="/search-doctors"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border bg-card overflow-hidden"
      >
        {/* Cover */}
        <div className="h-28 md:h-36 bg-gradient-to-r from-primary/20 via-primary/10 to-cyan-400/20 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        {/* Profile info */}
        <div className="px-5 pb-5 -mt-14 relative">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-xl border-4 border-background bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-14 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">{doctor.name}</h1>
                    <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-base text-primary font-medium mt-0.5">{doctor.specialization}</p>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {doctor.location}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {doctor.workplace}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {doctor.experience} years</span>
                    <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {doctor.rating}/5.0</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="h-9 text-sm bg-primary hover:bg-primary/90" asChild>
                      <Link to={`/contact/${doctor.id}`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 rounded-xl border bg-card p-5"
      >
        <h2 className="font-semibold text-base flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-primary" />
          About
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
      </motion.div>

      {/* Details Grid */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-5"
        >
          <h2 className="font-semibold text-base flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-primary" />
            Experience
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{doctor.workplace}</p>
                <p className="text-xs text-muted-foreground">Current</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{doctor.experience}+ years</p>
                <p className="text-xs text-muted-foreground">Total experience</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-5"
        >
          <h2 className="font-semibold text-base flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-primary" />
            Education
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Medical Degree</p>
                <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Board Certified</p>
                <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Availability */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 rounded-xl border bg-card p-5"
      >
        <h2 className="font-semibold text-base mb-3">Availability</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Mon-Fri", "9:00 AM", "5:00 PM", "Accepting new patients"].map((info, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">{info}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
