import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  MessageSquare,
  PhoneCall,
  TrendingUp,
  Users,
  Award,
  ChevronDown,
  Check,
  X,
  HelpCircle,
  Flame,
  Percent,
  Building2,
  Stethoscope,
  Scissors,
  CheckCheck,
  Send,
  ExternalLink,
} from "lucide-react";

import type { AppUser } from "@/lib/auth/use-current-user";

export function LandingPage({
  user,
  onOpenDesk,
}: {
  user?: AppUser | { displayName?: string | null; primaryEmail?: string | null } | null;
  onOpenDesk?: () => void;
}) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive WhatsApp Simulator State
  const [simLang, setSimLang] = useState<"en" | "ur">("ur");
  const [simStatus, setSimStatus] = useState<"pending" | "confirmed" | "cancelled">("pending");

  // Interactive ROI Calculator State
  const [bizType, setBizType] = useState<"dental" | "aesthetic" | "salon" | "consultant">("dental");
  const [dailyBookings, setDailyBookings] = useState(20);
  const [ticketPrice, setTicketPrice] = useState(3500);
  const [noShowRate, setNoShowRate] = useState(25);

  // Calculations
  const workingDays = 26;
  const monthlyTotalSlots = dailyBookings * workingDays;
  const monthlyNoShows = Math.round((monthlyTotalSlots * noShowRate) / 100);
  const monthlyLostPkr = monthlyNoShows * ticketPrice;
  const monthlySavedPkr = Math.round(monthlyLostPkr * 0.85); // 85% recovered
  const subscriptionCost = 3999;
  const netProfitPkr = monthlySavedPkr - subscriptionCost;
  const roiMultiplier = Math.round((monthlySavedPkr / subscriptionCost) * 10) / 10;

  const handleStartTrial = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-bg text-fg selection:bg-accent selection:text-accent-fg">
      {/* 1. Urgency Announcement Top Bar */}
      <div className="relative z-50 bg-gradient-to-r from-accent-dim via-surface to-accent-dim border-b border-accent/20 px-4 py-2.5 text-center text-xs md:text-sm font-medium text-fg">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent border border-accent/30">
            <Flame className="size-3.5 fill-accent" />
            Pakistan Launch Special
          </span>
          <span>
            <strong>50% OFF Lifetime Early Bird Discount</strong> for the first 50 Clinics & Salons!
          </span>
          <button
            onClick={handleStartTrial}
            className="ml-2 inline-flex items-center gap-1 underline underline-offset-4 hover:text-accent transition-colors font-semibold cursor-pointer"
          >
            Claim 7-Day Free Trial <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg/80 border-b border-border/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-emerald-600 text-accent-fg font-bold shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">W</span>
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-400 border-2 border-bg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-fg">WaBook</span>
                <span className="rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider border border-accent/20">
                  Pakistan 🇵🇰
                </span>
              </div>
              <p className="text-[11px] text-muted -mt-0.5">WhatsApp Booking & Reminders</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted">
            <a href="#how-it-works" className="hover:text-fg transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-fg transition-colors">
              WhatsApp Demo
            </a>
            <a href="#calculator" className="hover:text-fg transition-colors">
              ROI Calculator
            </a>
            <a href="#features" className="hover:text-fg transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-fg transition-colors">
              Pricing & Offers
            </a>
            <a href="#faq" className="hover:text-fg transition-colors">
              FAQ
            </a>
          </nav>

          {/* Header Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={onOpenDesk || (() => (window.location.href = "/"))}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-lg shadow-accent/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>My Clinic Desk</span>
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <>
                <a
                  href="/login"
                  className="hidden sm:inline-flex items-center text-sm font-medium text-muted hover:text-fg transition-colors px-3 py-2"
                >
                  Sign In
                </a>
                <button
                  onClick={handleStartTrial}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-accent-fg shadow-lg shadow-accent/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="size-4" />
                  <span>7-Day Free Trial</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 size-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/90 px-3.5 py-1.5 text-xs font-medium text-accent shadow-sm backdrop-blur-md">
                <span className="flex size-2 rounded-full bg-accent animate-ping" />
                <span>#1 WhatsApp Appointment Engine in Pakistan</span>
                <span className="text-muted">•</span>
                <span className="text-fg font-semibold">Zero No-Shows</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-fg leading-[1.12]">
                Stop 85% of Client No-Shows with{" "}
                <span className="bg-gradient-to-r from-accent via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Automated WhatsApp
                </span>{" "}
                Reminders.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Built specifically for <strong>Clinics, Aesthetic Doctors, Dental Centers & Salons in Pakistan</strong>.
                Clients book online from your Instagram or Google link, receive automated WhatsApp reminders in{" "}
                <span className="text-fg font-medium">English & Roman Urdu</span>, and confirm with 1 tap.
              </p>

              {/* Offer Callout Box */}
              <div className="rounded-2xl border border-accent/25 bg-gradient-to-br from-surface to-elevated p-4 sm:p-5 text-left shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded-md bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                        7-DAY FREE TRIAL
                      </span>
                      <span className="text-xs text-muted">No credit card required</span>
                    </div>
                    <p className="text-sm font-semibold text-fg">
                      Get 50% Lifetime Early Bird Discount — Rs 3,999/mo (was Rs 7,999)
                    </p>
                    <p className="text-xs text-muted">
                      Setup takes 2 minutes. Includes automated reminders, custom link & staff calendar.
                    </p>
                  </div>
                  <button
                    onClick={handleStartTrial}
                    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-accent" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-accent" />
                  <span>2-minute instant setup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-accent" />
                  <span>Official Meta WhatsApp Cloud API</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-accent" />
                  <span>JazzCash, EasyPaisa & Raast</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase: Interactive Live WhatsApp Simulator */}
            <div className="lg:col-span-5 relative" id="demo">
              <div className="relative mx-auto max-w-[380px] rounded-[36px] border-4 border-border/80 bg-surface shadow-2xl shadow-accent/10 p-4 overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="mx-auto mb-3 h-4 w-28 rounded-full bg-border/60 flex items-center justify-center">
                  <div className="size-2 rounded-full bg-border" />
                </div>

                {/* WhatsApp Chat Header */}
                <div className="rounded-2xl bg-[#075e54] text-white p-3 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">
                      🏥
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-300 border border-[#075e54]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs leading-none">Apex Dental & Aesthetic</span>
                        <CheckCheck className="size-3 text-sky-300" />
                      </div>
                      <p className="text-[10px] text-emerald-200 mt-0.5">Official WhatsApp Business</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSimLang(simLang === "ur" ? "en" : "ur")}
                      className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold hover:bg-white/30 transition-colors cursor-pointer"
                      title="Toggle Language"
                    >
                      {simLang === "ur" ? "Roman Urdu 🇵🇰" : "English 🇬🇧"}
                    </button>
                  </div>
                </div>

                {/* WhatsApp Chat Stream */}
                <div className="my-3 space-y-2.5 min-h-[300px] text-[12px] leading-relaxed p-1">
                  {/* Timestamp */}
                  <div className="text-center">
                    <span className="rounded-md bg-elevated px-2 py-0.5 text-[10px] text-muted">
                      Today • Automated Bot
                    </span>
                  </div>

                  {/* Outbound WhatsApp Reminder Bubble */}
                  <div className="rounded-2xl rounded-tl-sm bg-[#1e2a24] border border-accent/20 p-3 shadow-sm text-fg">
                    <p className="font-bold text-accent text-[11px] mb-1 flex items-center gap-1">
                      <Sparkles className="size-3" />
                      APPOINTMENT REMINDER
                    </p>
                    {simLang === "ur" ? (
                      <>
                        <p>
                          Assalam-o-Alaikum <strong>Sarah Khan</strong>!
                        </p>
                        <p className="mt-1 text-muted">
                          Aapki appointment <strong>Teeth Whitening & Scaling</strong> kal{" "}
                          <strong className="text-fg">4:30 PM</strong> par scheduled hai with{" "}
                          <strong>Dr. Daniyal</strong>.
                        </p>
                        <div className="my-2 rounded-lg bg-surface/80 p-2 border border-border text-[11px] space-y-0.5">
                          <p className="text-muted">
                            📍 <strong>Location:</strong> Gulberg III, Lahore
                          </p>
                          <p className="text-muted">
                            💵 <strong>Fee:</strong> Rs 4,500
                          </p>
                        </div>
                        <p className="text-accent font-semibold text-[11px]">
                          👉 Confirm karne ke liye <strong>YES</strong> reply karein, ya cancel karne ke liye{" "}
                          <strong>NO</strong> likhein.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Dear <strong>Sarah Khan</strong>,
                        </p>
                        <p className="mt-1 text-muted">
                          Your appointment for <strong>Teeth Whitening & Scaling</strong> with{" "}
                          <strong>Dr. Daniyal</strong> is scheduled for tomorrow at{" "}
                          <strong className="text-fg">4:30 PM</strong>.
                        </p>
                        <div className="my-2 rounded-lg bg-surface/80 p-2 border border-border text-[11px] space-y-0.5">
                          <p className="text-muted">
                            📍 <strong>Clinic:</strong> Gulberg III, Lahore
                          </p>
                          <p className="text-muted">
                            💵 <strong>Service Fee:</strong> Rs 4,500
                          </p>
                        </div>
                        <p className="text-accent font-semibold text-[11px]">
                          👉 Reply <strong>YES</strong> to confirm, or <strong>NO</strong> to cancel.
                        </p>
                      </>
                    )}
                    <span className="mt-1 block text-right text-[9px] text-muted">10:00 AM • Delivered</span>
                  </div>

                  {/* Client Inbound Reply Simulation */}
                  {simStatus !== "pending" && (
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-sm bg-[#054740] p-2.5 text-white max-w-[80%] shadow-sm">
                        <p className="font-bold text-xs">{simStatus === "confirmed" ? "YES" : "NO"}</p>
                        <span className="block text-right text-[9px] text-emerald-200 mt-0.5 flex items-center justify-end gap-0.5">
                          10:02 AM <CheckCheck className="size-3 text-sky-300" />
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bot Live Reaction */}
                  {simStatus === "confirmed" && (
                    <div className="rounded-2xl rounded-tl-sm bg-[#1e2a24] border border-accent/30 p-2.5 text-fg text-[11px]">
                      <p className="text-accent font-semibold">
                        ✅ {simLang === "ur" ? "Zabardast! Aapki seat confirm ho chuki hai. Kal milte hain!" : "Thank you! Your appointment is 100% confirmed. See you tomorrow!"}
                      </p>
                    </div>
                  )}

                  {simStatus === "cancelled" && (
                    <div className="rounded-2xl rounded-tl-sm bg-[#2a1e1e] border border-danger/30 p-2.5 text-fg text-[11px]">
                      <p className="text-danger font-semibold">
                        ❌ {simLang === "ur" ? "Aapki appointment cancel kardi gayi hai. Dobara book karne ke liye link par click karein." : "Your slot has been cancelled. Feel free to rebook anytime."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Interactive Simulator Controller */}
                <div className="border-t border-border pt-3 space-y-2">
                  <p className="text-[10px] text-center text-muted font-medium">
                    Test the bot live! Click a button below:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSimStatus("confirmed")}
                      className={`rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${
                        simStatus === "confirmed"
                          ? "bg-accent text-accent-fg shadow-md shadow-accent/20"
                          : "bg-surface border border-accent/40 text-accent hover:bg-accent/10"
                      }`}
                    >
                      Client Replies "YES" ✅
                    </button>
                    <button
                      onClick={() => setSimStatus("cancelled")}
                      className={`rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${
                        simStatus === "cancelled"
                          ? "bg-danger text-white shadow-md shadow-danger/20"
                          : "bg-surface border border-danger/40 text-danger hover:bg-danger/10"
                      }`}
                    >
                      Client Replies "NO" ❌
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted px-1">
                    <span>
                      Live Calendar Status:{" "}
                      <strong className={simStatus === "confirmed" ? "text-accent" : simStatus === "cancelled" ? "text-danger" : "text-warn"}>
                        {simStatus.toUpperCase()}
                      </strong>
                    </span>
                    <button
                      onClick={() => setSimStatus("pending")}
                      className="underline hover:text-fg cursor-pointer"
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Metric Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 rounded-2xl border border-accent/30 bg-surface/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-accent/20 text-accent">
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-accent">85% Fewer</p>
                    <p className="text-xs text-muted">No-Shows within 1st week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 5. Pain Points vs The WaBook Solution */}
      <section className="py-20 md:py-28" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20">
              Why Traditional Booking Fails in Pakistan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
              Manual WhatsApp & Phone Calls Are Costing You Lakhs Every Month.
            </h2>
            <p className="text-base text-muted">
              Pakistani clients don't check emails or pick up unknown numbers. They live on WhatsApp.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="rounded-3xl border border-danger/30 bg-surface/50 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-1.5">
                  <X className="size-4" /> The Old, Stressful Way
                </span>
                <span className="text-xs text-muted">Manual chaos</span>
              </div>
              <h3 className="text-xl font-bold text-fg">Calling Patients & Manual WhatsApp Coordination</h3>
              <ul className="space-y-3.5 text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-danger shrink-0 mt-0.5" />
                  <span>
                    <strong>Receptionist calls patients:</strong> 60% of patients are in meetings, driving, or ignore unknown calls.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-danger shrink-0 mt-0.5" />
                  <span>
                    <strong>Numbers get banned:</strong> Copy-pasting 50 reminders from a personal phone triggers WhatsApp spam bans.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-danger shrink-0 mt-0.5" />
                  <span>
                    <strong>Empty Doctor / Stylist Chairs:</strong> Patient forgets, doctor sits idle, and you lose Rs 10,000–50,000 in daily revenue.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-danger shrink-0 mt-0.5" />
                  <span>
                    <strong>Foreign Software in USD:</strong> Calendly or Fresha cost $50–$150/mo, don't send WhatsApp reminders in Roman Urdu, and reject local debit cards.
                  </span>
                </li>
              </ul>
            </div>

            {/* The WaBook Way */}
            <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-surface to-elevated p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 size-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <Check className="size-4" /> The WaBook Automated System
                </span>
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                  98% Open Rate
                </span>
              </div>
              <h3 className="text-xl font-bold text-fg">Automated WhatsApp Reminders via Official Meta Cloud API</h3>
              <ul className="space-y-3.5 text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>1-Tap Public Booking Link:</strong> Put <code>wabook.cloud/book/your-clinic</code> in your Instagram Bio and Google Maps profile.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>Automated Bilingual Reminders:</strong> Sent 24h & 2h before the appointment in clean English or friendly Roman Urdu.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant YES / NO Confirmation:</strong> Patient replies "YES" and your calendar turns green. If they reply "NO", the slot opens for walk-ins.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>Pakistani Friendly:</strong> Affordable PKR pricing, JazzCash, EasyPaisa, Raast, and local WhatsApp support.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive ROI / No-Show Revenue Loss Calculator */}
      <section className="py-16 md:py-24 bg-surface/30 border-y border-border" id="calculator">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20">
              Interactive ROI Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
              How Much Money Is Your Business Losing to No-Shows?
            </h2>
            <p className="text-sm sm:text-base text-muted">
              Slide the bars to match your clinic or salon numbers and see your direct monthly savings with WaBook.
            </p>
          </div>

          <div className="mt-12 max-w-4xl mx-auto rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-2xl">
            {/* Business Type Quick Selector */}
            <div className="mb-8">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 block">
                Select Your Business Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "dental", label: "Dental Clinic", fee: 3500 },
                  { id: "aesthetic", label: "Aesthetic / Skin", fee: 6000 },
                  { id: "salon", label: "Salon & Spa", fee: 2500 },
                  { id: "consultant", label: "Doctor / Wellness", fee: 4000 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setBizType(item.id as typeof bizType);
                      setTicketPrice(item.fee);
                    }}
                    className={`rounded-xl py-2.5 px-3 text-xs font-semibold transition-all cursor-pointer border ${
                      bizType === item.id
                        ? "bg-accent/20 border-accent text-accent shadow-sm"
                        : "bg-elevated border-border text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Sliders on Left */}
              <div className="space-y-6">
                {/* Slider 1: Daily Appointments */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Daily Appointments Scheduled</span>
                    <span className="font-bold text-fg">{dailyBookings} clients/day</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={1}
                    value={dailyBookings}
                    onChange={(e) => setDailyBookings(Number(e.target.value))}
                    className="w-full accent-accent h-2 bg-elevated rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted">
                    <span>5 / day</span>
                    <span>30 / day</span>
                    <span>60 / day</span>
                  </div>
                </div>

                {/* Slider 2: Average Fee */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Average Consultation / Service Fee</span>
                    <span className="font-bold text-accent">Rs {ticketPrice.toLocaleString("en-PK")}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={25000}
                    step={500}
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full accent-accent h-2 bg-elevated rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted">
                    <span>Rs 1,000</span>
                    <span>Rs 12,500</span>
                    <span>Rs 25,000</span>
                  </div>
                </div>

                {/* Slider 3: Current No-Show Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Estimated Current No-Show Rate</span>
                    <span className="font-bold text-danger">{noShowRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={noShowRate}
                    onChange={(e) => setNoShowRate(Number(e.target.value))}
                    className="w-full accent-danger h-2 bg-elevated rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted">
                    <span>10% (Low)</span>
                    <span>25% (Average in Pakistan)</span>
                    <span>50% (High)</span>
                  </div>
                </div>
              </div>

              {/* Calculator Results Card */}
              <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-elevated to-surface p-6 space-y-5 shadow-xl text-center">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted font-medium">
                    Estimated Monthly Revenue Lost
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-danger line-through opacity-80 mt-1">
                    Rs {monthlyLostPkr.toLocaleString("en-PK")}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    ({monthlyNoShows} missed slots every month)
                  </p>
                </div>

                <div className="border-t border-border/80 pt-4">
                  <p className="text-xs uppercase tracking-wider text-accent font-bold flex items-center justify-center gap-1">
                    <Sparkles className="size-3.5" />
                    Revenue Recovered with WaBook (85%)
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-accent mt-1">
                    Rs {monthlySavedPkr.toLocaleString("en-PK")}{" "}
                    <span className="text-sm font-medium text-fg">/month</span>
                  </p>
                </div>

                <div className="rounded-xl bg-surface p-3 text-xs space-y-1 border border-border">
                  <div className="flex justify-between text-muted">
                    <span>WaBook Early Bird Fee:</span>
                    <span className="font-semibold text-fg">Rs {subscriptionCost.toLocaleString("en-PK")}/mo</span>
                  </div>
                  <div className="flex justify-between text-accent font-bold">
                    <span>Net Monthly Profit Saved:</span>
                    <span>+Rs {netProfitPkr.toLocaleString("en-PK")}</span>
                  </div>
                  <div className="flex justify-between text-muted text-[11px] pt-1 border-t border-border">
                    <span>Expected ROI:</span>
                    <span className="text-accent font-bold">{roiMultiplier}x Return on Investment</span>
                  </div>
                </div>

                <button
                  onClick={handleStartTrial}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/20 hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>Recover My Revenue — Free 7 Days</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Key Features Designed for Pakistan */}
      <section className="py-20 md:py-28" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20">
              Complete Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
              Everything Your Clinic or Salon Needs to Run on Autopilot.
            </h2>
            <p className="text-base text-muted">
              Built from scratch for Pakistani healthcare providers, beauty salons, and appointment studios.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors">
              <div className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <MessageSquare className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-fg">Bilingual WhatsApp Reminders</h3>
              <p className="text-sm text-muted leading-relaxed">
                Send professional messages in English or friendly Roman Urdu. Pakistani clients understand and respond immediately.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors">
              <div className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <ExternalLink className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-fg">Instagram & Google Maps Link</h3>
              <p className="text-sm text-muted leading-relaxed">
                Add <code>wabook.cloud/book/your-clinic</code> to your Instagram bio, Google Maps, and Facebook ads. Patients book 24/7.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors">
              <div className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <Zap className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-fg">1-Tap YES / NO Confirmation</h3>
              <p className="text-sm text-muted leading-relaxed">
                Patients reply "YES" to confirm or "NO" to cancel. Your dashboard calendar updates instantly without a single receptionist call.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors">
              <div className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <Users className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-fg">Multi-Doctor & Multi-Staff Rosters</h3>
              <p className="text-sm text-muted leading-relaxed">
                Manage multiple doctors, aesthetic practitioners, stylist chairs, and cabin hours with custom time buffers between appointments.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors">
              <div className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-fg">Official Meta Cloud API</h3>
              <p className="text-sm text-muted leading-relaxed">
                100% compliant with WhatsApp terms. No third-party scrapers, zero risk of getting your phone number permanently banned.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors">
              <div className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <Award className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-fg">Zero App Download for Clients</h3>
              <p className="text-sm text-muted leading-relaxed">
                Clients do not need to download any app, create accounts, or remember passwords. Everything runs through their native WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 9. Pricing Section & Early Bird Discount Offer */}
      <section className="py-20 md:py-28 relative" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold text-accent border border-accent/30">
              <Percent className="size-3.5" />
              <span>LIMITED EARLY BIRD OFFER • 50% OFF LIFETIME</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-fg">
              Transparent Pakistani Pricing. No Hidden Surprises.
            </h2>
            <p className="text-base text-muted">
              Start with a <strong>7-Day Free Trial</strong> today. Lock in 50% early bird discount forever. No credit card required.
            </p>

            {/* Billing Period Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-fg" : "text-muted"}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-elevated transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block size-6 transform rounded-full bg-accent shadow-lg ring-0 transition duration-200 ease-in-out ${
                    billingPeriod === "annual" ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-fg" : "text-muted"}`}>
                <span>Annual Billing</span>
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                  2 MONTHS FREE
                </span>
              </span>
            </div>
          </div>

          <div className="mt-14 grid lg:grid-cols-2 max-w-4xl mx-auto gap-8">
            {/* Plan 1: Starter Clinic / Solo Studio */}
            <div className="rounded-3xl border border-border bg-surface p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-fg">Solo Clinic / Studio</h3>
                  <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-muted font-medium">
                    1 Doctor / Stylist
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Perfect for individual doctors, dentists, single-chair salons, or private consultants.
                </p>

                {/* Price */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted line-through">
                      Rs {billingPeriod === "monthly" ? "7,999" : "79,990"}
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-fg">
                      Rs {billingPeriod === "monthly" ? "3,999" : "39,990"}
                    </span>
                    <span className="text-sm text-muted font-medium">
                      /{billingPeriod === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <span className="inline-block mt-1 text-xs font-semibold text-accent">
                    50% Early Bird Discount applied
                  </span>
                </div>

                <div className="border-t border-border pt-5 space-y-3 text-sm text-muted">
                  <p className="font-semibold text-xs uppercase tracking-wider text-fg">What's included:</p>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Unlimited Online Bookings</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Automated WhatsApp Reminders (24h & 2h)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Bilingual: Roman Urdu & English templates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Custom public booking link for Instagram bio</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>1-Tap YES / NO patient confirmation</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>JazzCash & EasyPaisa invoice notes</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleStartTrial}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-bold text-accent hover:bg-accent hover:text-accent-fg transition-all cursor-pointer"
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="size-4" />
                </button>
                <p className="text-center text-[11px] text-muted mt-2">No credit card needed • Cancel anytime</p>
              </div>
            </div>

            {/* Plan 2: Multi-Doctor Clinic / Salon Pro (Popular) */}
            <div className="rounded-3xl border-2 border-accent bg-gradient-to-b from-surface via-surface to-elevated p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-fg shadow-md">
                MOST POPULAR IN PAKISTAN
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-fg">Multi-Doctor & Salon Pro</h3>
                  <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs text-accent font-semibold">
                    Up to 10 Staff / Chairs
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Designed for aesthetic centers, polyclinics, bridal salons, and multi-specialty practices.
                </p>

                {/* Price */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted line-through">
                      Rs {billingPeriod === "monthly" ? "14,999" : "149,990"}
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-accent">
                      Rs {billingPeriod === "monthly" ? "7,499" : "74,990"}
                    </span>
                    <span className="text-sm text-muted font-medium">
                      /{billingPeriod === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <span className="inline-block mt-1 text-xs font-semibold text-accent">
                    50% Early Bird Discount applied
                  </span>
                </div>

                <div className="border-t border-border pt-5 space-y-3 text-sm text-muted">
                  <p className="font-semibold text-xs uppercase tracking-wider text-fg">Everything in Solo, plus:</p>
                  <div className="flex items-center gap-2.5 text-fg">
                    <Check className="size-4 text-accent shrink-0" />
                    <span><strong>Up to 10 Doctors / Stylists / Chairs</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-fg">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Separate working hours & buffer times per doctor</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-fg">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Custom WhatsApp Business Phone ID integration</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-fg">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Multi-service catalog & custom pricing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-fg">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Daily WhatsApp morning schedule to doctor's phone</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-fg">
                    <Check className="size-4 text-accent shrink-0" />
                    <span>Priority WhatsApp VIP Support from our Lahore team</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleStartTrial}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/25 hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Sparkles className="size-4" />
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="size-4" />
                </button>
                <p className="text-center text-[11px] text-muted mt-2">Instant 2-minute setup • Full feature access</p>
              </div>
            </div>
          </div>

          {/* Payment Methods Banner */}
          <div className="mt-12 max-w-2xl mx-auto rounded-2xl border border-border bg-surface p-4 text-center text-xs text-muted">
            <span className="font-semibold text-fg">Supported Payment Methods:</span> JazzCash, EasyPaisa, Raast Direct, Bank Transfer (Meezan, HBL, Alfalah), Visa & Mastercard.
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions (FAQ) */}
      <section className="py-20 md:py-28 bg-surface/30 border-t border-border" id="faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-3">
            <span className="rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
              Frequently Asked Questions.
            </h2>
            <p className="text-base text-muted">
              Everything you need to know about setting up automated WhatsApp booking for your business in Pakistan.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: "How does the 7-day free trial work?",
                a: "You get full, unrestricted access to all features (automated WhatsApp reminders, custom booking link, multi-staff calendar) for 7 days. You do not need to enter any credit card. If you love it, you can subscribe with JazzCash, EasyPaisa, or Bank Transfer. If not, you won't be charged anything.",
              },
              {
                q: "What is the Early Bird Discount?",
                a: "To celebrate our Pakistan launch, the first 50 verified clinics and salons receive a permanent 50% discount for the lifetime of their account. For Solo it is Rs 3,999/mo (was Rs 7,999) and for Multi-Staff it is Rs 7,499/mo (was Rs 14,999).",
              },
              {
                q: "Do my clients or patients need to install any new app?",
                a: "No! That is the biggest benefit of WaBook. Clients simply tap your link from Instagram, WhatsApp, or Google Maps, choose their slot, and receive all reminders and confirmation prompts in their existing WhatsApp app.",
              },
              {
                q: "Can reminders be sent in Roman Urdu?",
                a: "Yes! WaBook comes pre-configured with culturally tailored Roman Urdu templates (e.g. 'Aapki appointment kal 4:00 PM par scheduled hai. Confirm karne ke liye YES reply karein') as well as standard professional English. You can customize them anytime.",
              },
              {
                q: "Is there any risk of my WhatsApp number being blocked?",
                a: "None. WaBook connects directly through Meta's Official WhatsApp Cloud API with pre-approved Meta utility templates. Unlike unauthorized desktop bots or scraping tools, your number is 100% compliant and protected.",
              },
              {
                q: "How do I pay after the 7-day free trial?",
                a: "We accept JazzCash, EasyPaisa, Raast, Direct Online Bank Transfer (Meezan Bank, HBL, Bank Alfalah), and local Pakistani debit/credit cards.",
              },
              {
                q: "How long does setup take?",
                a: "Literally 2 minutes. Sign in with Google, enter your clinic name, add your working hours and services (e.g., Teeth Scaling, Bridal Makeup, Consultation), and your custom booking link is immediately ready to share.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-fg hover:text-accent transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final High-Conversion Urgency CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-surface via-elevated to-bg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-bold text-accent border border-accent/40">
            <Flame className="size-4" />
            <span>Only 13 Early Bird Discount Spots Remaining</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight">
            Stop Losing Thousands to Empty Slots.
            <br />
            <span className="text-accent">Get Your Clinic Live on WhatsApp Today.</span>
          </h2>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
            Join 150+ dental surgeons, aesthetic specialists, and premier salons across Pakistan saving 3+ hours every day and eliminating no-shows.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartTrial}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-base font-extrabold text-accent-fg shadow-xl shadow-accent/30 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="size-5" />
              <span>Claim 7-Day Free Trial</span>
              <ArrowRight className="size-5" />
            </button>
            <a
              href="https://wa.me/923001234567?text=Hi%20WaBook%2C%20I%20want%20to%20learn%20more%20about%20the%20Early%20Bird%20Offer"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-6 py-4 text-sm font-semibold text-fg hover:bg-elevated transition-colors"
            >
              <PhoneCall className="size-4 text-accent" />
              <span>Chat with Founder on WhatsApp</span>
            </a>
          </div>

          <p className="text-xs text-muted pt-2">
            No credit card required • Instant 2-minute setup • Cancel anytime
          </p>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="border-t border-border bg-bg py-12 text-xs text-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg font-bold text-sm">
              W
            </div>
            <div>
              <p className="font-bold text-fg">WaBook.cloud</p>
              <p className="text-[11px] text-muted">Automated WhatsApp Booking for Pakistan 🇵🇰</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#how-it-works" className="hover:text-fg transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-fg transition-colors">
              WhatsApp Demo
            </a>
            <a href="#calculator" className="hover:text-fg transition-colors">
              ROI Calculator
            </a>
            <a href="#pricing" className="hover:text-fg transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-fg transition-colors">
              FAQ
            </a>
            <a href="/login" className="hover:text-fg transition-colors">
              Clinic Sign In
            </a>
          </div>

          <p className="text-center md:text-right">
            © {new Date().getFullYear()} WaBook. All rights reserved.
            <br />
            Made for Pakistani healthcare & beauty entrepreneurs.
          </p>
        </div>
      </footer>
    </div>
  );
}
