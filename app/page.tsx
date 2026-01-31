"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)] text-slate-800 antialiased overflow-x-hidden selection:bg-[var(--primary)] selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <FAQ />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 pastel-gradient rounded-xl flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white">blur_on</span>
          </div>
          <span className="text-xl font-bold tracking-tight">OPAQUE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a className="hover:text-[var(--primary)] transition-colors" href="#">
            Home
          </a>
          <a
            className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            href="#how-it-works"
          >
            How it Works
          </a>
          <a
            className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            href="#stats"
          >
            Stats
          </a>
          <a
            className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            href="#"
          >
            Docs
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-pink-200 hover:scale-105 transition-all active:scale-95 cursor-pointer">
            Launch App
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center pt-24 hero-mesh overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-48 h-48 mx-auto mb-12"
        >
          <div className="absolute inset-0 bg-[var(--primary)] blur-[60px] opacity-40 animate-pulse"></div>
          <div className="absolute inset-0 bg-[var(--secondary)] blur-[60px] opacity-40 translate-x-12"></div>
          <div className="relative w-full h-full glass rounded-[3rem] flex items-center justify-center border-white/60 shadow-2xl">
            <span className="material-symbols-outlined text-[80px] bg-clip-text text-transparent bg-gradient-to-tr from-pink-400 to-cyan-400">
              encrypted
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
        >
          Trade in the <span className="text-[var(--primary)]">Dark</span>.<br />
          Win in the <span className="text-[var(--secondary)]">Light</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto"
        >
          The first TEE-powered dark pool on Ethereum. Prevent MEV,
          front-running, and toxic order flow with hardware-grade privacy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto bg-[var(--primary)] text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-pink-200 hover:translate-y-[-2px] transition-all cursor-pointer">
            Launch App
          </button>
          <button className="w-full sm:w-auto glass px-10 py-4 rounded-2xl text-lg font-bold border-white/50 hover:bg-white/80 transition-all flex items-center justify-center gap-2 cursor-pointer">
            Read Whitepaper{" "}
            <span className="material-symbols-outlined text-xl">
              description
            </span>
          </button>
        </motion.div>
      </div>
    </header>
  );
}

function Features() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <motion.div
            variants={item}
            className="glass p-10 rounded-[2.5rem] border-red-100/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-100/40 rounded-full blur-3xl transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-red-500 bg-red-50 p-3 rounded-2xl">
                  warning
                </span>
                <h3 className="text-2xl font-bold">Public Mempools</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Toxic MEV Bots",
                  "Front-Running & Sandwiching",
                  "Copy Trading Exploitation",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-red-400 font-bold">
                      close
                    </span>
                    <span className="text-lg text-slate-600 font-medium">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="glass p-10 rounded-[2.5rem] border-cyan-100/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-100/40 rounded-full blur-3xl transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-cyan-500 bg-cyan-50 p-3 rounded-2xl">
                  verified_user
                </span>
                <h3 className="text-2xl font-bold">Opaque Enclave</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Zero MEV Leakage",
                  "Intel SGX Hardware Privacy",
                  "Guaranteed Fair Price Matching",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-cyan-400 font-bold">
                      check
                    </span>
                    <span className="text-lg text-slate-600 font-medium">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 bg-white/30" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold mb-4">
            Confidential Execution
          </h2>
          <p className="text-slate-500 font-medium">
            Seamless privacy in three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          <Step
            icon="signature"
            color="text-[var(--primary)]"
            ring="ring-[var(--primary)]/10"
            title="1. Encrypt & Sign"
            desc="Orders are encrypted locally in your browser. No one—not even Opaque—can see your trade intent."
            delay={0.1}
            connector
          />
          <Step
            icon="view_in_ar"
            color="text-[var(--secondary)]"
            ring="ring-[var(--secondary)]/10"
            title="2. The Black Box TEE"
            desc="Matching happens inside a secure Intel SGX enclave. Data is decrypted, matched, and re-encrypted in milliseconds."
            delay={0.3}
            connector
            connectorRight
          />
          <Step
            icon="account_balance_wallet"
            color="text-purple-400"
            ring="ring-[var(--accent)]/50"
            title="3. On-Chain Settlement"
            desc="Only the final settlement result is broadcasted to Ethereum, ensuring complete trade execution privacy."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  color,
  ring,
  title,
  desc,
  delay,
  connector,
  connectorRight,
}: {
  icon: string;
  color: string;
  ring: string;
  title: string;
  desc: string;
  delay: number;
  connector?: boolean;
  connectorRight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex flex-col items-center text-center relative"
    >
      {connector && !connectorRight && (
        <div className="hidden md:block absolute top-12 -right-1/4 w-1/2 h-0.5 border-t-2 border-dashed border-slate-200"></div>
      )}
      {connectorRight && (
        <div className="hidden md:block absolute top-12 -right-1/4 w-1/2 h-0.5 border-t-2 border-dashed border-slate-200"></div>
      )}

      <div
        className={`w-24 h-24 rounded-full glass flex items-center justify-center mb-6 shadow-xl border-white ring-8 ${ring} transition-transform hover:scale-110`}
      >
        <span className={`material-symbols-outlined text-4xl ${color}`}>
          {icon}
        </span>
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">
        {desc}
      </p>
    </motion.div>
  );
}

