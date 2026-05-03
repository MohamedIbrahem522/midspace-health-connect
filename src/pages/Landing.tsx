import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stethoscope, Building2, Users, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Stethoscope, title: "For Doctors", desc: "Build your profile, find jobs, and connect with hospitals & patients." },
  { icon: Building2, title: "For Hospitals", desc: "Post job listings, manage applicants, and hire top medical talent." },
  { icon: Users, title: "For Patients", desc: "Search verified doctors, read reviews, and book consultations." },
];

const stats = [
  { value: "10,000+", label: "Doctors" },
  { value: "500+", label: "Hospitals" },
  { value: "50,000+", label: "Patients" },
  { value: "98%", label: "Satisfaction" },
];

const values = [
  { icon: Shield, title: "Trusted & Verified", desc: "Every doctor and hospital on our platform is verified." },
  { icon: Zap, title: "Fast Connections", desc: "Get matched with the right professionals instantly." },
  { icon: Globe, title: "Nationwide Network", desc: "Access healthcare talent across the entire country." },
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pt-24">
        <div className="absolute inset-0 gradient-primary opacity-[0.04]" />
        <div className="container relative mx-auto max-w-5xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-primary card-shadow">
              <Stethoscope className="h-4 w-4" /> Healthcare Networking Platform
            </span>
          </motion.div>
          <motion.h1
            className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Connecting{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Healthcare
            </span>{" "}
            Professionals
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            MidSpace bridges doctors, hospitals, and patients on one unified platform. Find jobs, hire talent, or discover the right care — all in one place.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link to="/register">Get Started <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card px-4 py-12">
        <div className="container mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">One Platform, Three Roles</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Whether you're providing care, managing a hospital, or seeking treatment — MidSpace has you covered.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group rounded-2xl border bg-card p-8 card-shadow transition-all hover:card-shadow-hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/50 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">Why MidSpace?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <v.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold">{v.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Ready to Join?</h2>
          <p className="mt-3 text-muted-foreground">Create your free account and start connecting with healthcare professionals today.</p>
          <Button size="lg" className="mt-6 gap-2 px-8" asChild>
            <Link to="/register">Create Account <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Stethoscope className="h-4 w-4" /> MidSpace
          </div>
          <p className="text-sm text-muted-foreground">© 2026 MidSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
