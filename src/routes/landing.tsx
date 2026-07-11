import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/landing")({ component: LandingPage });

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Styles                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body.lp-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8f9fb;
    color: #111827;
    overflow-x: hidden;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes scribbleDraw {
    from { stroke-dashoffset: 600; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes shimmerSlide {
    0%   { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes ping {
    0%,100% { transform: scale(1); opacity:1; }
    60%      { transform: scale(1.8); opacity:0; }
  }
  @keyframes cardIn {
    from { opacity:0; transform: translateY(20px) scale(0.97); }
    to   { opacity:1; transform: translateY(0)    scale(1);    }
  }
  @keyframes blobPulse {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes navIn {
    from { opacity:0; transform:translateY(-16px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Nav ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    transition: background .3s ease, box-shadow .3s ease;
    animation: navIn .45s cubic-bezier(.16,1,.3,1) both;
  }
  .lp-nav.scrolled {
    background: rgba(255,255,255,.95);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 rgba(0,0,0,.06), 0 4px 20px rgba(0,0,0,.04);
  }
  .lp-nav-inner {
    max-width: 1180px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
  }
  .lp-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .lp-logo-icon {
    width:40px; height:40px; border-radius:11px;
    background: linear-gradient(135deg,#f97316,#1e4cc3);
    display:flex; align-items:center; justify-content:center;
    font-size:19px; box-shadow: 0 4px 12px rgba(249,115,22,.3); flex-shrink:0;
  }
  .lp-logo-name  { font-weight:800; font-size:15px; color:#111827; line-height:1.2; }
  .lp-logo-tag   { font-size:11px; color:#6b7280; font-weight:500; }
  .lp-nav-links  { display:flex; gap:28px; list-style:none; }
  .lp-nav-links a{ color:#374151; font-size:14px; font-weight:500; text-decoration:none; transition:color .2s; }
  .lp-nav-links a:hover{ color:#f97316; }
  .lp-nav-btns   { display:flex; gap:10px; align-items:center; }
  .btn-ghost-dark {
    padding:9px 20px; border-radius:9px; font-size:14px; font-weight:600;
    color:#374151; border:1.5px solid #e5e7eb; background:transparent;
    text-decoration:none; transition:all .2s ease; cursor:pointer;
  }
  .btn-ghost-dark:hover { border-color:#f97316; color:#f97316; background:#fff8f5; }
  .btn-orange {
    padding:9px 20px; border-radius:9px; font-size:14px; font-weight:700;
    color:#fff; background:linear-gradient(135deg,#f97316,#ea580c);
    border:none; text-decoration:none; cursor:pointer;
    box-shadow: 0 4px 14px rgba(249,115,22,.3);
    transition: all .2s cubic-bezier(.34,1.56,.64,1);
    display:inline-flex; align-items:center; gap:6px;
  }
  .btn-orange:hover { transform:translateY(-2px) scale(1.03); box-shadow: 0 8px 20px rgba(249,115,22,.4); }
  .btn-orange:active{ transform:scale(.97); }
  .mob-btn { display:none; background:none; border:none; cursor:pointer; padding:4px; }
  .mob-btn span { display:block; width:22px; height:2px; background:#374151; border-radius:2px; margin:5px 0; transition:all .3s; }

  /* ── Mobile drawer ── */
  .mob-drawer {
    display:none; position:fixed; inset:0; z-index:200;
    background:rgba(255,255,255,.98); backdrop-filter:blur(20px);
    flex-direction:column; align-items:center; justify-content:center; gap:28px;
  }
  .mob-drawer.open{ display:flex; }
  .mob-drawer a { font-size:22px; font-weight:700; color:#111827; text-decoration:none; }
  .mob-drawer a:hover{ color:#f97316; }
  .mob-close-btn {
    position:absolute; top:20px; right:20px;
    width:40px; height:40px; border-radius:10px;
    background:#f3f4f6; border:none; cursor:pointer;
    font-size:18px; display:flex; align-items:center; justify-content:center;
  }

  /* ── Hero ── */
  .hero {
    min-height:100vh; display:flex; align-items:center;
    padding:120px 24px 80px; background:#fff; position:relative; overflow:hidden;
  }
  .hero-blob {
    position:absolute; z-index:0; pointer-events:none;
    background:linear-gradient(135deg,rgba(249,115,22,.08),rgba(30,76,195,.08));
    animation: blobPulse 8s ease-in-out infinite;
    filter:blur(60px);
  }
  .hero-blob-1 { width:600px; height:600px; top:-200px; right:-100px; }
  .hero-blob-2 { width:400px; height:400px; bottom:-150px; left:-80px;
    background:linear-gradient(135deg,rgba(30,76,195,.07),rgba(249,115,22,.05)); }
  .hero-inner {
    max-width:1180px; margin:0 auto; position:relative; z-index:2;
    display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; width:100%;
  }

  /* Badge */
  .hero-badge {
    display:inline-flex; align-items:center; gap:7px;
    padding:6px 14px; border-radius:100px;
    background:#fff7ed; border:1.5px solid #fed7aa;
    font-size:12px; font-weight:700; color:#c2410c;
    margin-bottom:18px; animation:fadeUp .5s ease both;
  }
  .badge-star { color:#f97316; }

  /* Hero text */
  .hero-h1 {
    font-size:clamp(34px,4.5vw,56px); font-weight:900; line-height:1.1;
    margin-bottom:18px; animation:fadeUp .55s .05s ease both; color:#0f172a;
  }
  .hero-h1 .orange { color:#f97316; }
  .hero-desc {
    font-size:16px; color:#4b5563; line-height:1.75; max-width:500px;
    animation:fadeUp .55s .1s ease both; margin-bottom:32px;
  }
  .hero-ctas { display:flex; gap:12px; flex-wrap:wrap; animation:fadeUp .55s .15s ease both; }
  .btn-primary-lg {
    display:inline-flex; align-items:center; gap:8px;
    padding:14px 28px; border-radius:12px; font-size:15px; font-weight:700;
    color:#fff; background:linear-gradient(135deg,#f97316,#ea580c);
    border:none; text-decoration:none; cursor:pointer;
    box-shadow:0 6px 20px rgba(249,115,22,.35);
    transition:all .25s cubic-bezier(.34,1.56,.64,1);
  }
  .btn-primary-lg:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 10px 28px rgba(249,115,22,.45); }
  .btn-outline-lg {
    display:inline-flex; align-items:center; gap:8px;
    padding:14px 28px; border-radius:12px; font-size:15px; font-weight:600;
    color:#374151; border:1.5px solid #d1d5db; background:#fff;
    text-decoration:none; cursor:pointer; transition:all .2s ease;
  }
  .btn-outline-lg:hover{ border-color:#f97316; color:#f97316; background:#fff8f5; }

  /* Trust badges */
  .trust-row {
    display:flex; gap:20px; margin-top:28px; flex-wrap:wrap;
    animation:fadeUp .55s .2s ease both;
  }
  .trust-badge {
    display:flex; align-items:center; gap:7px;
    font-size:13px; font-weight:600; color:#374151;
  }
  .trust-icon { font-size:16px; }

  /* Hero right */
  .hero-right {
    position:relative; animation:fadeIn .8s .2s ease both;
  }
  .hero-dashboard-wrap {
    border-radius:20px; overflow:hidden;
    box-shadow: 0 20px 80px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06);
    background:#fff; animation:floatY 6s ease-in-out infinite;
    position:relative; z-index:2;
  }
  .hero-dashboard-img { width:100%; display:block; }
  .hero-cylinder {
    position:absolute; right:-60px; bottom:-40px; z-index:3;
    width:180px; filter:drop-shadow(0 20px 40px rgba(0,0,0,.18));
    animation:floatY 5s 1s ease-in-out infinite;
  }

  /* Floating mini stat cards */
  .hero-mini-card {
    position:absolute; z-index:4;
    background:#fff; border-radius:12px; padding:10px 14px;
    box-shadow:0 8px 32px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.05);
    display:flex; align-items:center; gap:10px;
    font-size:13px; font-weight:600; color:#111827; white-space:nowrap;
    animation:cardIn .6s ease both;
  }
  .mc-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; }
  .mc-label { font-size:10px; color:#9ca3af; font-weight:500; }
  .mc-val   { font-size:14px; font-weight:800; }

  /* Scribble underline */
  .scribble-wrap { display:inline-block; position:relative; }
  .scribble-svg  { position:absolute; bottom:-6px; left:0; right:0; width:100%; height:12px; pointer-events:none; }
  .scribble-path {
    fill:none; stroke-linecap:round; stroke-dasharray:600;
    animation:scribbleDraw 1.5s ease forwards;
  }

  /* Doodle corners */
  .doodle-tl { position:absolute; top:90px; left:16px; opacity:.25; z-index:1; pointer-events:none; }
  .doodle-br { position:absolute; bottom:60px; right:16px; opacity:.15; z-index:1; pointer-events:none; }

  /* ── Marquee strip ── */
  .marquee-strip {
    overflow:hidden; background:#fff; border-top:1px solid #f1f5f9; border-bottom:1px solid #f1f5f9;
    padding:14px 0;
  }
  .marquee-track {
    display:flex; gap:40px; width:max-content;
    animation:marquee 20s linear infinite;
  }
  .mq-item {
    display:flex; align-items:center; gap:8px;
    font-size:13px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:.05em;
    white-space:nowrap;
  }
  .mq-dot { width:4px; height:4px; border-radius:50%; background:#e5e7eb; }

  /* ── Section shell ── */
  .lp-section { padding:88px 24px; }
  .lp-wrap    { max-width:1180px; margin:0 auto; }

  /* Section header */
  .sec-eyebrow {
    display:inline-flex; align-items:center; gap:6px;
    font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
    color:#f97316; margin-bottom:12px;
  }
  .sec-title {
    font-size:clamp(26px,3.5vw,42px); font-weight:900; line-height:1.15;
    color:#0f172a; margin-bottom:14px;
  }
  .sec-desc { font-size:16px; color:#6b7280; line-height:1.7; max-width:560px; }
  .center { text-align:center; }
  .sec-desc.center { margin:0 auto; }

  /* ── Features grid ── */
  .feat-grid {
    display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:52px;
  }
  .feat-card {
    background:#fff; border-radius:18px; padding:28px 24px;
    border:1.5px solid #f1f5f9;
    box-shadow:0 2px 8px rgba(0,0,0,.04);
    transition:all .3s cubic-bezier(.34,1.56,.64,1);
    cursor:default; position:relative; overflow:hidden;
  }
  .feat-card::after {
    content:''; position:absolute; inset:0; border-radius:18px;
    background:linear-gradient(135deg,rgba(249,115,22,.04),rgba(30,76,195,.04));
    opacity:0; transition:opacity .3s;
  }
  .feat-card:hover {
    transform:translateY(-6px);
    border-color:#fed7aa;
    box-shadow:0 16px 48px rgba(0,0,0,.1);
  }
  .feat-card:hover::after { opacity:1; }
  .feat-icon {
    width:50px; height:50px; border-radius:14px;
    display:flex; align-items:center; justify-content:center;
    font-size:24px; margin-bottom:16px; position:relative; z-index:1;
  }
  .feat-title { font-size:16px; font-weight:800; margin-bottom:8px; color:#0f172a; position:relative; z-index:1; }
  .feat-desc  { font-size:14px; color:#6b7280; line-height:1.65; position:relative; z-index:1; }

  /* ── Feature icon row (bottom bar reference style) ── */
  .feat-bar {
    display:flex; gap:0; background:#fff; border-radius:20px; overflow:hidden;
    border:1.5px solid #f1f5f9; box-shadow:0 2px 16px rgba(0,0,0,.05);
    margin-top:52px; flex-wrap:wrap;
  }
  .feat-bar-item {
    flex:1; min-width:160px; padding:24px 20px; text-align:center;
    border-right:1.5px solid #f1f5f9; transition:background .2s;
    position:relative;
  }
  .feat-bar-item:last-child { border-right:none; }
  .feat-bar-item:hover { background:#fff8f5; }
  .feat-bar-item:hover .fbi-icon { transform:scale(1.15); }
  .fbi-icon { font-size:28px; margin-bottom:10px; display:block; transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
  .fbi-title { font-size:13px; font-weight:700; color:#0f172a; margin-bottom:4px; }
  .fbi-sub   { font-size:12px; color:#9ca3af; }

  /* ── App preview section ── */
  .preview-section {
    background:linear-gradient(160deg,#0f172a 0%,#1e2d5e 100%);
    padding:88px 24px; position:relative; overflow:hidden;
  }
  .preview-blob {
    position:absolute; pointer-events:none;
    background:radial-gradient(circle,rgba(249,115,22,.15),transparent 70%);
    border-radius:50%; z-index:0;
  }
  .preview-blob-1 { width:600px; height:600px; top:-200px; right:-100px; }
  .preview-blob-2 { width:400px; height:400px; bottom:-150px; left:-100px;
    background:radial-gradient(circle,rgba(30,76,195,.2),transparent 70%); }
  .preview-inner {
    max-width:1180px; margin:0 auto; position:relative; z-index:2;
    display:grid; grid-template-columns:1fr 1.4fr; gap:64px; align-items:center;
  }
  .preview-title { font-size:clamp(28px,3.5vw,42px); font-weight:900; color:#fff; line-height:1.2; margin-bottom:16px; }
  .preview-desc  { font-size:16px; color:#94a3b8; line-height:1.7; margin-bottom:32px; }
  .preview-bullets { list-style:none; display:flex; flex-direction:column; gap:12px; margin-bottom:32px; }
  .preview-bullets li {
    display:flex; align-items:center; gap:10px;
    font-size:14px; color:#cbd5e1; font-weight:500;
  }
  .pb-check {
    width:22px; height:22px; border-radius:6px; flex-shrink:0;
    background:rgba(249,115,22,.15); display:flex; align-items:center; justify-content:center;
    font-size:12px; color:#f97316;
  }
  .preview-img-wrap {
    border-radius:20px; overflow:hidden; position:relative;
    box-shadow:0 40px 100px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06);
    animation:floatY 7s ease-in-out infinite;
  }
  .preview-img-wrap img { width:100%; display:block; }
  .preview-img-shine {
    position:absolute; top:0; left:-100%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);
    animation:shimmerSlide 3s 1s ease-in-out;
  }

  /* ── How it works ── */
  .hiw-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:52px; }
  .hiw-card {
    text-align:center; padding:32px 20px; border-radius:18px;
    background:#fff; border:1.5px solid #f1f5f9;
    box-shadow:0 2px 8px rgba(0,0,0,.04);
    transition:transform .3s ease;
    position:relative;
  }
  .hiw-card:hover { transform:translateY(-5px); }
  .hiw-connector {
    position:absolute; top:40px; right:-13px; z-index:2;
    width:26px; height:26px; background:#fff;
    border-radius:50%; display:flex; align-items:center; justify-content:center;
    border:1.5px solid #f1f5f9; font-size:12px; color:#9ca3af;
    box-shadow:0 2px 8px rgba(0,0,0,.04);
  }
  .hiw-num {
    width:56px; height:56px; border-radius:16px; margin:0 auto 18px;
    display:flex; align-items:center; justify-content:center;
    font-size:24px;
    background:linear-gradient(135deg,#fff7ed,#fef3c7);
    border:2px solid #fed7aa;
  }
  .hiw-title { font-size:15px; font-weight:800; margin-bottom:8px; color:#0f172a; }
  .hiw-desc  { font-size:13px; color:#6b7280; line-height:1.6; }

  /* ── CTA Section ── */
  .cta-section {
    background:linear-gradient(135deg,#fff7ed,#fef9ec);
    border-top:1.5px solid #fed7aa; border-bottom:1.5px solid #fed7aa;
    padding:80px 24px; text-align:center;
    position:relative; overflow:hidden;
  }
  .cta-doodle { position:absolute; pointer-events:none; opacity:.4; }
  .cta-title { font-size:clamp(26px,3.5vw,42px); font-weight:900; color:#0f172a; margin-bottom:14px; }
  .cta-desc  { font-size:16px; color:#6b7280; margin-bottom:32px; max-width:480px; margin-left:auto; margin-right:auto; }
  .cta-btns  { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

  /* ── Footer ── */
  .lp-footer {
    background:#0f172a; padding:60px 24px 28px;
  }
  .footer-inner { max-width:1180px; margin:0 auto; }
  .footer-top {
    display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:48px;
  }
  .footer-brand-name { font-size:16px; font-weight:800; color:#f8fafc; margin-bottom:8px; }
  .footer-brand-desc { font-size:13px; color:#64748b; line-height:1.7; margin-bottom:16px; max-width:260px; }
  .footer-flag { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#64748b; }
  .fcol-title { font-size:12px; font-weight:700; color:#f8fafc; margin-bottom:14px; text-transform:uppercase; letter-spacing:.06em; }
  .footer-links { list-style:none; display:flex; flex-direction:column; gap:10px; }
  .footer-links a { font-size:14px; color:#64748b; text-decoration:none; transition:color .2s; }
  .footer-links a:hover { color:#f97316; }
  .footer-bottom {
    padding-top:24px; border-top:1px solid rgba(255,255,255,.06);
    display:flex; justify-content:space-between; align-items:center;
    font-size:13px; color:#475569;
  }

  /* ── IntersectFade helper ── */
  .if-hidden { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
  .if-visible { opacity:1; transform:translateY(0); }

  /* ── Responsive ── */
  @media(max-width:1024px){
    .feat-grid        { grid-template-columns:repeat(2,1fr); }
    .preview-inner    { grid-template-columns:1fr; gap:40px; }
    .hiw-grid         { grid-template-columns:repeat(2,1fr); }
    .hiw-connector    { display:none; }
    .footer-top       { grid-template-columns:1fr 1fr; gap:32px; }
  }
  @media(max-width:768px){
    .hero-inner       { grid-template-columns:1fr; text-align:center; gap:40px; }
    .hero-right       { order:-1; }
    .hero-cylinder    { display:none; }
    .hero-mini-card   { display:none; }
    .hero-desc        { margin-left:auto; margin-right:auto; }
    .hero-ctas        { justify-content:center; }
    .trust-row        { justify-content:center; }
    .feat-grid        { grid-template-columns:1fr; }
    .feat-bar         { flex-direction:column; }
    .feat-bar-item    { border-right:none; border-bottom:1.5px solid #f1f5f9; }
    .feat-bar-item:last-child { border-bottom:none; }
    .hiw-grid         { grid-template-columns:1fr; }
    .footer-top       { grid-template-columns:1fr; gap:24px; }
    .footer-bottom    { flex-direction:column; gap:8px; text-align:center; }
    .lp-nav-links     { display:none; }
    .lp-nav-btns .btn-ghost-dark { display:none; }
    .mob-btn          { display:block; }
    .cta-btns         { flex-direction:column; align-items:center; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Data — real features only, no fake stats                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "📊",
    bg: "#eff6ff",
    title: "Sales Management",
    desc: "Record every cylinder and regulator sale instantly. View daily totals, filter by product type, and never lose a sale entry.",
  },
  {
    icon: "👥",
    bg: "#f0fdf4",
    title: "Customer Ledger",
    desc: "Maintain digital profiles for every customer. Track their full transaction history, outstanding balance, and contact details.",
  },
  {
    icon: "💸",
    bg: "#fff7ed",
    title: "Udhari (Credit) Tracking",
    desc: "Know exactly who owes you money and how much. Record credits, collect payments, and view outstanding reports at any time.",
  },
  {
    icon: "💰",
    bg: "#f0fdf4",
    title: "Cashbook & Payments",
    desc: "Log all cash inflows and outflows. Keep a clean digital cashbook with daily summaries and running balance.",
  },
  {
    icon: "🏍️",
    bg: "#fdf4ff",
    title: "Delivery Boy Management",
    desc: "Assign sales to delivery staff, track their performance, and manage commissions — all from one screen.",
  },
  {
    icon: "📦",
    bg: "#fffbeb",
    title: "Product & Stock",
    desc: "Manage your cylinder inventory — 14.2 kg, 5 kg, 19 kg. Know your current stock and track product-wise sales.",
  },
  {
    icon: "💳",
    bg: "#eff6ff",
    title: "Payment Inflow & Outflow",
    desc: "Separately track money received from customers and money paid to vendors or expenses. Full audit trail included.",
  },
  {
    icon: "📈",
    bg: "#f0fdf4",
    title: "Reports & Analytics",
    desc: "Generate sales reports, profit summaries, and outstanding dues. Export to Excel or PDF with a single tap.",
  },
  {
    icon: "🔒",
    bg: "#fff7ed",
    title: "Multi-User & Roles",
    desc: "Add staff members with different roles — admin, manager, accountant. Each sees only what they need.",
  },
];

const BOTTOM_BAR = [
  { icon: "📋", title: "Quick Sales Entry", sub: "One-tap billing" },
  { icon: "🚚", title: "Delivery Tracking", sub: "Assign & monitor" },
  { icon: "🛢️", title: "Stock Management", sub: "Real-time inventory" },
  { icon: "💳", title: "Payment Collection", sub: "Multiple modes" },
  { icon: "📊", title: "Reports & Analytics", sub: "Export in one click" },
];

const HOW_STEPS = [
  { emoji: "🏢", title: "Register Your Agency", desc: "Create your agency account with a unique code in minutes. No technical setup needed." },
  { emoji: "👤", title: "Add Your Customers", desc: "Import or manually add existing customer profiles with their contact and balance details." },
  { emoji: "🛢️", title: "Start Recording Sales", desc: "Log cylinder sales, collect payments, and mark udharis as you go — on any device." },
  { emoji: "📊", title: "View Your Reports", desc: "Check your dashboard for real-time totals, export reports, and stay on top of your business." },
];

const PREVIEW_BULLETS = [
  "See today's sales, collections, and outstanding at a glance",
  "View recent transactions in a clean, sorted table",
  "Monitor cylinder stock by product type",
  "Access everything on mobile — even in low-network areas",
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  IntersectFade                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function Fade({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Scribble underline                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
function Scribble({ color = "#f97316" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 10" style={{ position: "absolute", bottom: -8, left: 0, width: "100%", height: 10 }}>
      <path d="M4 6 Q50 2 100 6 Q150 10 196 5" fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray="600"
        style={{ animation: "scribbleDraw 1.5s ease forwards" }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Doodle SVG                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function DoodleStars({ size = 100, color = "#f97316" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M20 20 L23 12 L26 20 L34 23 L26 26 L23 34 L20 26 L12 23 Z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="200"
        style={{ animation: "scribbleDraw 2s ease forwards" }} />
      <circle cx="65" cy="25" r="4" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="40"
        style={{ animation: "scribbleDraw 2s .3s ease forwards" }} />
      <path d="M75 60 L78 52 L81 60 L89 63 L81 66 L78 74 L75 66 L67 63 Z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="200"
        style={{ animation: "scribbleDraw 2s .6s ease forwards" }} />
      <circle cx="25" cy="80" r="5" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="40"
        style={{ animation: "scribbleDraw 2s .9s ease forwards" }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Marquee strip data                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
const MQ_ITEMS = [
  "🛢️ LPG Sales Management",
  "👥 Customer Ledger",
  "💸 Udhari Tracking",
  "🏍️ Delivery Management",
  "📦 Stock Inventory",
  "💰 Cashbook",
  "📈 Business Reports",
  "🔒 Multi-User Access",
  "📱 Works on Mobile",
  "🇮🇳 Made for India",
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Landing Page                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("lp-body");
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => { document.body.classList.remove("lp-body"); window.removeEventListener("scroll", fn); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Mobile drawer ─────────────────────────── */}
      <div className={`mob-drawer${mobOpen ? " open" : ""}`}>
        <button className="mob-close-btn" onClick={() => setMobOpen(false)}>✕</button>
        <a href="#features"  onClick={() => setMobOpen(false)}>Features</a>
        <a href="#how"       onClick={() => setMobOpen(false)}>How It Works</a>
        <a href="#preview"   onClick={() => setMobOpen(false)}>App Preview</a>
        <Link to="/login" onClick={() => setMobOpen(false)} style={{ color: "#f97316", textDecoration: "none", fontWeight: 800, fontSize: 22 }}>
          Login →
        </Link>
      </div>

      {/* ── Navbar ────────────────────────────────── */}
      <nav className={`lp-nav${scrolled ? " scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <a href="#" className="lp-logo">
            <div className="lp-logo-icon">🔥</div>
            <div>
              <div className="lp-logo-name">LPG Agency ERP</div>
              <div className="lp-logo-tag">Smart. Simple. Secure.</div>
            </div>
          </a>

          <ul className="lp-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#preview">App Preview</a></li>
          </ul>

          <div className="lp-nav-btns">
            <Link to="/login" className="btn-ghost-dark">Login</Link>
            <Link to="/login" className="btn-orange">Start Free Trial →</Link>
          </div>
          <button className="mob-btn" onClick={() => setMobOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        {/* Doodle decorations */}
        <div className="doodle-tl"><DoodleStars size={110} color="#f97316" /></div>
        <div className="doodle-br" style={{ bottom: 60, right: 20 }}><DoodleStars size={80} color="#1e4cc3" /></div>

        <div className="hero-inner">
          {/* Left */}
          <div>
            <div className="hero-badge" style={{ animation: "fadeUp .5s ease both" }}>
              <span className="badge-star">★</span> Built for India's LPG Agencies
            </div>

            <h1 className="hero-h1">
              Run Your LPG Agency<br />
              Smarter, Faster &{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span className="orange">More Profitable</span>
                <Scribble color="#f97316" />
              </span>
            </h1>

            <p className="hero-desc">
              Manage bookings, customers, payments, stock, udhari, and reports
              from one powerful platform. Designed for India. Built for growth.
            </p>

            <div className="hero-ctas">
              <Link to="/login" className="btn-primary-lg">Start Free Trial →</Link>
              <a href="#preview" className="btn-outline-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                See App Preview
              </a>
            </div>

            <div className="trust-row">
              <div className="trust-badge"><span className="trust-icon">🔒</span> 100% Secure Data</div>
              <div className="trust-badge"><span className="trust-icon">📵</span> Works Offline</div>
              <div className="trust-badge"><span className="trust-icon">📱</span> Any Device</div>
            </div>
          </div>

          {/* Right — dashboard screenshot */}
          <div className="hero-right">
            {/* Scribble circle behind card */}
            <svg style={{ position: "absolute", top: -30, right: -30, opacity: .08, pointerEvents: "none", zIndex: 0 }}
              width="300" height="300" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="130" stroke="#f97316" strokeWidth="3" fill="none"
                strokeDasharray="900" style={{ animation: "scribbleDraw 3s ease forwards" }} />
            </svg>

            <div className="hero-dashboard-wrap">
              <img src="/app-dashboard-screenshot.png" alt="LPG Agency ERP Dashboard" className="hero-dashboard-img" />
            </div>

            {/* Red cylinder floating */}
            <img src="/lpg-red-cylinder.png" alt="LPG Cylinder" className="hero-cylinder" />

            {/* Floating mini cards */}
            <div className="hero-mini-card" style={{ top: -16, left: -20, animationDelay: ".4s" }}>
              <div className="mc-icon" style={{ background: "#fff7ed" }}>📈</div>
              <div><div className="mc-label">Today's Collection</div><div className="mc-val">₹24,580</div></div>
            </div>
            <div className="hero-mini-card" style={{ bottom: 80, left: -24, animationDelay: ".6s" }}>
              <div className="mc-icon" style={{ background: "#fef9c3" }}>💸</div>
              <div><div className="mc-label">Pending Udhari</div><div className="mc-val" style={{ color: "#dc2626" }}>₹8,240</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee strip ─────────────────────────── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MQ_ITEMS, ...MQ_ITEMS].map((item, i) => (
            <div key={i} className="mq-item">
              {item}
              <div className="mq-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────── */}
      <section className="lp-section" id="features" style={{ background: "#f8f9fb" }}>
        <div className="lp-wrap">
          <Fade>
            <div className="center">
              <div className="sec-eyebrow">Everything You Need</div>
              <h2 className="sec-title">
                One Platform. All Your{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  Agency Needs
                  <Scribble color="#f97316" />
                </span>
              </h2>
              <p className="sec-desc center">
                From recording sales to tracking udhari to generating reports — every workflow your gas agency needs, built into one clean, fast app.
              </p>
            </div>
          </Fade>

          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <Fade key={i} delay={i * 0.05}>
                <div className="feat-card">
                  {/* Doodle corner */}
                  <svg style={{ position: "absolute", top: 12, right: 12, opacity: .15 }} width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="4" cy="4" r="1.5" fill="#9ca3af" />
                    <circle cx="10" cy="4" r="1.5" fill="#9ca3af" />
                    <circle cx="16" cy="4" r="1.5" fill="#9ca3af" />
                    <circle cx="4" cy="10" r="1.5" fill="#9ca3af" />
                    <circle cx="10" cy="10" r="1.5" fill="#9ca3af" />
                    <circle cx="16" cy="10" r="1.5" fill="#9ca3af" />
                  </svg>
                  <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              </Fade>
            ))}
          </div>

          {/* Bottom feature bar */}
          <Fade delay={0.1}>
            <div className="feat-bar">
              {BOTTOM_BAR.map((b, i) => (
                <div key={i} className="feat-bar-item">
                  <span className="fbi-icon">{b.icon}</span>
                  <div className="fbi-title">{b.title}</div>
                  <div className="fbi-sub">{b.sub}</div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ── App Preview ───────────────────────────── */}
      <section className="preview-section" id="preview">
        <div className="preview-blob preview-blob-1" />
        <div className="preview-blob preview-blob-2" />

        <div className="preview-inner">
          {/* Left */}
          <Fade>
            <div>
              <div className="sec-eyebrow" style={{ color: "#fb923c" }}>See It Live</div>
              <h2 className="preview-title">
                Your Agency Dashboard,<br />
                <span style={{ color: "#fb923c" }}>All in One Place</span>
              </h2>
              <p className="preview-desc">
                A clean, fast dashboard that shows you exactly what's happening in your business — right when you open the app.
              </p>
              <ul className="preview-bullets">
                {PREVIEW_BULLETS.map((b, i) => (
                  <li key={i}><div className="pb-check">✓</div>{b}</li>
                ))}
              </ul>
              <Link to="/login" className="btn-orange" style={{ display: "inline-flex" }}>
                Try the Dashboard →
              </Link>
            </div>
          </Fade>

          {/* Right */}
          <Fade delay={0.1}>
            <div className="preview-img-wrap">
              <img src="/app-dashboard-screenshot.png" alt="Agency Dashboard Preview" />
              <div className="preview-img-shine" />
            </div>
          </Fade>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section className="lp-section" id="how" style={{ background: "#fff" }}>
        <div className="lp-wrap">
          <Fade>
            <div className="center">
              <div className="sec-eyebrow">Simple Process</div>
              <h2 className="sec-title">
                Up & Running in{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  4 Easy Steps
                  <Scribble color="#f97316" />
                </span>
              </h2>
            </div>
          </Fade>

          <div className="hiw-grid">
            {HOW_STEPS.map((s, i) => (
              <Fade key={i} delay={i * 0.08}>
                <div className="hiw-card">
                  {i < HOW_STEPS.length - 1 && <div className="hiw-connector">→</div>}
                  <div className="hiw-num">{s.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>
                    Step {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="hiw-title">{s.title}</div>
                  <div className="hiw-desc">{s.desc}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="cta-section">
        {/* Doodle decorations */}
        <div className="cta-doodle" style={{ top: 20, left: 40 }}>
          <DoodleStars size={90} color="#f97316" />
        </div>
        <div className="cta-doodle" style={{ bottom: 20, right: 40, transform: "scaleX(-1)" }}>
          <DoodleStars size={70} color="#1e4cc3" />
        </div>

        {/* Scribble wave */}
        <svg style={{ position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: 6, opacity: .3 }}
          viewBox="0 0 1200 6" preserveAspectRatio="none">
          <path d="M0 3 Q150 0 300 3 Q450 6 600 3 Q750 0 900 3 Q1050 6 1200 3"
            fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="2000" style={{ animation: "scribbleDraw 3s ease forwards" }} />
        </svg>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
          <h2 className="cta-title">
            Ready to Transform<br />
            <span style={{ color: "#f97316" }}>Your Gas Agency?</span>
          </h2>
          <p className="cta-desc">
            Start your free trial today. No credit card needed. No setup fees. Just your agency, running smarter.
          </p>
          <div className="cta-btns">
            <Link to="/login" className="btn-primary-lg">Start Free Trial →</Link>
            <a href="#features" className="btn-outline-lg">Explore Features</a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="footer-inner">
          <div className="footer-top">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className="lp-logo-icon" style={{ width: 36, height: 36, fontSize: 16 }}>🔥</div>
                <div className="footer-brand-name">LPG Agency ERP</div>
              </div>
              <p className="footer-brand-desc">
                India's trusted LPG gas agency management platform. Built to make every agency owner's life simpler.
              </p>
              <div className="footer-flag">Made with ❤️ in <span>🇮🇳</span> India</div>
            </div>

            {/* Product */}
            <div>
              <div className="fcol-title">Product</div>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how">How It Works</a></li>
                <li><a href="#preview">App Preview</a></li>
                <li><Link to="/login" style={{ color: "#64748b", textDecoration: "none" }}>Login</Link></li>
              </ul>
            </div>

            {/* Features quick list */}
            <div>
              <div className="fcol-title">Features</div>
              <ul className="footer-links">
                <li><a href="#features">Sales Management</a></li>
                <li><a href="#features">Udhari Tracking</a></li>
                <li><a href="#features">Customer Ledger</a></li>
                <li><a href="#features">Reports & Analytics</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="fcol-title">Support</div>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 LPG Agency ERP. All rights reserved.</div>
            <div>Smart. Simple. Secure.</div>
          </div>
        </div>
      </footer>
    </>
  );
}
