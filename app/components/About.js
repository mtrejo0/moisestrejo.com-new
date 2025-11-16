"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Dumbbell, Copy, Star, ArrowRight, Mail, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import EmailSignupResend from "../components/EmailSignupResend";
import externalApps from "../../public/information/externalApps.json";
/**
 * Drop this file in your Next.js app as `app/page.jsx` (or `pages/index.js`).
 * Tailwind + Framer Motion + lucide-react. No external data calls.
 * Focuses your site around products (Pushup Counter + BeActive) with clear CTAs,
 * credibility strip, and an email capture. Clean, fast, and conversion-oriented.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Hero />
      <Products />
      {/* <EmailCapture /> */}
      {/* <Contact /> */}
      {/* <PlaygroundLinks /> */}
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 pb-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight"
          >
            Built by <span className="text-blue-600">Moises</span>.
          </motion.h1>
          <p className="mt-4 text-lg text-slate-600">
            I make things.
            <br></br>
            Instacart SWE 2, MIT 2022, Prod, Ex-Twitter, Ex-Facebook.
          </p>
        </div>
      </div>
    </section>
  );
}


function Products() {
  // Filter apps that have product_hunt or product_hunt_embed
  const productHuntApps = externalApps
    .filter(app => app.product_hunt || app.product_hunt_embed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-2xl font-extrabold">Products</h2>
        </div>
        <Link
          href="/products"
          className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productHuntApps.map((app) => (
          <ProductHuntCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}


function ProductHuntCard({ app }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900">{app.name}</h3>
        <a
          href={app.link}
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 hover:text-slate-600"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{app.description}</p>
      {app.product_hunt_embed && (
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: app.product_hunt_embed }}
        />
      )}
      {!app.product_hunt_embed && app.product_hunt && (
        <a
          href={app.product_hunt}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-700 mt-2"
        >
          View on Product Hunt <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </motion.article>
  );
}

function EmailCapture() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-extrabold">Get updates on new drops</h3>
          <p className="mt-2 text-slate-600 text-sm mb-4">
            Occasional emails when I ship new features or apps. No spam, unsubscribe anytime.
          </p>
          
          <EmailSignupResend/>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <MiniCard title="Habit Building" copy="Build habits with daily counters and gentle nudges." />
          <MiniCard title="Group challenges" copy="Weekly events that keep friends accountable." />
          <MiniCard title="Privacy-first" copy="Local processing where possible. Minimal data stored." />
          <MiniCard title="Fast shipping" copy="I iterate in public and ship often." />
        </div>
      </div>
    </section>
  );
}

function MiniCard({ title, copy }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
      <div className="font-semibold">{title}</div>
      <p className="text-slate-600 text-xs mt-1">{copy}</p>
    </div>
  );
}

function Contact() {
  const email = "contact[at]moisestrejo.com";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email.replace("[at]", "@"));
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Questions about products, demos, or just want to chat?
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-slate-100 rounded-lg px-4 py-2 font-mono text-sm flex items-center gap-2">
              <code>{email}</code>
              <button
                onClick={copyToClipboard}
                className="hover:text-blue-600 transition-colors"
                title="Copy email"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaygroundLinks() {
  return (
    <section id="playground" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-xl font-extrabold">Labs & Playground</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Into generative art, music, and random tools? Explore the fun stuff:
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PlayLink href="/products" label="Products" />
        <PlayLink href="/tools" label="Tools" />
        <PlayLink href="/p5art" label="P5.js Art" />
        <PlayLink href="/music" label="Music" />
        <PlayLink href="/resume" label="Resume" />
      </div>
    </section>
  );
}

function PlayLink({ href, label }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md flex items-center justify-between"
    >
      <span className="font-medium">{label}</span>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
    </Link>
  );
}
