import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Building2,
  HeartPulse,
  ArrowRight,
  Shield,
  MapPin,
  Sun,
  Moon,
  CheckCircle2,
  UserPlus,
  TrendingUp,
  Star,
  Users2,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useRef, useState, useEffect } from "react";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
    >
      {theme === "light" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
    </motion.button>
  );
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ""));
    const hasPlus = target.includes("+");
    const hasPercent = target.includes("%");
    const hasComma = target.includes(",");
    let current = 0;
    const step = Math.ceil(num / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= num) {
        current = num;
        clearInterval(interval);
      }
      let formatted = current.toString();
      if (hasComma) formatted = current.toLocaleString();
      if (hasPlus) formatted += "+";
      if (hasPercent) formatted += "%";
      setDisplay(formatted);
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, target]);

  return <span ref={ref}>{display}</span>;
}

export default function Landing() {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30"
      >
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Stethoscope className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">MidSpace</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { label: "Find Doctors", href: "/search-doctors" },
              { label: "Sign in", href: "/login" },
            ].map((link) => (
              <Link
                to={link.href}
                key={link.label}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" className="ml-1 h-9 text-sm bg-primary hover:bg-primary/90 shadow-sm" asChild>
                <Link to="/register">
                  Get started
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link to="/login">
                <span className="sr-only">Sign in</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-16 md:py-24 overflow-hidden">

        {/* Floating gradient orbs - continuous subtle animation */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="float-slow absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl opacity-60" />
          <div className="float-medium absolute top-10 right-10 h-56 w-56 rounded-full bg-cyan-400/8 blur-3xl opacity-40" />
          <div className="float-slow absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-primary/6 blur-3xl opacity-30" style={{ animationDelay: "-7s" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto max-w-6xl px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  Verified Healthcare Network
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-5 text-4xl md:text-5xl font-bold leading-tight"
              >
                Welcome to your
                <br />
                <span className="text-gradient">professional network</span>
                <br />
                for healthcare.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-base text-muted-foreground leading-relaxed"
              >
                Connect with verified doctors, find opportunities at leading hospitals,
                and grow your healthcare career. All in one trusted platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 h-12 px-4 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button className="h-12 text-sm font-medium flex-1 bg-primary hover:bg-primary/90" asChild>
                    <Link to="/register">
                      Get started
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex items-center gap-4 text-xs text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Verified only
                </span>
                <span className="flex items-center gap-1.5">
                  <Users2 className="h-3.5 w-3.5 text-primary" />
                  60,000+ members
                </span>
              </motion.div>
            </div>

            {/* Right - Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden border border-border shadow-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=700&h=500&fit=crop"
                  alt="Healthcare professional"
                  className="w-full h-[400px] object-cover"
                />
              </motion.div>

              {/* Floating card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute -bottom-4 -left-4 md:-left-8 bg-card rounded-xl p-4 shadow-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">+127 this week</p>
                    <p className="text-xs text-muted-foreground">Doctors joined</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-7 w-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
                        <Stethoscope className="h-3 w-3 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">10K+ doctors</p>
                    <p className="text-[10px] text-muted-foreground">Verified</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Verified Doctors" },
              { value: "500+", label: "Partner Hospitals" },
              { value: "50,000+", label: "Active Patients" },
              { value: "98%", label: "Match Success Rate" },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    <AnimatedCounter target={s.value} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Who we serve</h2>
              <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
                A platform designed for every healthcare professional.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Stethoscope,
                title: "For Doctors",
                desc: "Build your verified profile, browse curated job listings, and connect directly with hospitals.",
                bullets: ["Verified credentials", "Job application tracker", "Direct hospital outreach"],
                img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=250&fit=crop",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Building2,
                title: "For Hospitals",
                desc: "Post open positions, review qualified applicants, and hire top medical talent.",
                bullets: ["Unlimited postings", "Smart filtering", "Built-in messaging"],
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop",
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-950/30",
              },
              {
                icon: HeartPulse,
                title: "For Patients",
                desc: "Search verified doctors by specialty, read reviews, and book consultations.",
                bullets: ["Verified profiles", "Specialty search", "Secure booking"],
                img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-950/30",
              },
            ].map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-xl border bg-card overflow-hidden card-hover"
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <div className={`h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-base">{card.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{card.desc}</p>

                    <ul className="mt-3 space-y-2">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-muted-foreground">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Why professionals trust us</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Manual verification", desc: "Every credential reviewed by our medical board." },
              { icon: TrendingUp, title: "Fast connections", desc: "Average match time: under 48 hours." },
              { icon: MapPin, title: "Nationwide reach", desc: "Covering all 27 governorates across Egypt." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3"
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-base">{item.title}</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">What our members say</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Dr. Sara Hassan",
                role: "Cardiologist",
                text: "Found my current position at a top hospital within two weeks. The verification process gave hospitals confidence in my profile.",
                img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
                rating: 5,
              },
              {
                name: "Cairo Medical Center",
                role: "HR Department",
                text: "We filled three specialist roles in a month. The applicant quality is significantly higher than other platforms.",
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop",
                rating: 5,
              },
              {
                name: "Ahmed Khaled",
                role: "Patient",
                text: "Booking a consultation with a verified specialist used to take days. Now I can find the right doctor in minutes.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                rating: 5,
              },
            ].map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-xl border bg-card p-5 card-hover"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2.5 pt-3 border-t border-border/50">
                    <img src={t.img} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.005 }}
              className="rounded-xl border border-border bg-card p-8 md:p-12 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to get started?
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Join thousands of healthcare professionals already using MidSpace.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="h-10 text-sm bg-primary hover:bg-primary/90" asChild>
                    <Link to="/register">
                      Join now
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </motion.div>
                <Button variant="outline" className="h-10 text-sm" asChild>
                  <Link to="/search-doctors">Browse doctors</Link>
                </Button>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                <Stethoscope className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-semibold">MidSpace</span>
              <span className="text-xs text-muted-foreground ml-1">© 2026</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <Link to="/search-doctors" className="hover:text-foreground transition-colors">Find Doctors</Link>
              <Link to="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
              <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
