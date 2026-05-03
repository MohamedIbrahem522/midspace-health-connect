import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Building2,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Star,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ─── Animation variants ──────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

// ─── Static data ─────────────────────────────────────────────────────
const features = [
  {
    icon: Stethoscope,
    title: "For Doctors",
    desc: "Build a verified profile, browse curated job listings, and connect directly with hospitals and patients.",
    bullets: ["Verified credentials badge", "Direct hospital outreach", "Job application tracker"],
    color: "bg-primary/8 text-primary",
  },
  {
    icon: Building2,
    title: "For Hospitals",
    desc: "Post open positions, review qualified applicants, and hire top medical talent — all in one place.",
    bullets: ["Unlimited job postings", "Smart applicant filtering", "Direct messaging"],
    color: "bg-secondary/8 text-secondary",
  },
  {
    icon: Users,
    title: "For Patients",
    desc: "Search verified doctors by specialty, read real reviews, and book consultations with confidence.",
    bullets: ["Verified doctor profiles", "Specialty search & filters", "Secure consultation booking"],
    color: "bg-accent-foreground/8 text-accent-foreground",
  },
];

const stats = [
  { value: 10000, display: "10,000+", label: "Registered Doctors",   suffix: "+" },
  { value: 500,   display: "500+",    label: "Partner Hospitals",     suffix: "+" },
  { value: 50000, display: "50,000+", label: "Active Patients",       suffix: "+" },
  { value: 98,    display: "98%",     label: "Satisfaction Rate",     suffix: "%" },
];

const values = [
  {
    icon: Shield,
    title: "Trusted & Verified",
    desc: "Every professional on MidSpace goes through a manual verification process before appearing publicly.",
  },
  {
    icon: Zap,
    title: "Instant Connections",
    desc: "Our matching engine connects doctors with the right hospitals and patients within seconds.",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    desc: "A growing network spanning every governorate — find or offer care wherever you are.",
  },
];

const testimonials = [
  {
    name: "Dr. Sara Hassan",
    role: "Cardiologist",
    text: "Found my current position at a top hospital within two weeks of joining MidSpace.",
    rating: 5,
  },
  {
    name: "Cairo Medical Center",
    role: "HR Department",
    text: "We filled three specialist roles in a month. The applicant quality is significantly higher than other platforms.",
    rating: 5,
  },
  {
    name: "Ahmed Khaled",
    role: "Patient",
    text: "Booking a consultation with a verified specialist used to take days. Now it takes minutes.",
    rating: 5,
  },
];

// ─── Animated counter hook ───────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ stat, started }: { stat: typeof stats[0]; started: boolean }) {
  const count = useCountUp(stat.value, 1800, started);
  const display =
    stat.suffix === "%"
      ? `${count}%`
      : count >= 1000
      ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k+`
      : `${count}+`;
  return (
    <div className="text-center">
      <p className="tabular-nums text-4xl font-extrabold text-primary">{started ? display : "0"}</p>
      <p className="mt-1.5 text-sm font-medium text-muted-foreground">{stat.label}</p>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────
export default function Landing() {
  const statsRef  = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef,  { once: true, margin: "-80px" });

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 md:pt-32">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-3xl" />

        <div className="container relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            initial="hidden" animate="visible"
            variants={fadeUp} custom={0}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Healthcare Networking Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="mt-7 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            initial="hidden" animate="visible"
            variants={fadeUp} custom={1}
          >
            Connecting{" "}
            <span className="gradient-text">Healthcare</span>
            {" "}Professionals
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            initial="hidden" animate="visible"
            variants={fadeUp} custom={2}
          >
            MidSpace bridges doctors, hospitals, and patients on one verified platform.
            Find jobs, hire talent, or discover the right specialist — all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial="hidden" animate="visible"
            variants={fadeUp} custom={3}
          >
            <Button size="lg" className="gap-2 px-8 shadow-md shadow-primary/20" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link to="/search-doctors">Browse Doctors</Link>
            </Button>
          </motion.div>

          {/* Social proof row */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground"
            initial="hidden" animate="visible"
            variants={fadeUp} custom={4}
          >
            {["No credit card required", "Free for patients", "Verified professionals only"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="border-y bg-card px-4 py-14" ref={statsRef}>
        <div className="container mx-auto grid max-w-4xl grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((s) => (
            <StatCounter key={s.label} stat={s} started={statsInView} />
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center"
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              One Platform
            </span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Built for Every Role</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Whether you're providing care, managing a hospital, or seeking treatment —
              MidSpace has a dedicated experience for you.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border bg-card p-7 transition-all duration-300 card-shadow hover:card-shadow-hover hover:-translate-y-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className={`flex h-13 w-13 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>

                <ul className="mt-5 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-secondary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why MidSpace ─────────────────────────────────────────── */}
      <section className="border-t bg-muted/40 px-4 py-24">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center"
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp}
          >
            <h2 className="text-3xl font-bold">Why Professionals Choose MidSpace</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              We built MidSpace on three principles that make a real difference.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="flex gap-4"
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/10">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{v.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center"
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeUp}
          >
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-2xl border bg-card p-6 card-shadow"
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="relative overflow-hidden rounded-3xl border bg-card p-12 text-center card-shadow-lg"
            initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fadeIn}
          >
            {/* Background glow */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mt-3 text-muted-foreground">
                Join thousands of healthcare professionals already using MidSpace.
                Your account is free and takes under 2 minutes to create.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="gap-2 px-8 shadow-md shadow-primary/20" asChild>
                  <Link to="/register">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/search-doctors">Explore as Guest</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t bg-card px-4 py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
                <Stethoscope className="h-3.5 w-3.5 text-white" />
              </div>
              MidSpace
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/search-doctors" className="link-underline hover:text-foreground transition-colors">Find Doctors</Link>
              <Link to="/register"       className="link-underline hover:text-foreground transition-colors">Sign Up</Link>
              <Link to="/login"          className="link-underline hover:text-foreground transition-colors">Login</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 MidSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}