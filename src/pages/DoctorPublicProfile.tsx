import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Star, Briefcase, Building2, GraduationCap,
  Award, MessageSquare, Share2, Mail, Phone, Clock,
  HeartPulse, CheckCircle2, ArrowLeft, Edit, Eye,
  Calendar, Users, TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DoctorPublicProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const doctor = {
    name: user.name,
    specialization: "Cardiology",
    degree: "MD - Harvard Medical School",
    location: "Cairo, Egypt",
    workplace: "Cairo Medical Center",
    experience: "12",
    rating: "4.9",
    reviews: 87,
    bio: `Board-certified cardiologist with over 12 years of experience in interventional cardiology and heart failure management. Dedicated to providing patient-centered care and staying at the forefront of cardiovascular medicine.

Specializing in complex coronary interventions, structural heart procedures, and advanced heart failure therapies. Active researcher with multiple publications in peer-reviewed journals.

Committed to medical education and mentoring the next generation of cardiologists.`,
    education: [
      { degree: "MD - Doctor of Medicine", school: "Harvard Medical School", year: "2012" },
      { degree: "Residency - Internal Medicine", school: "Massachusetts General Hospital", year: "2015" },
      { degree: "Fellowship - Cardiology", school: "Johns Hopkins Hospital", year: "2018" },
    ],
    certifications: [
      "Board Certified - American Board of Internal Medicine",
      "Board Certified - Cardiovascular Disease",
      "Advanced Cardiac Life Support (ACLS)",
    ],
    skills: ["Interventional Cardiology", "Heart Failure", "Echocardiography", "Coronary Angioplasty", "Cardiac Catheterization", "Electrophysiology"],
    stats: { profileViews: 1247, connections: 342, posts: 28, patients: 890 },
    availability: { days: "Sun - Thu", hours: "9:00 AM - 4:00 PM", accepting: true },
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Top bar */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">{doctor.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <Link to="/profile">
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Profile Header */}
          <motion.div variants={fadeInUp} className="rounded-xl border bg-card overflow-hidden mb-4">
            {/* Cover */}
            <div className="h-32 md:h-44 bg-gradient-to-r from-primary/30 via-primary/15 to-cyan-400/20 relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-15" />
            </div>

            {/* Info */}
            <div className="px-5 md:px-6 pb-5 -mt-16 relative">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-28 w-28 md:h-32 md:w-32 rounded-xl border-4 border-background bg-primary/10 flex items-center justify-center text-3xl md:text-4xl font-bold text-primary">
                    {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 pt-14 md:pt-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold">{doctor.name}</h1>
                        <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <p className="text-base md:text-lg text-primary font-medium mt-0.5">{doctor.specialization}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{doctor.degree}</p>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {doctor.location}</span>
                        <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {doctor.workplace}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {doctor.experience} years</span>
                        <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {doctor.rating} ({doctor.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
                {[
                  { label: "Profile views", value: doctor.stats.profileViews, icon: Eye },
                  { label: "Connections", value: doctor.stats.connections, icon: Users },
                  { label: "Patients", value: doctor.stats.patients, icon: HeartPulse },
                  { label: "Posts", value: doctor.stats.posts, icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">{stat.value.toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-4">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-4">

              {/* About */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-base mb-3">About</h2>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {doctor.bio}
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Experience
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{doctor.workplace}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{doctor.experience}+ years · Full-time</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Education */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </h2>
                <div className="space-y-4">
                  {doctor.education.map((edu) => (
                    <div key={edu.degree} className="flex gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">{edu.school}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Certifications
                </h2>
                <ul className="space-y-2.5">
                  {doctor.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{cert}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Skills */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-primary" />
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Contact */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-sm mb-3">Contact</h2>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+20 123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Availability
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-medium">{doctor.availability.days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hours</span>
                    <span className="font-medium">{doctor.availability.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {doctor.availability.accepting ? "Accepting new patients" : "Currently full"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={fadeInUp} className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold text-sm mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full h-9 text-xs gap-2 justify-start" asChild>
                    <Link to="/jobs">
                      <Briefcase className="h-3.5 w-3.5" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-9 text-xs gap-2 justify-start" asChild>
                    <Link to="/messages">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Messages
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-9 text-xs gap-2 justify-start" asChild>
                    <Link to="/my-applications">
                      <Calendar className="h-3.5 w-3.5" />
                      My Applications
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