function Stats() {
  return (
    <section className="py-20 border-y border-slate-100" id="stats">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-12 mb-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <span className="material-symbols-outlined">developer_board</span>{" "}
            iExec
          </div>
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <span className="material-symbols-outlined">memory</span> Intel SGX
          </div>
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <span className="material-symbols-outlined">api</span> ETHEREUM
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard label="Total Volume" value="$0" delay={0.1} />
          <StatCard label="Privacy Time" value="< 2 Min" delay={0.2} />
          <StatCard
            label="Nodes Active"
            value="64"
            color="text-[var(--secondary)]"
            delay={0.3}
          />
          <StatCard
            label="Fee Savings"
            value="94%"
            color="text-[var(--primary)]"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  color = "",
  delay,
}: {
  label: string;
  value: string;
  color?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass p-6 rounded-2xl text-center hover:shadow-lg transition-shadow"
    >
      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    </motion.div>
  );
}

function FAQ() {
  return (
    <section className="py-24 px-6 bg-white/40">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          <FAQItem
            question="How are node operators prevented from seeing my data?"
            answer="Node operators run our enclave code within Intel SGX hardware. The data is encrypted with a key that is only accessible inside the secure enclave processor itself. Even with root access to the machine, the memory remains unreadable."
          />
          <FAQItem
            question="Are my assets safe in the dark pool?"
            answer="Yes. Assets are held in a non-custodial smart contract on Ethereum. The TEE only provides matching instructions. You retain full control over your private keys and withdrawal capabilities."
          />
          <FAQItem
            question="What is the average settlement time?"
            answer="Matching is near-instant within the enclave. Final settlement on Ethereum typically takes under 2 minutes, depending on network congestion and block finality."
          />
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group glass rounded-2xl overflow-hidden transition-all"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-6 w-full text-left focus:outline-none"
      >
        <span className="font-bold text-lg">{question}</span>
        <span
          className={`material-symbols-outlined transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 text-slate-500 leading-relaxed">{answer}</div>
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="relative pt-32 pb-10 px-6 overflow-hidden mt-10">
      {/* Fluid Wave Animation */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[var(--primary)] opacity-10"
          />
        </svg>
      </div>

      <div className="absolute inset-0 pastel-gradient opacity-10 -z-10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 pastel-gradient rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">
                  blur_on
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">OPAQUE</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6">
              Bringing institutional-grade privacy to the decentralized world.
              Built with passion for a fairer financial future.
            </p>
            <div className="flex gap-4">
              <SocialLink icon="hub" />
              <SocialLink icon="chat" />
              <SocialLink icon="language" />
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6">Protocol</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <FooterLink text="Documentation" />
              <FooterLink text="Whitepaper" />
              <FooterLink text="Security Audit" />
              <FooterLink text="GitHub" />
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Governance</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <FooterLink text="Forum" />
              <FooterLink text="Voting" />
              <FooterLink text="Grants" />
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <p>© 2025 Opaque Protocol. Powered by hardware-grade TEE technology.</p>
          <div className="flex gap-6">
            <a className="hover:text-slate-900" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-slate-900" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: string }) {
  return (
    <a
      className="w-10 h-10 glass rounded-full flex items-center justify-center text-slate-600 hover:text-[var(--primary)] hover:scale-110 transition-all cursor-pointer"
      href="#"
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </a>
  );
}

function FooterLink({ text }: { text: string }) {
  return (
    <li>
      <a className="hover:text-slate-900 transition-colors" href="#">
        {text}
      </a>
    </li>
  );
}
