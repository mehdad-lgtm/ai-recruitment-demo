"use client";

import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Calendar, CheckCircle, ChevronRight, Globe, Layers, Sparkles, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-background to-background dark:from-blue-950/20 dark:via-background dark:to-background" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-primary to-indigo-600 rounded-lg shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold font-sans tracking-tight">Salesworks</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 max-w-6xl mx-auto text-center font-sans">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-medium tracking-wide mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            AI-POWERED RECRUITMENT 2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Hiring Reimagined with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-purple-600 animate-gradient-x">
              Intelligent Automation
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Automate screening, scheduling, and communication. Find the perfect candidates faster with our Earth-shattering AI technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-lg bg-background/50 backdrop-blur-sm hover:bg-background/80">
                Watch Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Roles Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left"
        >
          {/* Recruiter Card */}
          <motion.div variants={item}>
            <Link href="/recruiter" className="block group">
              <div className="relative h-full p-8 rounded-3xl bg-white dark:bg-card border border-border/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="h-24 w-24 text-blue-500" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Recruiter Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Manage candidates with global reach. Generate QR codes and track intake analytics in real-time.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Access Portal <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Interviewer Card */}
          <motion.div variants={item}>
            <Link href="/interviewer" className="block group">
              <div className="relative h-full p-8 rounded-3xl bg-white dark:bg-card border border-border/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar className="h-24 w-24 text-orange-500" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-600">
                   <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Interviewer Hub</h3>
                <p className="text-muted-foreground mb-6">
                  Streamlined session management. Get AI-generated briefs and submit feedback instantly.
                </p>
                <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                  Access Hub <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>

           {/* Admin Card */}
           <motion.div variants={item}>
            <Link href="/admin" className="block group">
              <div className="relative h-full p-8 rounded-3xl bg-white dark:bg-card border border-border/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layers className="h-24 w-24 text-purple-500" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Admin Control</h3>
                <p className="text-muted-foreground mb-6">
                  Full system oversight. Configure AI parameters, manage users, and view deep analytics.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                  Access Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
          {[
            { label: "Candidates Processed", value: "10k+", icon: Users },
            { label: "Time Saved", value: "85%", icon: CheckCircle },
            { label: "Interviews Held", value: "500+", icon: Calendar },
            { label: "Active Recruiters", value: "50+", icon: Globe },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-sm"
            >
              <stat.icon className="h-8 w-8 text-primary mb-3 opacity-80" />
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
               <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Salesworks</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Salesworks AI Recruitment. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
