import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  Wallet,
  Truck,
  Box,
  ArrowUpDown,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Lock,
  ChevronRight,
  Info,
  ArrowRight,
  X,
  FileText,
  UserCheck,
  Download,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/landing")({ component: LandingPage });

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Styles                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body.lp-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #090d16;
    color: #f8fafc;
    overflow-x: hidden;
  }

  /* Doodle Grid Background Pattern */
  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center;
    pointer-events: none;
    z-index: 1;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }
  @keyframes scribbleDraw {
    from { stroke-dashoffset: 800; }
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
    from { opacity:0; transform: translateY(16px) scale(0.98); }
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
    transition: background .3s ease, border .3s ease;
    animation: navIn .45s cubic-bezier(.16,1,.3,1) both;
    border-bottom: 1px solid transparent;
  }
  .lp-nav.scrolled {
    background: rgba(9, 13, 22, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .lp-nav-inner {
    max-width: 1180px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
  }
  .lp-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .lp-logo-icon {
    width:40px; height:40px; border-radius:11px;
    background: linear-gradient(135deg,#f97316,#2563eb);
    display:flex; align-items:center; justify-content:center;
    box-shadow: 0 4px 12px rgba(249,115,22,.3); flex-shrink:0;
  }
  .lp-logo-name  { font-weight:800; font-size:15px; color:#f8fafc; line-height:1.2; font-family: 'Outfit', sans-serif; }
  .lp-logo-tag   { font-size:11px; color:#94a3b8; font-weight:500; }
  .lp-nav-links  { display:flex; gap:28px; list-style:none; }
  .lp-nav-links a{ color:#94a3b8; font-size:14px; font-weight:500; text-decoration:none; transition:color .2s; }
  .lp-nav-links a:hover{ color:#f97316; }
  .lp-nav-btns   { display:flex; gap:10px; align-items:center; }
  .btn-ghost-dark {
    padding:9px 20px; border-radius:9px; font-size:14px; font-weight:600;
    color:#cbd5e1; border:1.5px solid rgba(255, 255, 255, 0.15); background:transparent;
    text-decoration:none; transition:all .2s ease; cursor:pointer;
  }
  .btn-ghost-dark:hover { border-color:#f97316; color:#f97316; background:rgba(249,115,22,0.06); }
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
  .mob-btn span { display:block; width:22px; height:2px; background:#f8fafc; border-radius:2px; margin:5px 0; transition:all .3s; }

  /* ── Mobile drawer ── */
  .mob-drawer {
    display:none; position:fixed; inset:0; z-index:200;
    background:rgba(9, 13, 22, 0.98); backdrop-filter:blur(20px);
    flex-direction:column; align-items:center; justify-content:center; gap:28px;
  }
  .mob-drawer.open{ display:flex; }
  .mob-drawer a { font-size:22px; font-weight:700; color:#f8fafc; text-decoration:none; font-family: 'Outfit', sans-serif; }
  .mob-drawer a:hover{ color:#f97316; }
  .mob-close-btn {
    position:absolute; top:20px; right:20px;
    width:40px; height:40px; border-radius:10px;
    background:rgba(255, 255, 255, 0.08); border:none; cursor:pointer;
    font-size:18px; display:flex; align-items:center; justify-content:center; color:#f8fafc;
  }

  /* ── Hero ── */
  .hero {
    min-height:100vh; display:flex; align-items:center;
    padding:120px 24px 80px; background:#090d16; position:relative; overflow:hidden;
  }
  .hero-blob {
    position:absolute; z-index:0; pointer-events:none;
    background:linear-gradient(135deg,rgba(249,115,22,.12),rgba(37,99,235,.12));
    animation: blobPulse 8s ease-in-out infinite;
    filter:blur(80px);
  }
  .hero-blob-1 { width:600px; height:600px; top:-200px; right:-100px; }
  .hero-blob-2 { width:450px; height:450px; bottom:-150px; left:-80px;
    background:linear-gradient(135deg,rgba(37,99,235,.1),rgba(249,115,22,.08)); }
  .hero-inner {
    max-width:1180px; margin:0 auto; position:relative; z-index:2;
    display:grid; grid-template-columns:1.1fr 0.9fr; gap:60px; align-items:center; width:100%;
  }

  /* Badge */
  .hero-badge {
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 14px; border-radius:100px;
    background:rgba(249, 115, 22, 0.08); border:1.5px solid rgba(249, 115, 22, 0.25);
    font-size:12px; font-weight:700; color:#fb923c;
    margin-bottom:18px; animation:fadeUp .5s ease both;
  }

  /* Hero text */
  .hero-h1 {
    font-family: 'Outfit', sans-serif;
    font-size:clamp(36px,4.8vw,60px); font-weight:900; line-height:1.08;
    margin-bottom:18px; animation:fadeUp .55s .05s ease both; color:#f8fafc;
    letter-spacing: -0.02em;
  }
  .hero-h1 .orange { color:#f97316; }
  .hero-desc {
    font-size:16px; color:#94a3b8; line-height:1.75; max-width:500px;
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
    color:#cbd5e1; border:1.5px solid rgba(255, 255, 255, 0.15); background:rgba(255, 255, 255, 0.03);
    text-decoration:none; cursor:pointer; transition:all .2s ease;
  }
  .btn-outline-lg:hover{ border-color:#f97316; color:#f97316; background:rgba(249,115,22,0.06); }

  /* Trust badges */
  .trust-row {
    display:flex; gap:24px; margin-top:32px; flex-wrap:wrap;
    animation:fadeUp .55s .2s ease both;
  }
  .trust-badge {
    display:flex; align-items:center; gap:7px;
    font-size:13px; font-weight:600; color:#cbd5e1;
  }
  .trust-icon { color: #f97316; }

  /* Hero right */
  .hero-right {
    position:relative; animation:fadeIn .8s .2s ease both;
  }
  .hero-dashboard-wrap {
    border-radius:20px; overflow:hidden;
    box-shadow: 0 20px 80px rgba(0,0,0,.4), 0 0 0 1.5px rgba(255,255,255,.08);
    background:#0b0f19; animation:floatY 6s ease-in-out infinite;
    position:relative; z-index:2;
  }
  .hero-dashboard-img { width:100%; display:block; opacity: 0.95; }
  .hero-cylinder {
    position:absolute; right:-50px; bottom:-40px; z-index:3;
    width:170px; filter:drop-shadow(0 20px 40px rgba(0,0,0,.4));
    animation:floatY 5s 1s ease-in-out infinite;
  }

  /* Floating mini stat cards */
  .hero-mini-card {
    position:absolute; z-index:4;
    background:#0f172a; border-radius:12px; padding:10px 14px;
    border: 1.5px solid rgba(255,255,255,0.08);
    box-shadow:0 12px 36px rgba(0,0,0,.3);
    display:flex; align-items:center; gap:10px;
    font-size:13px; font-weight:600; color:#f8fafc; white-space:nowrap;
    animation:cardIn .6s ease both;
  }
  .mc-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
  .mc-label { font-size:10px; color:#94a3b8; font-weight:500; }
  .mc-val   { font-size:14px; font-weight:800; }

  /* Scribble underline */
  .scribble-wrap { display:inline-block; position:relative; }
  .scribble-svg  { position:absolute; bottom:-6px; left:0; right:0; width:100%; height:12px; pointer-events:none; }
  .scribble-path {
    fill:none; stroke-linecap:round; stroke-dasharray:600;
    animation:scribbleDraw 1.5s ease forwards;
  }

  /* Doodle corners */
  .doodle-tl { position:absolute; top:90px; left:16px; opacity:.18; z-index:1; pointer-events:none; }
  .doodle-br { position:absolute; bottom:60px; right:16px; opacity:.18; z-index:1; pointer-events:none; }

  /* ── Marquee strip ── */
  .marquee-strip {
    overflow:hidden; background:#0b0f19; border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06);
    padding:16px 0;
  }
  .marquee-track {
    display:flex; gap:40px; width:max-content;
    animation:marquee 24s linear infinite;
  }
  .mq-item {
    display:flex; align-items:center; gap:8px;
    font-size:13px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em;
    white-space:nowrap;
  }
  .mq-dot { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.1); }

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
    font-family: 'Outfit', sans-serif;
    font-size:clamp(28px,3.8vw,44px); font-weight:900; line-height:1.12;
    color:#f8fafc; margin-bottom:14px;
    letter-spacing: -0.01em;
  }
  .sec-desc { font-size:16px; color:#94a3b8; line-height:1.7; max-width:560px; }
  .center { text-align:center; }
  .sec-desc.center { margin:0 auto; }

  /* ── Interactive Feature Explorer ── */
  .explorer-layout {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 32px;
    margin-top: 52px;
    align-items: stretch;
  }
  .explorer-tabs {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 580px;
    overflow-y: auto;
    padding-right: 8px;
  }
  .explorer-tabs::-webkit-scrollbar {
    width: 6px;
  }
  .explorer-tabs::-webkit-scrollbar-track {
    background: transparent;
  }
  .explorer-tabs::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
  }
  .explorer-tab-btn {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px;
    border-radius: 16px;
    background: #0b0f19;
    border: 2px solid rgba(255, 255, 255, 0.06);
    text-align: left;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .explorer-tab-btn:hover {
    border-color: rgba(249, 115, 22, 0.2);
    background: rgba(249, 115, 22, 0.02);
    transform: translateX(4px);
  }
  .explorer-tab-btn.active {
    border-color: #f97316;
    background: rgba(249, 115, 22, 0.06);
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.04);
  }
  .explorer-tab-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.25s;
  }
  .explorer-tab-btn:hover .explorer-tab-icon {
    transform: scale(1.1);
  }
  .explorer-tab-title {
    font-size: 15px;
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 4px;
    font-family: 'Outfit', sans-serif;
  }
  .explorer-tab-desc {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
  }

  .explorer-screen {
    background: #0b0f19;
    border-radius: 24px;
    border: 2px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 580px;
  }
  .explorer-screen-header {
    background: #070a12;
    border-bottom: 2px solid rgba(255, 255, 255, 0.06);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: space-between;
  }
  .browser-dots {
    display: flex;
    gap: 6px;
  }
  .browser-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .browser-dot.red { background: #ef4444; }
  .browser-dot.yellow { background: #eab308; }
  .browser-dot.green { background: #22c55e; }
  .browser-address {
    flex-grow: 1;
    max-width: 320px;
    background: #090d16;
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 5px 12px;
    font-size: 12px;
    color: #64748b;
    font-family: monospace;
    text-align: center;
  }
  .explorer-screen-body {
    padding: 24px;
    flex-grow: 1;
    background: #070a12;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: auto;
    max-height: 520px;
  }

  /* Mock App Layout Components */
  .mock-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .mock-title {
    font-size: 18px;
    font-weight: 800;
    color: #f8fafc;
    font-family: 'Outfit', sans-serif;
  }
  .mock-subtitle {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }
  .mock-btn-sm {
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .mock-btn-primary {
    background: #f97316;
    color: #ffffff;
  }
  .mock-btn-primary:hover {
    background: #ea580c;
  }
  .mock-btn-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: #f8fafc;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .mock-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Tables, Grid & Forms inside Mock App */
  .mock-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }
  .mock-stat-card {
    background: #0b0f19;
    border: 1.5px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 12px;
  }
  .mock-stat-label {
    font-size: 10px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
  }
  .mock-stat-value {
    font-size: 16px;
    font-weight: 800;
    color: #f8fafc;
    margin-top: 4px;
  }
  .mock-card {
    background: #0b0f19;
    border: 1.5px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .mock-table-wrapper {
    overflow-x: auto;
    background: #0b0f19;
    border-radius: 12px;
    border: 1.5px solid rgba(255, 255, 255, 0.06);
  }
  .mock-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 460px;
  }
  .mock-table th {
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    padding: 10px 12px;
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.06);
    text-transform: uppercase;
    background: #090d16;
  }
  .mock-table td {
    font-size: 13px;
    color: #cbd5e1;
    padding: 12px;
    border-bottom: 1.5px solid rgba(255,255,255,0.04);
  }
  .mock-table tr:last-child td {
    border-bottom: none;
  }
  .mock-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 700;
  }
  .mock-badge-success { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
  .mock-badge-warning { background: rgba(234, 179, 8, 0.15); color: #facc15; }
  .mock-badge-danger { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
  .mock-badge-info { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }

  /* Forms */
  .mock-form-group {
    margin-bottom: 12px;
  }
  .mock-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    margin-bottom: 4px;
  }
  .mock-input, .mock-select {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    background: #070a12;
    color: #f8fafc;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .mock-input:focus, .mock-select:focus {
    border-color: #f97316;
  }

  /* ── Feature icon row (bottom bar reference style) ── */
  .feat-bar {
    display:flex; gap:0; background:#0b0f19; border-radius:20px; overflow:hidden;
    border:1.5px solid rgba(255,255,255,0.06); box-shadow:0 4px 24px rgba(0,0,0,0.2);
    margin-top: 52px; flex-wrap:wrap;
  }
  .feat-bar-item {
    flex:1; min-width:160px; padding:24px 20px; text-align:center;
    border-right:1.5px solid rgba(255,255,255,0.06); transition:background .2s;
    position:relative;
  }
  .feat-bar-item:last-child { border-right:none; }
  .feat-bar-item:hover { background:rgba(249,115,22,0.04); }
  .feat-bar-item:hover .fbi-icon { transform:scale(1.1); color: #f97316; }
  .fbi-icon { font-size:24px; margin-bottom:10px; display:inline-block; transition:all .3s cubic-bezier(.34,1.56,.64,1); color: #cbd5e1; }
  .fbi-title { font-size:13px; font-weight:700; color:#f8fafc; margin-bottom:4px; }
  .fbi-sub   { font-size:12px; color:#64748b; }

  /* ── App preview section ── */
  .preview-section {
    background: #070a12;
    padding:88px 24px; position:relative; overflow:hidden;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .preview-blob {
    position:absolute; pointer-events:none;
    background:radial-gradient(circle,rgba(249,115,22,.08),transparent 70%);
    border-radius:50%; z-index:0;
  }
  .preview-blob-1 { width:600px; height:600px; top:-200px; right:-100px; }
  .preview-blob-2 { width:400px; height:400px; bottom:-150px; left:-100px;
    background:radial-gradient(circle,rgba(37,99,235,.1),transparent 70%); }
  .preview-inner {
    max-width:1180px; margin:0 auto; position:relative; z-index:2;
    display:grid; grid-template-columns:1fr 1.4fr; gap:64px; align-items:center;
  }
  .preview-title { font-family: 'Outfit', sans-serif; font-size:clamp(28px,3.5vw,42px); font-weight:900; color:#fff; line-height:1.2; margin-bottom:16px; }
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
    box-shadow:0 40px 100px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.08);
    animation:floatY 7s ease-in-out infinite;
  }
  .preview-img-wrap img { width:100%; display:block; opacity: 0.9; }
  .preview-img-shine {
    position:absolute; top:0; left:-100%; width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);
    animation:shimmerSlide 3s 1s ease-in-out;
  }

  /* ── How it works ── */
  .hiw-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:52px; }
  .hiw-card {
    text-align:center; padding:32px 20px; border-radius:18px;
    background:#0b0f19; border:1.5px solid rgba(255, 255, 255, 0.06);
    box-shadow:0 4px 16px rgba(0,0,0,.2);
    transition:transform .3s ease;
    position:relative;
  }
  .hiw-card:hover { transform:translateY(-5px); border-color: rgba(249, 115, 22, 0.2); }
  .hiw-connector {
    position:absolute; top:40px; right:-13px; z-index:2;
    width:26px; height:26px; background:#0b0f19;
    border-radius:50%; display:flex; align-items:center; justify-content:center;
    border:1.5px solid rgba(255, 255, 255, 0.06); font-size:12px; color:#9ca3af;
  }
  .hiw-num {
    width:56px; height:56px; border-radius:16px; margin:0 auto 18px;
    display:flex; align-items:center; justify-content:center;
    background:rgba(249, 115, 22, 0.08);
    border:2px solid rgba(249, 115, 22, 0.25);
    color: #f97316;
  }
  .hiw-title { font-size:15px; font-weight:800; margin-bottom:8px; color:#f8fafc; font-family: 'Outfit', sans-serif; }
  .hiw-desc  { font-size:13px; color:#94a3b8; line-height:1.6; }

  /* ── CTA Section ── */
  .cta-section {
    background:linear-gradient(135deg,#0c111d,#080c14);
    border-top:1.5px solid rgba(255, 255, 255, 0.06); border-bottom:1.5px solid rgba(255, 255, 255, 0.06);
    padding:80px 24px; text-align:center;
    position:relative; overflow:hidden;
  }
  .cta-doodle { position:absolute; pointer-events:none; opacity:.2; }
  .cta-title { font-family: 'Outfit', sans-serif; font-size:clamp(26px,3.5vw,42px); font-weight:900; color:#f8fafc; margin-bottom:14px; }
  .cta-desc  { font-size:16px; color:#94a3b8; margin-bottom:32px; max-width:480px; margin-left:auto; margin-right:auto; }
  .cta-btns  { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

  /* ── Footer ── */
  .lp-footer {
    background:#070a12; padding:60px 24px 28px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  .footer-inner { max-width:1180px; margin:0 auto; }
  .footer-top {
    display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:48px;
  }
  .footer-brand-name { font-family: 'Outfit', sans-serif; font-size:16px; font-weight:800; color:#f8fafc; margin-bottom:8px; }
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

  /* ── Responsive Explorer Layout ── */
  @media(max-width:900px){
    .explorer-layout  { grid-template-columns:1fr; }
    .explorer-tabs    { flex-direction:row; overflow-x:auto; padding-bottom:12px; max-height:none; }
    .explorer-tab-btn { flex-shrink:0; width:260px; }
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
    .feat-bar         { flex-direction:column; }
    .feat-bar-item    { border-right:none; border-bottom:1.5px solid rgba(255, 255, 255, 0.06); }
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
/*  Data ── Real systems features list                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <TrendingUp className="fbi-icon" style={{ width: "20px", height: "20px", color: "#3b82f6" }} />,
    bg: "rgba(59, 130, 246, 0.1)",
    title: "Sales Management",
    desc: "Record every cylinder & regulator sale instantly. View daily summaries, print receipts, and track order statuses dynamically.",
    url: "localhost:8080/app/sales",
  },
  {
    icon: <Users className="fbi-icon" style={{ width: "20px", height: "20px", color: "#10b981" }} />,
    bg: "rgba(16, 185, 129, 0.1)",
    title: "Customer Ledger",
    desc: "Maintain digital profiles for every customer. Check complete history of refuels, payments, and running debit/credit statements.",
    url: "localhost:8080/app/customers",
  },
  {
    icon: <Wallet className="fbi-icon" style={{ width: "20px", height: "20px", color: "#f59e0b" }} />,
    bg: "rgba(245, 158, 11, 0.1)",
    title: "Udhari (Credit) Tracking",
    desc: "Know who owes you outstanding balance at all times. Log credit receipts, collect pending dues, and send reminders.",
    url: "localhost:8080/app/udhari",
  },
  {
    icon: <CreditCard className="fbi-icon" style={{ width: "20px", height: "20px", color: "#8b5cf6" }} />,
    bg: "rgba(139, 92, 246, 0.1)",
    title: "Cashbook & Payments",
    desc: "Record all incoming cash collections and outgoing expenses. Check daily cash-in-hand totals and net bank balances.",
    url: "localhost:8080/app/cashbook",
  },
  {
    icon: <Truck className="fbi-icon" style={{ width: "20px", height: "20px", color: "#ec4899" }} />,
    bg: "rgba(236, 72, 153, 0.1)",
    title: "Delivery Boy Manager",
    desc: "Assign orders to delivery boys. Track active pending deliveries, route coordinates, and staff refill commissions.",
    url: "localhost:8080/app/delivery-boys",
  },
  {
    icon: <Box className="fbi-icon" style={{ width: "20px", height: "20px", color: "#eab308" }} />,
    bg: "rgba(234, 179, 8, 0.1)",
    title: "Product & Stock",
    desc: "Monitor live stock levels for 14.2kg domestic, 19kg commercial, and 5kg cylinders. Auto-calculate available empty inventory.",
    url: "localhost:8080/app/products",
  },
  {
    icon: <ArrowUpDown className="fbi-icon" style={{ width: "20px", height: "20px", color: "#06b6d4" }} />,
    bg: "rgba(6, 182, 212, 0.1)",
    title: "Inflow & Outflow",
    desc: "Track full cash entries separated into customer payments received (inflow) and supplier/vendor expenditures paid (outflow).",
    url: "localhost:8080/app/payments",
  },
  {
    icon: <BarChart3 className="fbi-icon" style={{ width: "20px", height: "20px", color: "#10b981" }} />,
    bg: "rgba(16, 185, 129, 0.1)",
    title: "Reports & Analytics",
    desc: "Generate professional monthly sales statements. Track revenue and credit changes, and export clean PDF/Excel documents.",
    url: "localhost:8080/app/reports",
  },
  {
    icon: <Lock className="fbi-icon" style={{ width: "20px", height: "20px", color: "#f43f5e" }} />,
    bg: "rgba(244, 63, 94, 0.1)",
    title: "Multi-User & Roles",
    desc: "Manage permission levels for agency staff. Add managers with select reports access or operators with bill-only roles.",
    url: "localhost:8080/app/users",
  },
];

const BOTTOM_BAR = [
  { icon: <FileText style={{ width: "24px", height: "24px" }} />, title: "Quick Sales Entry", sub: "One-tap billing" },
  { icon: <Truck style={{ width: "24px", height: "24px" }} />, title: "Delivery Tracking", sub: "Assign & monitor" },
  { icon: <Box style={{ width: "24px", height: "24px" }} />, title: "Stock Management", sub: "Real-time inventory" },
  { icon: <Wallet style={{ width: "24px", height: "24px" }} />, title: "Payment Collection", sub: "Multiple modes" },
  { icon: <BarChart3 style={{ width: "24px", height: "24px" }} />, title: "Reports & Analytics", sub: "Export in one click" },
];

const HOW_STEPS = [
  { icon: <Box style={{ width: "28px", height: "28px" }} />, title: "Register Your Agency", desc: "Create your agency account with a unique code in minutes. No technical setup needed." },
  { icon: <Users style={{ width: "28px", height: "28px" }} />, title: "Add Your Customers", desc: "Import or manually add existing customer profiles with their contact and balance details." },
  { icon: <TrendingUp style={{ width: "28px", height: "28px" }} />, title: "Start Recording Sales", desc: "Log cylinder sales, collect payments, and mark udharis as you go — on any device." },
  { icon: <BarChart3 style={{ width: "28px", height: "28px" }} />, title: "View Your Reports", desc: "Check your dashboard for real-time totals, export reports, and stay on top of your business." },
];

const PREVIEW_BULLETS = [
  "See today's sales, collections, and outstanding at a glance",
  "View recent transactions in a clean, sorted table",
  "Monitor cylinder stock by product type",
  "Access everything on mobile — even in low-network areas",
];

const MQ_ITEMS = [
  "LPG Sales Management",
  "Customer Ledger",
  "Udhari Tracking",
  "Delivery Management",
  "Stock Inventory",
  "Cashbook",
  "Business Reports",
  "Multi-User Access",
  "Works on Mobile",
  "Made for India",
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  IntersectFade Component                                                    */
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
/*  Scribble SVG                                                               */
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
/*  Interactive Explorer Body Simulations                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
interface PreviewProps {
  onSuccess: (msg: string) => void;
}

function SalesPreview({ onSuccess }: PreviewProps) {
  const [customer, setCustomer] = useState("Ramesh Patil");
  const [product, setProduct] = useState("14.2kg Domestic");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(950);
  const [paymentType, setPaymentType] = useState("Cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generated = {
        invoiceNo: "INV-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString("en-IN"),
        customer,
        product,
        qty,
        total: price * qty,
        paymentType,
      };
      setInvoice(generated);
      onSuccess(`Invoice ${generated.invoiceNo} recorded successfully!`);
    }, 1000);
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Record New Cylinder Sale</div>
          <div className="mock-subtitle">Create instant billing invoice entry</div>
        </div>
        {invoice && (
          <button className="mock-btn-sm mock-btn-secondary" onClick={() => setInvoice(null)}>
            ← New Bill
          </button>
        )}
      </div>

      {!invoice ? (
        <form onSubmit={handleSubmit} className="mock-card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div className="mock-form-group">
              <label className="mock-label">Select Customer</label>
              <select className="mock-select" value={customer} onChange={(e) => setCustomer(e.target.value)}>
                <option value="Ramesh Patil">Ramesh Patil (Bal: ₹950)</option>
                <option value="Sunita Sharma">Sunita Sharma (Bal: ₹0)</option>
                <option value="Amit Verma">Amit Verma (Bal: ₹1,200)</option>
                <option value="Pooja Singh">Pooja Singh (Bal: ₹0)</option>
              </select>
            </div>
            <div className="mock-form-group">
              <label className="mock-label">Cylinder Product</label>
              <select className="mock-select" value={product} onChange={(e) => {
                setProduct(e.target.value);
                setPrice(e.target.value.includes("19kg") ? 1850 : e.target.value.includes("5kg") ? 420 : 950);
              }}>
                <option value="14.2kg Domestic">14.2kg Domestic (₹950)</option>
                <option value="19kg Commercial">19kg Commercial (₹1850)</option>
                <option value="5kg Chotu">5kg Chotu (₹420)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div className="mock-form-group">
              <label className="mock-label">Quantity</label>
              <input type="number" min="1" className="mock-input" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </div>
            <div className="mock-form-group">
              <label className="mock-label">Price (₹)</label>
              <input type="number" className="mock-input" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div className="mock-form-group">
              <label className="mock-label">Payment Mode</label>
              <select className="mock-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Online (UPI)">Online (UPI)</option>
                <option value="Udhari (Credit)">Udhari (Credit)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>NET PAYABLE AMOUNT</div>
              <div style={{ fontSize: "20px", fontWeight: 900, color: "#f97316" }}>₹{(price * qty).toLocaleString("en-IN")}</div>
            </div>
            <button type="submit" disabled={isSubmitting} className="mock-btn-sm mock-btn-primary" style={{ padding: "12px 24px" }}>
              {isSubmitting ? "Generating Bill..." : "Create Bill & Save →"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mock-card" style={{ border: "2px dashed #f97316", background: "rgba(249, 115, 22, 0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(249,115,22,0.15)", paddingBottom: "12px", marginBottom: "14px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#f97316" }}>{invoice.invoiceNo}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Invoice Date: {invoice.date}</div>
            </div>
            <span className={`mock-badge ${invoice.paymentType.includes("Udhari") ? "mock-badge-danger" : "mock-badge-success"}`}>
              {invoice.paymentType.includes("Udhari") ? "Pending Credit" : "Paid"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Customer Details:</span>
              <strong style={{ color: "#f8fafc" }}>{invoice.customer}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Item / Cylinder Description:</span>
              <strong style={{ color: "#f8fafc" }}>{invoice.product}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Quantity × Rate:</span>
              <strong style={{ color: "#f8fafc" }}>{invoice.qty} × ₹{price}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid rgba(249,115,22,0.15)", paddingTop: "8px", marginTop: "4px" }}>
              <span style={{ fontWeight: 700 }}>Total Collected Balance:</span>
              <strong style={{ color: "#f97316", fontSize: "16px", fontWeight: 900 }}>₹{invoice.total.toLocaleString("en-IN")}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b" }}>
              <span>Payment Mode Used:</span>
              <span>{invoice.paymentType}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerPreview() {
  const [selectedCust, setSelectedCust] = useState("Ramesh");
  const data: Record<string, any> = {
    Ramesh: {
      name: "Ramesh Patil",
      phone: "+91 98450 12345",
      outstanding: "₹950",
      avatar: "RP",
      tx: [
        { date: "10 Jul 2026", desc: "14.2kg Refill", amt: "₹950", type: "Sales (Dr)", bal: "₹950" },
        { date: "05 Jul 2026", desc: "Payment Received", amt: "₹950", type: "Cash (Cr)", bal: "₹0" },
        { date: "01 Jul 2026", desc: "14.2kg Refill", amt: "₹950", type: "Sales (Dr)", bal: "₹950" },
      ],
    },
    Sunita: {
      name: "Sunita Sharma",
      phone: "+91 94480 98765",
      outstanding: "₹0",
      avatar: "SS",
      tx: [
        { date: "09 Jul 2026", desc: "Payment Received", amt: "₹1,850", type: "UPI (Cr)", bal: "₹0" },
        { date: "08 Jul 2026", desc: "19kg Commercial", amt: "₹1,850", type: "Sales (Dr)", bal: "₹1,850" },
      ],
    },
    Amit: {
      name: "Amit Verma",
      phone: "+91 88900 11223",
      outstanding: "₹1,200",
      avatar: "AV",
      tx: [
        { date: "11 Jul 2026", desc: "Regulator Delivery", amt: "₹250", type: "Sales (Dr)", bal: "₹1,200" },
        { date: "02 Jul 2026", desc: "14.2kg Refill", amt: "₹950", type: "Sales (Dr)", bal: "₹950" },
      ],
    },
  };

  const current = data[selectedCust] || data.Ramesh;

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Digital Customer Ledger</div>
          <div className="mock-subtitle">Select profile to view statement statement statement</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "16px" }}>
        {/* Customer tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.keys(data).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedCust(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "10px",
                border: "1.5px solid " + (selectedCust === key ? "#f97316" : "rgba(255,255,255,0.06)"),
                background: selectedCust === key ? "rgba(249,115,22,0.08)" : "#0b0f19",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: selectedCust === key ? "#f97316" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}>
                {data[key].avatar}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>{data[key].name}</div>
                <div style={{ fontSize: "11px", color: data[key].outstanding !== "₹0" ? "#fca5a5" : "#94a3b8", fontWeight: 600 }}>
                  {data[key].outstanding !== "₹0" ? "Owes: " + data[key].outstanding : "Settled"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Ledger view */}
        <div className="mock-card" style={{ padding: "16px" }}>
          <div style={{ borderBottom: "1.5px solid rgba(255,255,255,0.06)", paddingBottom: "10px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>{current.name}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Phone: {current.phone}</div>
          </div>

          <div className="mock-table-wrapper">
            <table className="mock-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {current.tx.map((t: any, index: number) => (
                  <tr key={index}>
                    <td>{t.date}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#f8fafc" }}>{t.desc}</div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>{t.type}</div>
                    </td>
                    <td style={{ color: t.type.includes("Dr") ? "#fca5a5" : "#4ade80", fontWeight: 700 }}>
                      {t.type.includes("Dr") ? "+" : "-"}{t.amt}
                    </td>
                    <td style={{ fontWeight: 700, color: "#cbd5e1" }}>{t.bal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function UdhariPreview({ onSuccess }: PreviewProps) {
  const [remindedList, setRemindedList] = useState<string[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({
    "Ramesh Patil": 950,
    "Amit Verma": 1200,
    "Sanjay Kadam": 2400,
  });

  const sendReminder = (name: string) => {
    if (remindedList.includes(name)) return;
    setRemindedList([...remindedList, name]);
    onSuccess(`WhatsApp payment reminder sent to ${name}!`);
  };

  const collectPayment = (name: string) => {
    if (balances[name] === 0) return;
    const oldVal = balances[name];
    setBalances({ ...balances, [name]: 0 });
    onSuccess(`Collected ₹${oldVal} payment from ${name}. Ledger balance updated to ₹0.`);
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Active Outstanding Credits (Udhari)</div>
          <div className="mock-subtitle">Collect pending dues or send WhatsApp notifications</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Object.entries(balances).map(([name, bal]) => (
          <div key={name} className="mock-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>{name}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Pending collection ledger ledger</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>OUTSTANDING DUES</div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: bal > 0 ? "#fca5a5" : "#4ade80" }}>
                  ₹{bal.toLocaleString("en-IN")}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="mock-btn-sm mock-btn-secondary"
                  disabled={bal === 0}
                  onClick={() => sendReminder(name)}
                  style={{ opacity: bal === 0 ? 0.5 : 1 }}
                >
                  {remindedList.includes(name) ? "Sent ✓" : "Remind 💬"}
                </button>
                <button
                  className="mock-btn-sm mock-btn-primary"
                  disabled={bal === 0}
                  onClick={() => collectPayment(name)}
                  style={{ background: bal === 0 ? "rgba(255,255,255,0.06)" : "#22c55e", color: bal === 0 ? "#64748b" : "#ffffff" }}
                >
                  {bal === 0 ? "Collected ✓" : "Collect Cash"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CashbookPreview({ onSuccess }: PreviewProps) {
  const [tab, setTab] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [particulars, setParticulars] = useState("");
  const [logs, setLogs] = useState([
    { date: "Today, 12:45 PM", desc: "Refill delivery (Ramesh Patil)", amt: "₹950", type: "in" },
    { date: "Today, 11:30 AM", desc: "Diesel for transport truck", amt: "₹1,200", type: "out" },
    { date: "Today, 09:15 AM", desc: "Cash collected (Amit Verma)", amt: "₹950", type: "in" },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const cleanAmt = Number(amount);
    const newLog = {
      date: "Just now",
      desc: particulars || (tab === "in" ? "Direct cash inflow entry" : "Direct expense outflow entry"),
      amt: `₹${cleanAmt.toLocaleString("en-IN")}`,
      type: tab,
    };
    setLogs([newLog, ...logs]);
    setAmount("");
    setParticulars("");
    onSuccess(`Added cash ${tab === "in" ? "inflow" : "outflow"} of ₹${cleanAmt.toLocaleString("en-IN")}`);
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Daily Cashbook Log</div>
          <div className="mock-subtitle">Record direct expenses and cash collections</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "16px" }}>
        <form onSubmit={handleAdd} className="mock-card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", gap: "4px", background: "#070a12", padding: "3px", borderRadius: "8px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="button"
              onClick={() => setTab("in")}
              style={{
                flex: 1,
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                background: tab === "in" ? "#22c55e" : "transparent",
                color: tab === "in" ? "#ffffff" : "#94a3b8",
                transition: "all 0.2s",
              }}
            >
              Cash In (+)
            </button>
            <button
              type="button"
              onClick={() => setTab("out")}
              style={{
                flex: 1,
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                background: tab === "out" ? "#ef4444" : "transparent",
                color: tab === "out" ? "#ffffff" : "#94a3b8",
                transition: "all 0.2s",
              }}
            >
              Cash Out (-)
            </button>
          </div>

          <div className="mock-form-group">
            <label className="mock-label">Amount (₹)</label>
            <input type="number" required placeholder="e.g. 500" className="mock-input" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="mock-form-group" style={{ marginBottom: "16px" }}>
            <label className="mock-label">Particulars (Description)</label>
            <input type="text" placeholder="e.g. Office tea expense" className="mock-input" value={particulars} onChange={(e) => setParticulars(e.target.value)} />
          </div>

          <button
            type="submit"
            className="mock-btn-sm mock-btn-primary"
            style={{ width: "100%", justifyContent: "center", background: tab === "in" ? "#22c55e" : "#ef4444", padding: "10px" }}
          >
            Add Cash {tab === "in" ? "In" : "Out"} Entry
          </button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {logs.map((log, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0b0f19", border: "1.5px solid rgba(255,255,255,0.06)", padding: "10px 14px", borderRadius: "10px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}>{log.desc}</div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{log.date}</div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: log.type === "in" ? "#4ade80" : "#fca5a5" }}>
                {log.type === "in" ? "+" : "-"}{log.amt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryPreview({ onSuccess }: PreviewProps) {
  const [deliveries, setDeliveries] = useState([
    { id: "B-2051", customer: "Ramesh Patil", address: "Sector 4, Plot 12", boy: "Amit K.", status: "Pending" },
    { id: "B-2052", customer: "Sanjay Kadam", address: "Ganesh Nagar Lane 3", boy: "None", status: "Unassigned" },
    { id: "B-2053", customer: "Pooja Singh", address: "Star Towers Flat 402", boy: "Vijay M.", status: "Delivered" },
  ]);

  const handleAssign = (id: string, name: string) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, boy: name, status: "Out for Delivery" } : d));
    onSuccess(`Assigned order ${id} to delivery staff ${name}! Status: Out for Delivery.`);
  };

  const handleComplete = (id: string) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: "Delivered" } : d));
    onSuccess(`Marked delivery order ${id} as completed successfully!`);
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Delivery Boy Dispatcher</div>
          <div className="mock-subtitle">Assign bookings and track shipment statuses</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {deliveries.map((d) => (
          <div key={d.id} className="mock-card" style={{ padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#3b82f6" }}>{d.id}</span>
                <span className={`mock-badge ${d.status === "Delivered" ? "mock-badge-success" : d.status === "Pending" ? "mock-badge-warning" : d.status.includes("Out") ? "mock-badge-info" : "mock-badge-danger"}`}>
                  {d.status}
                </span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>{d.customer}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Addr: {d.address}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textTransform: "none", fontSize: "11px", textAlign: "right" }}>
                <div style={{ color: "#64748b", fontWeight: 700 }}>STAFF MEMBER</div>
                <div style={{ fontWeight: 700, color: d.boy === "None" ? "#fca5a5" : "#cbd5e1" }}>{d.boy}</div>
              </div>

              <div>
                {d.status === "Unassigned" ? (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button className="mock-btn-sm mock-btn-secondary" style={{ padding: "6px 10px" }} onClick={() => handleAssign(d.id, "Amit K.")}>Assign Amit</button>
                    <button className="mock-btn-sm mock-btn-secondary" style={{ padding: "6px 10px" }} onClick={() => handleAssign(d.id, "Vijay M.")}>Assign Vijay</button>
                  </div>
                ) : d.status !== "Delivered" ? (
                  <button className="mock-btn-sm mock-btn-primary" style={{ background: "#22c55e" }} onClick={() => handleComplete(d.id)}>
                    Mark Delivered
                  </button>
                ) : (
                  <span style={{ fontSize: "20px" }}>✅</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StockPreview({ onSuccess }: PreviewProps) {
  const [stocks, setStocks] = useState<Record<string, number>>({
    "14.2kg Domestic": 142,
    "19kg Commercial": 8,
    "5kg Chotu Refill": 45,
  });

  const adjustStock = (name: string, diff: number) => {
    const nextVal = Math.max(0, stocks[name] + diff);
    setStocks({ ...stocks, [name]: nextVal });
    if (diff > 0) {
      onSuccess(`Added +${diff} refills to ${name} stock inventory.`);
    } else {
      onSuccess(`Dispatched cylinder: ${name} stock level decreased.`);
    }
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Real-time Stock Monitor</div>
          <div className="mock-subtitle">Current physical cylinder stock counts</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Object.entries(stocks).map(([name, val]) => (
          <div key={name} className="mock-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>{name}</div>
              <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                {val <= 10 && <span className="mock-badge mock-badge-danger">Low Stock Alert</span>}
                <span className="mock-badge mock-badge-info">Cylinders</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ textTransform: "none", fontSize: "11px", textAlign: "right" }}>
                <div style={{ color: "#64748b", fontWeight: 700 }}>AVAILABLE STOCK</div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: val <= 10 ? "#fca5a5" : "#3b82f6" }}>{val}</div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button className="mock-btn-sm mock-btn-secondary" style={{ padding: "8px 12px", fontSize: "14px" }} onClick={() => adjustStock(name, -1)}><Minus style={{ width: "12px", height: "12px" }} /></button>
                <button className="mock-btn-sm mock-btn-secondary" style={{ padding: "8px 12px", fontSize: "14px" }} onClick={() => adjustStock(name, 1)}><Plus style={{ width: "12px", height: "12px" }} /></button>
                <button className="mock-btn-sm mock-btn-primary" style={{ padding: "6px 12px" }} onClick={() => adjustStock(name, 50)}>+50 Refills</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InflowPreview() {
  const [view, setView] = useState<"inflow" | "outflow">("inflow");

  const inflowData = [
    { desc: "Sales cash collection (Ramesh Patil)", amt: "+₹950", mode: "Cash", date: "Today" },
    { desc: "Online advance refill (Sunita Sharma)", amt: "+₹1,850", mode: "Online UPI", date: "Today" },
    { desc: "Udhari deposit collected (Amit Verma)", amt: "+₹950", mode: "Cash", date: "Yesterday" },
  ];

  const outflowData = [
    { desc: "Purchase refill stock (BPCL depot)", amt: "-₹28,400", mode: "Bank RTGS", date: "Today" },
    { desc: "Truck diesel refill expense", amt: "-₹1,200", mode: "Cash", date: "Today" },
    { desc: "Staff delivery commission payout", amt: "-₹850", mode: "Cash", date: "Yesterday" },
  ];

  const current = view === "inflow" ? inflowData : outflowData;

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Payment Inflows & Outflows</div>
          <div className="mock-subtitle">Separately audit income collections vs agency expenses</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px", background: "#0b0f19", padding: "3px", borderRadius: "8px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          type="button"
          onClick={() => setView("inflow")}
          style={{
            flex: 1,
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            background: view === "inflow" ? "#22c55e" : "transparent",
            color: view === "inflow" ? "#ffffff" : "#94a3b8",
            transition: "all 0.2s",
          }}
        >
          Customer Inflows (Income Receipts)
        </button>
        <button
          type="button"
          onClick={() => setView("outflow")}
          style={{
            flex: 1,
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            background: view === "outflow" ? "#ef4444" : "transparent",
            color: view === "outflow" ? "#ffffff" : "#94a3b8",
            transition: "all 0.2s",
          }}
        >
          Supplier & Expense Outflows (Debit)
        </button>
      </div>

      <div className="mock-table-wrapper">
        <table className="mock-table">
          <thead>
            <tr>
              <th>Particulars</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {current.map((t, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: "#f8fafc" }}>{t.desc}</td>
                <td>{t.date}</td>
                <td><span className="mock-badge mock-badge-info" style={{ background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }}>{t.mode}</span></td>
                <td style={{ color: view === "inflow" ? "#4ade80" : "#fca5a5", fontWeight: 800, fontSize: "14px" }}>
                  {t.amt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsPreview({ onSuccess }: PreviewProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setProgress(0);
    let currentPrg = 0;
    const interval = setInterval(() => {
      currentPrg += 10;
      setProgress(currentPrg);
      if (currentPrg >= 100) {
        clearInterval(interval);
        setDownloading(false);
        onSuccess("Sales report PDF downloaded successfully!");
      }
    }, 150);
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Agency Reports & Analytics</div>
          <div className="mock-subtitle">Generate business statements in one click</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px", marginBottom: "16px" }}>
        <div className="mock-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "12px" }}>SALES REVENUE OVERVIEW</div>
          {/* Mock Chart Graphic */}
          <div style={{ height: "140px", display: "flex", alignItems: "flex-end", gap: "14px", borderBottom: "1.5px solid rgba(255,255,255,0.08)", paddingBottom: "10px", paddingLeft: "10px" }}>
            <div style={{ flex: 1, height: "40%", background: "rgba(255,255,255,0.1)", borderRadius: "4px 4px 0 0" }}></div>
            <div style={{ flex: 1, height: "65%", background: "rgba(255,255,255,0.1)", borderRadius: "4px 4px 0 0" }}></div>
            <div style={{ flex: 1, height: "85%", background: "#f97316", borderRadius: "4px 4px 0 0" }}></div>
            <div style={{ flex: 1, height: "55%", background: "rgba(255,255,255,0.1)", borderRadius: "4px 4px 0 0" }}></div>
            <div style={{ flex: 1, height: "95%", background: "#3b82f6", borderRadius: "4px 4px 0 0" }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#64748b", marginTop: "6px", fontWeight: 700 }}>
            <span>MAY</span>
            <span>JUN</span>
            <span>JUL (TODAY)</span>
            <span>AUG</span>
            <span>SEP</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
          <button className="mock-btn-sm mock-btn-primary" style={{ padding: "14px", justifyContent: "center" }} onClick={startDownload}>
            <Download style={{ width: "14px", height: "14px" }} /> Download Sales PDF
          </button>
          <button className="mock-btn-sm mock-btn-secondary" style={{ padding: "14px", justifyContent: "center" }} onClick={startDownload}>
            Export to Excel
          </button>
        </div>
      </div>

      {downloading && (
        <div style={{ background: "#0b0f19", border: "1.5px solid rgba(255,255,255,0.06)", padding: "14px", borderRadius: "10px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>
            <span>Compiling database query queries...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#f97316", transition: "width 0.15s" }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersPreview({ onSuccess }: PreviewProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "manager" | "delivery">("admin");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    viewSales: true,
    createBills: true,
    deleteTransactions: true,
    viewProfitLoss: true,
  });

  const togglePermission = (key: string) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
    onSuccess("Staff capability permissions toggled successfully.");
  };

  const handleRoleChange = (role: "admin" | "manager" | "delivery") => {
    setSelectedRole(role);
    if (role === "admin") {
      setPermissions({ viewSales: true, createBills: true, deleteTransactions: true, viewProfitLoss: true });
    } else if (role === "manager") {
      setPermissions({ viewSales: true, createBills: true, deleteTransactions: false, viewProfitLoss: true });
    } else {
      setPermissions({ viewSales: true, createBills: true, deleteTransactions: false, viewProfitLoss: false });
    }
  };

  return (
    <div style={{ animation: "cardIn 0.4s ease both" }}>
      <div className="mock-header">
        <div>
          <div className="mock-title">Staff Permission Roles</div>
          <div className="mock-subtitle">Assign select security access constraints</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>SELECT STAFF USER PROFILE</div>
          <button
            onClick={() => handleRoleChange("admin")}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid " + (selectedRole === "admin" ? "#f97316" : "rgba(255,255,255,0.06)"),
              background: selectedRole === "admin" ? "rgba(249,115,22,0.08)" : "#0b0f19",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong style={{ color: "#f8fafc" }}>Rajesh Patil</strong>
            <div style={{ fontSize: "11px", color: "#f97316", fontWeight: 700 }}>Role: Administrator</div>
          </button>
          <button
            onClick={() => handleRoleChange("manager")}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid " + (selectedRole === "manager" ? "#f97316" : "rgba(255,255,255,0.06)"),
              background: selectedRole === "manager" ? "rgba(249,115,22,0.08)" : "#0b0f19",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong style={{ color: "#f8fafc" }}>Sunita Sharma</strong>
            <div style={{ fontSize: "11px", color: "#3b82f6", fontWeight: 700 }}>Role: Agency Manager</div>
          </button>
          <button
            onClick={() => handleRoleChange("delivery")}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid " + (selectedRole === "delivery" ? "#f97316" : "rgba(255,255,255,0.06)"),
              background: selectedRole === "delivery" ? "rgba(249,115,22,0.08)" : "#0b0f19",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <strong style={{ color: "#f8fafc" }}>Amit Kumar</strong>
            <div style={{ fontSize: "11px", color: "#4ade80", fontWeight: 700 }}>Role: Delivery Agent</div>
          </button>
        </div>

        <div className="mock-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "12px" }}>PERMITTED CAPABILITIES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#cbd5e1" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
              <input type="checkbox" checked={permissions.viewSales} onChange={() => togglePermission("viewSales")} />
              View Sales & Ledger Reports
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
              <input type="checkbox" checked={permissions.createBills} onChange={() => togglePermission("createBills")} />
              Create & Print Invoice Bills
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
              <input type="checkbox" checked={permissions.deleteTransactions} onChange={() => togglePermission("deleteTransactions")} />
              Delete Ledger Payments
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
              <input type="checkbox" checked={permissions.viewProfitLoss} onChange={() => togglePermission("viewProfitLoss")} />
              View Profit & Loss Statements
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LandingPage Main Component                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3000);
  };

  useEffect(() => {
    document.body.classList.add("lp-body");
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => { document.body.classList.remove("lp-body"); window.removeEventListener("scroll", fn); };
  }, []);

  const renderActivePreview = () => {
    switch (activeFeature) {
      case 0:
        return <SalesPreview onSuccess={showToast} />;
      case 1:
        return <CustomerPreview />;
      case 2:
        return <UdhariPreview onSuccess={showToast} />;
      case 3:
        return <CashbookPreview onSuccess={showToast} />;
      case 4:
        return <DeliveryPreview onSuccess={showToast} />;
      case 5:
        return <StockPreview onSuccess={showToast} />;
      case 6:
        return <InflowPreview />;
      case 7:
        return <ReportsPreview onSuccess={showToast} />;
      case 8:
        return <UsersPreview onSuccess={showToast} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Grid Pattern Background */}
      <div className="grid-pattern" />

      {/* ── Toast Notification System ──────────────── */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          background: "#0f172a",
          border: "1.5px solid rgba(255, 255, 255, 0.08)",
          color: "#ffffff",
          padding: "14px 20px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          fontSize: "13px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "cardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}>
          <Sparkles style={{ width: "16px", height: "16px", color: "#f97316" }} />
          {toastMessage}
        </div>
      )}

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
        <div className="doodle-br" style={{ bottom: 60, right: 20 }}><DoodleStars size={80} color="#3b82f6" /></div>

        <div className="hero-inner">
          {/* Left */}
          <div>
            <div className="hero-badge">
              <Sparkles style={{ width: "12px", height: "12px", color: "#fb923c" }} /> Built for India's LPG Agencies
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
                <Play style={{ width: "16px", height: "16px", fill: "currentColor" }} />
                See App Preview
              </a>
            </div>

            <div className="trust-row">
              <div className="trust-badge"><ShieldCheck className="trust-icon" style={{ width: "16px", height: "16px" }} /> 100% Secure Data</div>
              <div className="trust-badge"><Smartphone className="trust-icon" style={{ width: "16px", height: "16px" }} /> Works Offline</div>
              <div className="trust-badge"><Smartphone className="trust-icon" style={{ width: "16px", height: "16px" }} /> Any Device</div>
            </div>
          </div>

          {/* Right — dashboard screenshot */}
          <div className="hero-right">
            {/* Scribble circle behind card */}
            <svg style={{ position: "absolute", top: -30, right: -30, opacity: .12, pointerEvents: "none", zIndex: 0 }}
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
              <div className="mc-icon" style={{ background: "rgba(249,115,22,0.15)" }}>
                <TrendingUp style={{ width: "16px", height: "16px", color: "#f97316" }} />
              </div>
              <div><div className="mc-label">Today's Collection</div><div className="mc-val">₹24,580</div></div>
            </div>
            <div className="hero-mini-card" style={{ bottom: 80, left: -24, animationDelay: ".6s" }}>
              <div className="mc-icon" style={{ background: "rgba(239, 68, 68, 0.15)" }}>
                <Wallet style={{ width: "16px", height: "16px", color: "#fca5a5" }} />
              </div>
              <div><div className="mc-label">Pending Udhari</div><div className="mc-val" style={{ color: "#fca5a5" }}>₹8,240</div></div>
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

      {/* ── Features Explorer Section ──────────────── */}
      <section className="lp-section" id="features" style={{ background: "#090d16" }}>
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
                Click any capability below to interact with it and see exactly how our dashboard handles your daily workloads.
              </p>
            </div>
          </Fade>

          <div className="explorer-layout">
            {/* Left Tabs */}
            <div className="explorer-tabs">
              {FEATURES.map((f, i) => (
                <button
                  key={i}
                  className={`explorer-tab-btn ${activeFeature === i ? "active" : ""}`}
                  onClick={() => setActiveFeature(i)}
                >
                  <div className="explorer-tab-icon" style={{ background: f.bg }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="explorer-tab-title">{f.title}</div>
                    <div className="explorer-tab-desc">{f.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Interactive Mock Screen */}
            <div className="explorer-screen">
              <div className="explorer-screen-header">
                <div className="browser-dots">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="browser-address">
                  {FEATURES[activeFeature].url}
                </div>
                <div style={{ width: "40px" }} /> {/* spacer */}
              </div>
              <div className="explorer-screen-body">
                {renderActivePreview()}
              </div>
            </div>
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
                  <li key={i}><div className="pb-check"><CheckCircle2 style={{ width: "14px", height: "14px" }} /></div>{b}</li>
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
      <section className="lp-section" id="how" style={{ background: "#090d16" }}>
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
                  <div className="hiw-num">{s.icon}</div>
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
          <DoodleStars size={70} color="#3b82f6" />
        </div>

        {/* Scribble wave */}
        <svg style={{ position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: 6, opacity: .2 }}
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
