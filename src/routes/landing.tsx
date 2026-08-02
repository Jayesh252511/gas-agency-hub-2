import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
const useClientEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const Route = createFileRoute("/landing")({ component: LandingPage });

/* ─── ICONS (Clean minimal SVG icons) ─────────────────────────────────────── */
const I = {
  Shield:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Mobile:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/></svg>,
  Cloud:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 10a6 6 0 00-12 0A4 4 0 006 18h12a4 4 0 000-8z"/></svg>,
  Globe:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  Arrow:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Play:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
  Check:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Trend:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Users:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Wallet:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a1 1 0 100 2 1 1 0 000-2z" fill="currentColor" stroke="none"/></svg>,
  Card:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Truck:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Box:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Swap:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  Bar:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Lock:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  File:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Plus:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Flame:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c0 0-5 5.5-5 10a5 5 0 0010 0c0-2-1-4-2-5.5C14 8 13 9 13 10.5c0 1-.5 1.5-1 1.5-.8 0-1.5-.7-1-2C11.5 8.5 12 5.5 12 2z" fill="currentColor" stroke="none" fillOpacity="0.95"/></svg>,
  Crosshair:() => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="1" y1="12" x2="23" y2="12"/></svg>,
};

/* ─── NOTHING / TEENAGE ENGINEERING SWISS EDITORIAL CSS SYSTEM ───────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #FAFAFA;
    --bg-subtle:   #F3F3F3;
    --surface:     #FFFFFF;
    --border:      #E8E8E8;
    --border-dark: #D4D4D4;
    --text:        #111111;
    --text-sub:    #666666;
    --text-lo:     #999999;
    --orange:      #FF6B00;
    --orange-light:rgba(255, 107, 0, 0.08);
    --orange-glow: rgba(255, 107, 0, 0.2);
    --green:       #10B981;
    --red:         #EF4444;
    --font-pixel:  'Silkscreen', 'JetBrains Mono', monospace;
    --font-head:   'Space Grotesk', 'Inter', sans-serif;
    --font-body:   'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono:   'JetBrains Mono', monospace;
  }

  html, body {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #FAFAFA !important;
    color: #111111 !important;
  }

  .lp-page-wrapper {
    font-family: var(--font-body);
    background-color: #FAFAFA !important;
    color: #111111 !important;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    z-index: 1;
  }

  /* Dot Matrix & Engineering Grid overlay */
  .lp-page-wrapper::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      radial-gradient(#D6D6D6 1px, transparent 1px),
      linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
    background-size: 24px 24px, 120px 120px, 120px 120px;
    opacity: 0.85;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #FAFAFA; }
  ::-webkit-scrollbar-thumb { background: #FF6B00; border-radius: 2px; }

  /* Technical Custom Cursor */
  .cur {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 6px; height: 6px; border-radius: 1px;
    background: var(--orange);
    transform: translate(-50%,-50%);
    transition: width .15s, height .15s, opacity .15s;
  }
  .cur-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px dashed rgba(255,107,0,0.4);
    transform: translate(-50%,-50%);
    transition: width .3s cubic-bezier(.16,1,.3,1), height .3s cubic-bezier(.16,1,.3,1), border-color .2s;
  }
  .cur.h { width: 10px; height: 10px; background: var(--text); }
  .cur-ring.h { width: 44px; height: 44px; border-color: var(--orange); border-style: solid; }

  /* Keyframes */
  @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-12px) rotate(1deg);} }
  @keyframes pulseSubtle { 0%,100%{opacity:.7;} 50%{opacity:1;} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes cardIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
  @keyframes truckDrive { 0%{transform:translateX(-120px);} 100%{transform:translateX(calc(100vw + 120px));} }
  @keyframes pixelBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes pixelFloat { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-8px);} }
  @keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
  }

  /* ── NAVIGATION BAR ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    transition: background .3s, border .3s;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: rgba(250,250,250,0.85);
    backdrop-filter: blur(16px) saturate(160%);
  }
  .nav.on {
    background: rgba(250,250,250,0.96);
    border-bottom-color: var(--border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }
  .nav-inner {
    max-width: 1400px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px;
  }
  .nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .nav-brand-mark {
    width: 32px; height: 32px; border-radius: 6px;
    background: var(--orange); color: #FFFFFF; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 10px rgba(255,107,0,0.25);
  }
  .nav-brand-name { font-family: var(--font-pixel); font-weight: 700; font-size: 13px; letter-spacing: -.02em; color: var(--text); }
  .nav-brand-sub  { font-family: var(--font-mono); font-size: 9px; color: var(--text-sub); font-weight: 500; letter-spacing: .08em; text-transform: uppercase; margin-top: 1px; }

  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--text-sub); text-decoration: none; letter-spacing: .06em; text-transform: uppercase; transition: color .2s; }
  .nav-links a:hover { color: var(--orange); }

  .nav-actions { display: flex; gap: 10px; align-items: center; }
  .btn-gl {
    padding: 8px 18px; border-radius: 8px; font-family: var(--font-mono); font-size: 11px; font-weight: 600;
    color: var(--text); border: 1px solid var(--border); background: var(--surface);
    text-decoration: none; transition: all .2s; letter-spacing: .04em; text-transform: uppercase;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }
  .btn-gl:hover { border-color: var(--text); color: var(--text); transform: translateY(-1px); }

  .btn-fire {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 20px; border-radius: 8px; font-family: var(--font-mono); font-size: 11px; font-weight: 700;
    color: #FFFFFF; background: var(--orange); border: 1px solid var(--orange); text-decoration: none;
    letter-spacing: .04em; text-transform: uppercase;
    transition: all .25s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 4px 14px rgba(255,107,0,0.28);
  }
  .btn-fire:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,107,0,0.38); }

  .mob-toggle { display: none; background: none; border: none; cursor: pointer; }
  .mob-toggle span { display: block; width: 20px; height: 1.5px; background: var(--text); margin: 5px 0; transition: all .3s; }

  /* ── MOBILE DRAWER ── */
  .mob-drawer { display: none; position: fixed; inset: 0; z-index: 900; background: rgba(250,250,250,0.98); backdrop-filter: blur(24px); flex-direction: column; align-items: flex-start; justify-content: center; padding: 0 40px; gap: 28px; }
  .mob-drawer.open { display: flex; }
  .mob-drawer a { font-family: var(--font-pixel); font-size: 20px; font-weight: 700; color: var(--text); text-decoration: none; }
  .mob-close { position: absolute; top: 24px; right: 24px; width: 40px; height: 40px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text); background: var(--surface); border-radius: 10px; font-size: 16px; }

  /* ── HERO SECTION ── */
  .hero {
    position: relative; min-height: 820px; height: 100vh;
    display: grid; grid-template-columns: 52% 48%;
    overflow: hidden; z-index: 1;
    padding-top: 90px;
    max-width: 1400px; margin: 0 auto;
  }

  .hero-left {
    display: flex; flex-direction: column; justify-content: center;
    padding: 40px 6% 60px 8%; position: relative; z-index: 2;
  }

  .hero-tech-tag {
    display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px;
    font-family: var(--font-mono); font-size: 10px; font-weight: 600;
    color: var(--orange); letter-spacing: .16em; text-transform: uppercase;
    background: var(--orange-light); border: 1px solid rgba(255,107,0,0.2);
    padding: 5px 12px; border-radius: 9999px; width: fit-content;
  }
  .hero-tech-tag::before { content: '●'; font-size: 8px; color: var(--orange); }

  .hero-h1 {
    font-family: var(--font-head); font-weight: 700;
    font-size: clamp(38px, 4.8vw, 68px); line-height: 1.05;
    letter-spacing: -.03em; color: var(--text);
    margin-bottom: 24px;
  }
  .hero-h1 span.pixel-accent {
    font-family: var(--font-pixel); color: var(--orange); display: block; margin-top: 4px;
  }

  .hero-desc {
    font-size: 15px; color: var(--text-sub); line-height: 1.7;
    max-width: 440px; margin-bottom: 36px; font-weight: 400;
  }

  .hero-actions {
    display: flex; gap: 14px; margin-bottom: 44px; align-items: center;
  }
  .btn-hero-lg {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 12px; font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    color: #FFFFFF; background: var(--orange); border: 1px solid var(--orange); text-decoration: none;
    letter-spacing: .04em; text-transform: uppercase;
    transition: all .3s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 4px 20px rgba(255,107,0,0.28);
  }
  .btn-hero-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,107,0,0.4); }

  .btn-hero-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 26px; border-radius: 12px; font-family: var(--font-mono); font-size: 12px; font-weight: 600;
    color: var(--text); border: 1px solid var(--border); background: var(--surface);
    text-decoration: none; letter-spacing: .04em; text-transform: uppercase;
    transition: all .25s; box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .btn-hero-ghost:hover { border-color: var(--text); transform: translateY(-1px); }

  /* Trust Row Hardware Badges */
  .hero-trust {
    display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .trust-pill {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 10px; font-weight: 600;
    color: var(--text-sub); letter-spacing: .06em; text-transform: uppercase;
    background: var(--surface); border: 1px solid var(--border); padding: 6px 12px; border-radius: 8px;
  }
  .trust-pill svg { color: var(--orange); }

  /* Hero Right — Studio Exhibition Stage */
  .hero-right {
    position: relative; z-index: 2; display: flex; align-items: center; justify-content: center;
  }

  .cyl-stage {
    position: relative; width: 340px; text-align: center;
  }
  .cyl-img {
    width: 100%; display: block; margin: 0 auto;
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.08));
    animation: floatSlow 8s ease-in-out infinite;
    position: relative; z-index: 2;
  }
  .cyl-pedestal {
    display: block; margin: -18px auto 0;
    width: 240px; height: 14px;
    background: radial-gradient(ellipse 80% 100%, rgba(255,107,0,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  /* Hardware HMI Stat Cards */
  .hmi-card {
    position: absolute; z-index: 4;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 16px 20px; min-width: 190px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    transition: transform .3s;
  }
  .hmi-card:hover { transform: translateY(-3px); border-color: var(--border-dark); }
  .hmi-label {
    font-family: var(--font-mono); font-size: 9px; font-weight: 600;
    color: var(--text-sub); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .hmi-value {
    font-family: var(--font-mono); font-size: 22px; font-weight: 700;
    color: var(--text); line-height: 1;
  }
  .hmi-sub { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-lo); margin-top: 5px; }

  /* Tech Blueprint Callout Tag */
  .tech-callout {
    position: absolute; left: -20px; top: 35%; z-index: 3;
    font-family: var(--font-mono); font-size: 9px; color: var(--text-sub);
    background: var(--surface); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.03);
  }

  /* ── MARQUEE SYSTEM ── */
  .marquee-wrap {
    overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    background: var(--surface); position: relative; z-index: 2; padding: 14px 0;
  }
  .marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
  .marquee-item {
    display: flex; align-items: center; gap: 10px; padding: 0 28px;
    font-family: var(--font-mono); font-size: 10px; font-weight: 600;
    color: var(--text-sub); letter-spacing: .12em; text-transform: uppercase;
    border-right: 1px solid var(--border); white-space: nowrap;
  }
  .marquee-item-dot { width: 4px; height: 4px; border-radius: 1px; background: var(--orange); flex-shrink: 0; }

  /* ── SECTION BASE ── */
  .sec { padding: 120px 0; position: relative; z-index: 1; }
  .sec-inner { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
  .sec-num {
    font-family: var(--font-mono); font-size: 10px; font-weight: 700;
    color: var(--orange); letter-spacing: .16em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
    background: var(--orange-light); border: 1px solid rgba(255,107,0,0.18);
    padding: 4px 12px; border-radius: 9999px; width: fit-content;
  }
  .sec-h {
    font-family: var(--font-head); font-weight: 700;
    font-size: clamp(32px, 3.8vw, 52px); line-height: 1.08;
    letter-spacing: -.03em; color: var(--text); margin-bottom: 16px;
  }
  .sec-h span.pixel-accent { font-family: var(--font-pixel); color: var(--orange); }
  .sec-p { font-size: 15px; color: var(--text-sub); line-height: 1.7; max-width: 500px; }

  /* ── INTERACTIVE EDITORIAL WORKBENCH (NOTION / LINEAR HARDWARE STYLE) ── */
  .feat-tabs-strip {
    display: flex; border: 1px solid var(--border); border-radius: 18px 18px 0 0; overflow-x: auto;
    background: var(--bg-subtle); border-bottom: none;
  }
  .feat-tab {
    flex: 1; min-width: 120px; padding: 16px 14px; cursor: pointer; transition: all .2s;
    border-right: 1px solid var(--border); background: transparent; border-top: none; border-bottom: none; border-left: none;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    position: relative;
  }
  .feat-tab:last-child { border-right: none; }
  .feat-tab::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 2.5px; background: var(--orange); transform: scaleX(0); transition: transform .25s;
  }
  .feat-tab.act::after { transform: scaleX(1); }
  .feat-tab.act { background: var(--surface); }
  .feat-tab-icon { color: var(--text-sub); transition: color .2s; }
  .feat-tab.act .feat-tab-icon, .feat-tab:hover .feat-tab-icon { color: var(--orange); }
  .feat-tab-label {
    font-family: var(--font-mono); font-size: 9px; font-weight: 600;
    color: var(--text-sub); letter-spacing: .08em; text-transform: uppercase;
    transition: color .2s; text-align: center; line-height: 1.3;
  }
  .feat-tab.act .feat-tab-label { color: var(--text); }

  .feat-panel {
    border: 1px solid var(--border); border-radius: 0 0 18px 18px; background: var(--surface);
    position: relative; overflow: hidden;
    display: grid; grid-template-columns: 1fr 1.6fr;
    box-shadow: 0 12px 40px rgba(0,0,0,0.03);
  }
  .feat-panel-info {
    padding: 44px 40px; border-right: 1px solid var(--border);
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .feat-panel-tag {
    font-family: var(--font-mono); font-size: 10px; font-weight: 600;
    color: var(--orange); letter-spacing: .14em; text-transform: uppercase;
    display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
  }
  .feat-panel-title { font-family: var(--font-head); font-size: 24px; font-weight: 700; line-height: 1.2; letter-spacing: -.02em; margin-bottom: 14px; color: var(--text); }
  .feat-panel-desc { font-size: 14px; color: var(--text-sub); line-height: 1.7; }
  .feat-panel-url { font-family: var(--font-mono); font-size: 10px; color: var(--text-lo); margin-top: 24px; display: flex; align-items: center; gap: 8px; }
  .feat-panel-url-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

  .feat-panel-mock {
    background: var(--bg-subtle); overflow-y: auto; max-height: 540px; padding: 28px;
  }

  /* Mock App Primitives (Clean Linear/Notion Hardware Style) */
  .mk-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .mk-t { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text); }
  .mk-s { font-size: 11px; color: var(--text-sub); margin-top: 2px; font-family: var(--font-mono); }
  .mk-btn { padding: 8px 16px; font-size: 11px; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); letter-spacing: .04em; text-transform: uppercase; }
  .mk-btn-p { background: var(--orange); color: #FFFFFF; box-shadow: 0 2px 8px rgba(255,107,0,0.25); }
  .mk-btn-p:hover { background: #E56000; }
  .mk-btn-s { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .mk-btn-s:hover { border-color: var(--text); }

  .mk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap: 10px; margin-bottom: 16px; }
  .mk-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
  .mk-stat-l { font-family: var(--font-mono); font-size: 9px; color: var(--text-sub); text-transform: uppercase; letter-spacing: .08em; }
  .mk-stat-v { font-family: var(--font-mono); font-size: 18px; font-weight: 700; margin-top: 6px; color: var(--text); }

  .mk-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .mk-tw { overflow-x: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
  .mk-table { width: 100%; border-collapse: collapse; min-width: 420px; }
  .mk-table th { background: var(--bg-subtle); padding: 10px 14px; text-align: left; font-family: var(--font-mono); font-size: 9px; color: var(--text-sub); text-transform: uppercase; letter-spacing: .08em; border-bottom: 1px solid var(--border); }
  .mk-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text); }
  .mk-table tr:last-child td { border-bottom: none; }

  .mk-fg { display: flex; flex-direction: column; gap: 4px; }
  .mk-label { font-family: var(--font-mono); font-size: 9px; font-weight: 600; color: var(--text-sub); text-transform: uppercase; letter-spacing: .08em; }
  .mk-input, .mk-select { width: 100%; padding: 10px 12px; font-family: var(--font-body); font-size: 13px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 8px; outline: none; }
  .mk-input:focus, .mk-select:focus { border-color: var(--orange); }

  .mk-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-family: var(--font-mono); font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
  .mb-g { background: rgba(16,185,129,0.1); color: #047857; border: 1px solid rgba(16,185,129,0.2); }
  .mb-r { background: rgba(239,68,68,0.1); color: #B91C1C; border: 1px solid rgba(239,68,68,0.2); }
  .mb-b { background: rgba(255,107,0,0.1); color: #C25100; border: 1px solid rgba(255,107,0,0.2); }
  .mb-a { background: rgba(245,158,11,0.1); color: #B45309; border: 1px solid rgba(245,158,11,0.2); }

  /* ── HOW IT WORKS TECHNICAL GRID ── */
  .hiw-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 48px; }
  .hiw-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    padding: 32px 28px; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    transition: transform .3s, border-color .3s;
  }
  .hiw-card:hover { transform: translateY(-4px); border-color: var(--border-dark); }
  .hiw-num {
    font-family: var(--font-pixel); font-size: 12px; color: var(--orange);
    background: var(--orange-light); border: 1px solid rgba(255,107,0,0.2);
    padding: 4px 10px; border-radius: 9999px; width: fit-content; margin-bottom: 20px;
  }
  .hiw-title { font-family: var(--font-head); font-weight: 700; font-size: 18px; color: var(--text); margin-bottom: 10px; }
  .hiw-desc { font-size: 13.5px; color: var(--text-sub); line-height: 1.65; }

  /* ── CTA EDITORIAL BANNER ── */
  .cta-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: 24px;
    padding: 70px 60px; text-align: center; position: relative; overflow: hidden;
    box-shadow: 0 16px 50px rgba(0,0,0,0.03);
  }
  .cta-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--orange);
  }

  /* ── PIXEL ART SHOWCASE SECTION ── */
  .pixel-showcase {
    background: #111111; position: relative; overflow: hidden;
    border-top: 3px solid var(--orange); border-bottom: 3px solid var(--orange);
  }
  .pixel-showcase::after {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 2;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px);
    animation: scanlines 0.1s linear infinite;
  }
  .pixel-showcase-inner {
    max-width: 1400px; margin: 0 auto; padding: 80px 40px;
    display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center;
    position: relative; z-index: 3;
  }
  .pixel-label-tag {
    font-family: var(--font-pixel); font-size: 10px; color: var(--orange);
    letter-spacing: .2em; text-transform: uppercase; margin-bottom: 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .pixel-label-tag::before { content: '▶'; font-size: 8px; }
  .pixel-big-h {
    font-family: var(--font-pixel); font-size: clamp(24px, 3.2vw, 40px);
    color: #FFFFFF; line-height: 1.3; letter-spacing: .02em; margin-bottom: 20px;
  }
  .pixel-big-h em { color: var(--orange); font-style: normal; }
  .pixel-desc { font-family: var(--font-mono); font-size: 12px; color: #888888; line-height: 1.8; }
  .pixel-img-frame {
    position: relative; border: 2px solid #333333;
    border-radius: 4px; overflow: hidden;
    box-shadow: 0 0 0 4px #222222, 0 0 40px rgba(255,107,0,0.2);
    image-rendering: pixelated;
  }
  .pixel-img-frame img {
    width: 100%; display: block;
    image-rendering: pixelated; image-rendering: crisp-edges;
  }
  .pixel-img-frame::before {
    content: '● ● ●'; position: absolute; top: 0; left: 0; right: 0;
    background: #1A1A1A; padding: 6px 12px; font-family: var(--font-mono); font-size: 10px;
    color: #555555; z-index: 4; letter-spacing: 4px;
  }
  .pixel-stats-row {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 28px;
  }
  .pixel-stat-box {
    background: #1A1A1A; border: 1px solid #333333; border-radius: 4px; padding: 14px 12px;
    text-align: center;
  }
  .pixel-stat-val { font-family: var(--font-pixel); font-size: 18px; color: var(--orange); }
  .pixel-stat-lab { font-family: var(--font-mono); font-size: 9px; color: #666666; margin-top: 4px; text-transform: uppercase; letter-spacing: .08em; }

  /* ── PIXEL FEATURES BANNER ── */
  .pixel-features-banner {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 24px; margin-top: 48px; overflow: hidden;
    position: relative;
  }
  .pixel-features-banner img {
    width: 100%; height: 180px; object-fit: cover;
    image-rendering: pixelated; image-rendering: crisp-edges;
    border-radius: 10px; display: block;
  }
  .pixel-label {
    font-family: var(--font-pixel); font-size: 10px; color: var(--orange);
    letter-spacing: .12em; text-transform: uppercase;
    background: var(--orange-light); border: 1px solid rgba(255,107,0,0.2);
    padding: 3px 10px; border-radius: 4px; display: inline-block; margin-bottom: 12px;
  }

  /* ── FOOTER ── */
  .footer-pixel-scene {
    position: relative; overflow: hidden; height: 140px;
    background: linear-gradient(180deg, #FFF8F0 0%, #FFF0E0 100%);
    border-top: 2px solid #FFDDBB;
  }
  .footer-pixel-scene img.cityscape {
    position: absolute; bottom: 0; left: 0; width: 100%;
    height: 130px; object-fit: cover; object-position: bottom;
    image-rendering: pixelated; image-rendering: crisp-edges;
  }
  .footer-truck {
    position: absolute; bottom: 8px; z-index: 3;
    height: 60px; width: auto;
    image-rendering: pixelated; image-rendering: crisp-edges;
    animation: truckDrive 18s linear infinite;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
  .footer-brand-name { font-family: var(--font-pixel); font-weight: 700; font-size: 14px; color: var(--text); }
  .footer-p { font-size: 13px; color: var(--text-sub); line-height: 1.7; max-width: 280px; margin-top: 10px; }
  .f-col-label { font-family: var(--font-mono); font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--text-sub); margin-bottom: 16px; }
  .f-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .f-links a { font-size: 13px; color: var(--text-sub); text-decoration: none; transition: color .2s; }
  .f-links a:hover { color: var(--orange); }
  .footer-india-badge {
    display: block; width: 90px; margin-top: 12px;
    image-rendering: pixelated; image-rendering: crisp-edges;
  }
  .footer-bot {
    border-top: 1px solid var(--border); padding-top: 24px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: var(--font-mono); font-size: 10px; color: var(--text-sub); letter-spacing: .06em;
  }
  .footer-pixel-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-pixel); font-size: 9px;
    color: var(--orange); background: var(--orange-light);
    border: 1px solid rgba(255,107,0,0.25); padding: 4px 10px; border-radius: 4px;
  }
  .footer-pixel-badge::before { content: '■'; font-size: 7px; animation: pixelBlink 1.2s step-end infinite; }

  /* ── CTA PIXEL SECTION ── */
  .cta-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: 24px;
    padding: 70px 60px; text-align: center; position: relative; overflow: hidden;
    box-shadow: 0 16px 50px rgba(0,0,0,0.03);
  }
  .cta-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--orange);
  }
  .cta-pixel-row {
    display: flex; justify-content: center; gap: 20px; margin-bottom: 36px; flex-wrap: wrap;
  }
  .cta-pixel-badge {
    display: flex; align-items: center; gap: 8px; padding: 8px 16px;
    font-family: var(--font-pixel); font-size: 9px; color: var(--text-sub);
    background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 4px;
    letter-spacing: .08em;
  }
  .cta-pixel-badge span.dot {
    width: 6px; height: 6px; background: var(--orange); border-radius: 1px;
    animation: pixelBlink 1s step-end infinite;
  }

  /* ── VIDEO EMBED COMPONENTS ── */
  .vid-phone-wrap {
    position: absolute; bottom: 6%; left: 4%; z-index: 4;
    width: 160px;
    animation: floatSlow 6s ease-in-out infinite;
  }
  .vid-phone-frame {
    border-radius: 22px; overflow: hidden;
    border: 3px solid #111;
    background: #000;
    box-shadow: 0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,107,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.05);
    position: relative;
  }
  .vid-phone-frame::before {
    content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 40px; height: 5px; background: #111; border-radius: 0 0 4px 4px; z-index: 2;
  }
  .vid-phone-frame video {
    display: block; width: 100%; height: 260px; object-fit: cover;
    border-radius: 19px;
  }
  .vid-phone-tag {
    position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
    white-space: nowrap;
    font-family: var(--font-pixel); font-size: 8px; color: var(--orange);
    letter-spacing: .12em; text-transform: uppercase;
    background: var(--orange-light); border: 1px solid rgba(255,107,0,0.2);
    padding: 3px 10px; border-radius: 4px;
  }
  .vid-strip {
    background: #0A0A0A; position: relative; overflow: hidden;
    padding: 64px 0; border-top: 1px solid rgba(255,107,0,0.15); border-bottom: 1px solid rgba(255,107,0,0.15);
  }
  .vid-strip-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 40px;
    display: grid; grid-template-columns: 1fr 1.6fr; gap: 56px; align-items: center;
  }
  .vid-strip-label { font-family: var(--font-pixel); font-size: 9px; color: var(--orange); letter-spacing: .18em; text-transform: uppercase; margin-bottom: 14px; }
  .vid-strip-h { font-family: var(--font-head); font-size: clamp(22px,2.8vw,34px); font-weight: 700; color: #FFFFFF; line-height: 1.2; letter-spacing: -.02em; margin-bottom: 14px; }
  .vid-strip-p { font-family: var(--font-body); font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.7; }
  .vid-browser-frame {
    background: #1A1A1A; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px;
    overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  }
  .vid-browser-bar {
    background: #111; padding: 10px 14px; display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .vid-browser-dots { display: flex; gap: 5px; }
  .vid-browser-dot { width: 9px; height: 9px; border-radius: 50%; }
  .vid-browser-url {
    flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 5px; padding: 4px 10px;
    font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.3);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .vid-browser-frame video {
    display: block; width: 100%; max-height: 380px; object-fit: cover;
  }
  .vid-cta-wrap {
    width: 100%; max-width: 600px; margin: 0 auto 32px;
    border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
    position: relative;
  }
  .vid-cta-wrap video { display: block; width: 100%; max-height: 280px; object-fit: cover; }
  .vid-cta-pill {
    position: absolute; top: 12px; left: 12px;
    font-family: var(--font-pixel); font-size: 8px; color: #fff;
    background: var(--orange); padding: 4px 10px; border-radius: 4px; letter-spacing: .1em;
  }
  @media(max-width:1024px) {
    .vid-phone-wrap { width: 130px; }
    .vid-strip-inner { grid-template-columns: 1fr; gap: 32px; }
    .vid-phone-frame video { height: 210px; }
  }
  @media(max-width:768px) {
    .vid-phone-wrap { display: none; }
    .vid-strip { padding: 48px 0; }
    .vid-strip-inner { padding: 0 20px; }
    .vid-browser-frame video { max-height: 220px; }
    .vid-cta-wrap video { max-height: 200px; }
  }

  /* ── RESPONSIVE ── */
  @media(max-width:1024px) {
    .hero { grid-template-columns: 1fr; height: auto; min-height: 100vh; padding-bottom: 60px; }
    .hero-right { height: 420px; margin-top: 30px; }
    .cyl-stage { width: 280px; }
    .feat-panel { grid-template-columns: 1fr; }
    .feat-panel-info { border-right: none; border-bottom: 1px solid var(--border); }
    .hiw-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .pixel-showcase-inner { grid-template-columns: 1fr; }
  }
  @media(max-width:768px) {
    .nav-links { display: none; }
    .mob-toggle { display: block; margin-left: 4px; }
    .nav-actions { gap: 8px; }
    .btn-gl {
      display: inline-flex !important;
      padding: 7px 14px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text) !important;
      border: 1px solid var(--border-dark);
      background: var(--surface);
      border-radius: 8px;
    }
    .btn-fire {
      padding: 7px 14px;
      font-size: 11px;
    }
    .hero-left { padding: 80px 5% 40px; }
    .sec-inner { padding: 0 20px; }
    .nav-inner { padding: 14px 20px; }
    .sec { padding: 80px 0; }
    .hiw-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; gap: 28px; }
    .footer-bot { flex-direction: column; gap: 10px; text-align: center; }
    .hmi-card { display: none !important; }
    body.lp-body { cursor: auto; }
    .cur, .cur-ring { display: none; }
    .cta-box { padding: 48px 24px; }
    .pixel-showcase-inner { padding: 48px 20px; }
    .pixel-big-h { font-size: 20px; }
    .footer-pixel-scene { height: 100px; }
    .footer-truck { height: 44px; }
  }
  @media(max-width:480px) {
    .nav-brand-sub { display: none; }
    .btn-fire span.btn-text-full { display: none; }
    .btn-fire::after { content: 'Trial'; }
    .hero-actions { flex-direction: column; align-items: flex-start; }
    .hero-trust { gap: 12px; }
    .pixel-stats-row { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─── CONSTANTS & PREVIEWS (Preserved 100% untouched data & handlers) ────── */
const FEATURES = [
  { short: "Sales",     label: "Sales Management",     desc: "Record every cylinder & regulator sale instantly. View daily summaries, print receipts, and track order statuses dynamically.", url: "gasagency.app/sales",     Icon: I.Trend },
  { short: "Customers", label: "Customer Ledger",       desc: "Maintain digital profiles for every customer. Check complete history of refuels, payments, and running debit/credit statements.", url: "gasagency.app/customers", Icon: I.Users },
  { short: "Udhari",    label: "Udhari (Credit)",       desc: "Know who owes you outstanding balance at all times. Log credit receipts, collect pending dues, and send reminders.", url: "gasagency.app/udhari",     Icon: I.Wallet },
  { short: "Cashbook",  label: "Cashbook & Payments",   desc: "Record all incoming cash collections and outgoing expenses. Check daily cash-in-hand totals and net bank balances.", url: "gasagency.app/cashbook",   Icon: I.Card },
  { short: "Delivery",  label: "Delivery Manager",      desc: "Assign orders to delivery boys. Track active pending deliveries, route coordinates, and staff refill commissions.", url: "gasagency.app/delivery",   Icon: I.Truck },
  { short: "Stock",     label: "Product & Stock",       desc: "Monitor live stock levels for 14.2kg domestic, 19kg commercial, and 5kg cylinders. Auto-calculate available empty inventory.", url: "gasagency.app/products",  Icon: I.Box },
  { short: "Payments",  label: "Inflow & Outflow",      desc: "Track full cash entries separated into customer payments received (inflow) and supplier/vendor expenditures paid (outflow).", url: "gasagency.app/payments",  Icon: I.Swap },
  { short: "Reports",   label: "Reports & Analytics",   desc: "Generate professional monthly sales statements. Track revenue and credit changes, and export clean PDF/Excel documents.", url: "gasagency.app/reports",   Icon: I.Bar },
  { short: "Roles",     label: "Multi-User & Roles",    desc: "Manage permission levels for agency staff. Add managers with select reports access or operators with bill-only roles.", url: "gasagency.app/users",     Icon: I.Lock },
];

const HOW_STEPS = [
  { label: "01 // SETUP",    title: "Register Your Agency",   desc: "Create your agency account with a unique code in minutes. Zero technical overhead required." },
  { label: "02 // INGEST",   title: "Add Customer Profiles",  desc: "Import or quickly add existing customer ledgers with contact info and running balance history." },
  { label: "03 // ENGINE",   title: "Record Cylinder Sales",  desc: "Log daily refill bookings, collect payments, and auto-track credit udharis across any device." },
  { label: "04 // REPORT",   title: "Export & Audit Dues",    desc: "Monitor real-time cash flow, print statement PDFs, and keep your agency 100% audit compliant." },
];

const MQ = ["LPG Sales Management","Customer Ledger","Udhari Tracking","Delivery Management","Stock Inventory","Cashbook","Business Reports","Multi-User Access","Works on Mobile","Made for India"];

interface PP { onSuccess: (m:string)=>void }

function SalesPreview({ onSuccess }: PP) {
  const [cust,setCust]=useState("Ramesh Patil"); const [prod,setProd]=useState("14.2kg Domestic"); const [qty,setQty]=useState(1); const [price,setPrice]=useState(950); const [mode,setMode]=useState("Cash"); const [busy,setBusy]=useState(false); const [inv,setInv]=useState<any>(null);
  const go=(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setTimeout(()=>{setBusy(false);const g={no:"INV-"+Math.floor(1e5+Math.random()*9e5),date:new Date().toLocaleDateString("en-IN"),cust,prod,qty,total:price*qty,mode};setInv(g);onSuccess(`Invoice ${g.no} recorded.`);},900);};
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Record New Cylinder Sale</div><div className="mk-s">Create instant billing invoice entry</div></div>{inv&&<button className="mk-btn mk-btn-s" onClick={()=>setInv(null)}>New Bill</button>}</div>
    {!inv?<form onSubmit={go} className="mk-card"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
      <div className="mk-fg"><label className="mk-label">Select Customer</label><select className="mk-select" value={cust} onChange={e=>setCust(e.target.value)}><option>Ramesh Patil (Bal: ₹950)</option><option>Sunita Sharma (Bal: ₹0)</option><option>Amit Verma (Bal: ₹1,200)</option><option>Pooja Singh (Bal: ₹0)</option></select></div>
      <div className="mk-fg"><label className="mk-label">Cylinder Product</label><select className="mk-select" value={prod} onChange={e=>{setProd(e.target.value);setPrice(e.target.value.includes("19kg")?1850:e.target.value.includes("5kg")?420:950)}}><option>14.2kg Domestic (₹950)</option><option>19kg Commercial (₹1850)</option><option>5kg Chotu (₹420)</option></select></div>
    </div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
      <div className="mk-fg"><label className="mk-label">Quantity</label><input type="number" min={1} className="mk-input" value={qty} onChange={e=>setQty(+e.target.value)}/></div>
      <div className="mk-fg"><label className="mk-label">Price ₹</label><input type="number" className="mk-input" value={price} onChange={e=>setPrice(+e.target.value)}/></div>
      <div className="mk-fg"><label className="mk-label">Payment Mode</label><select className="mk-select" value={mode} onChange={e=>setMode(e.target.value)}><option>Cash</option><option>Online (UPI)</option><option>Udhari (Credit)</option></select></div>
    </div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)",paddingTop:12}}>
      <div><div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Net Payable</div><div style={{fontFamily:"var(--font-mono)",fontSize:20,fontWeight:700,color:"var(--orange)"}}>₹{(price*qty).toLocaleString("en-IN")}</div></div>
      <button type="submit" disabled={busy} className="mk-btn mk-btn-p" style={{padding:"10px 20px"}}>{busy?"Generating…":"Create Bill & Save"}</button>
    </div></form>
    :<div className="mk-card" style={{border:"1px solid rgba(255,107,0,0.3)",background:"var(--surface)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--border)",paddingBottom:10,marginBottom:12}}><div><div style={{fontFamily:"var(--font-mono)",fontSize:13,fontWeight:700,color:"var(--orange)"}}>{inv.no}</div><div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)"}}>{inv.date}</div></div><span className={`mk-badge ${inv.mode.includes("Udhari")?"mb-r":"mb-g"}`}>{inv.mode.includes("Udhari")?"Pending Credit":"Paid"}</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:12,color:"var(--text-sub)"}}>
        {[["Customer",inv.cust],["Product",inv.prod],["Qty × Rate",`${inv.qty} × ₹${price}`]].map(([l,v])=><div key={String(l)} style={{display:"flex",justifyContent:"space-between"}}><span>{l}</span><strong style={{color:"var(--text)"}}>{v}</strong></div>)}
        <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid var(--border)",paddingTop:6}}><span>Total</span><strong style={{fontFamily:"var(--font-mono)",color:"var(--orange)",fontSize:15}}>₹{inv.total.toLocaleString("en-IN")}</strong></div>
      </div>
    </div>}
  </div>;
}

function CustomerPreview() {
  const [sel,setSel]=useState("Ramesh");
  const data:Record<string,any>={
    Ramesh:{name:"Ramesh Patil",phone:"+91 98450 12345",bal:"₹950",init:"RP",tx:[{date:"10 Jul",desc:"14.2kg Refill",amt:"₹950",type:"Dr",bal:"₹950"},{date:"05 Jul",desc:"Payment Received",amt:"₹950",type:"Cr",bal:"₹0"}]},
    Sunita:{name:"Sunita Sharma",phone:"+91 94480 98765",bal:"₹0",init:"SS",tx:[{date:"09 Jul",desc:"Payment Received",amt:"₹1,850",type:"Cr",bal:"₹0"},{date:"08 Jul",desc:"19kg Commercial",amt:"₹1,850",type:"Dr",bal:"₹1,850"}]},
    Amit:{name:"Amit Verma",phone:"+91 88900 11223",bal:"₹1,200",init:"AV",tx:[{date:"11 Jul",desc:"Regulator",amt:"₹250",type:"Dr",bal:"₹1,200"},{date:"02 Jul",desc:"14.2kg Refill",amt:"₹950",type:"Dr",bal:"₹950"}]},
  };
  const cur=data[sel];
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Digital Customer Ledger</div><div className="mk-s">Select profile to view statement</div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1.8fr",gap:12}}>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{Object.keys(data).map(k=><button key={k} onClick={()=>setSel(k)} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:10,border:`1px solid ${sel===k?"var(--orange)":"var(--border)"}`,background:sel===k?"var(--orange-light)":"var(--surface)",cursor:"pointer",textAlign:"left",transition:"all .2s"}}>
        <div style={{width:28,height:28,borderRadius:6,background:sel===k?"var(--orange)":"var(--bg-subtle)",color:sel===k?"#FFF":"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,fontFamily:"var(--font-mono)"}}>{data[k].init}</div>
        <div><div style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{data[k].name}</div><div style={{fontFamily:"var(--font-mono)",fontSize:10,color:data[k].bal!=="₹0"?"var(--red)":"var(--text-sub)"}}>{data[k].bal!=="₹0"?`Owes: ${data[k].bal}`:"Settled"}</div></div>
      </button>)}</div>
      <div className="mk-card" style={{padding:14}}><div style={{borderBottom:"1px solid var(--border)",paddingBottom:9,marginBottom:11}}><div style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>{cur.name}</div><div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-sub)"}}>{cur.phone}</div></div>
        <div className="mk-tw"><table className="mk-table"><thead><tr><th>Date</th><th>Details</th><th>Amount</th><th>Balance</th></tr></thead>
          <tbody>{cur.tx.map((t:any,i:number)=><tr key={i}><td>{t.date}</td><td><div style={{fontWeight:600,color:"var(--text)",fontSize:12}}>{t.desc}</div><div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)"}}>{t.type}</div></td><td style={{fontFamily:"var(--font-mono)",color:t.type==="Dr"?"var(--red)":"var(--green)",fontWeight:700}}>{t.type==="Dr"?"+":"-"}{t.amt}</td><td style={{fontFamily:"var(--font-mono)",fontWeight:700}}>{t.bal}</td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  </div>;
}

function UdhariPreview({onSuccess}:PP){
  const [rem,setRem]=useState<string[]>([]);
  const [bal,setBal]=useState<Record<string,number>>({"Ramesh Patil":950,"Amit Verma":1200,"Sanjay Kadam":2400});
  const remind=(n:string)=>{if(rem.includes(n))return;setRem([...rem,n]);onSuccess(`Reminder sent to ${n}.`);};
  const collect=(n:string)=>{if(!bal[n])return;const v=bal[n];setBal({...bal,[n]:0});onSuccess(`Collected ₹${v} from ${n}.`);};
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Udhari (Credit) Tracker</div><div className="mk-s">Outstanding dues from customers</div></div></div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Customer</th><th>Outstanding</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{Object.entries(bal).map(([n,v])=><tr key={n}><td style={{fontWeight:600,color:"var(--text)"}}>{n}</td>
        <td style={{fontFamily:"var(--font-mono)",fontWeight:700,color:v>0?"var(--red)":"var(--green)"}}>₹{v.toLocaleString("en-IN")}</td>
        <td><span className={`mk-badge ${v>0?"mb-r":"mb-g"}`}>{v>0?"Pending":"Cleared"}</span></td>
        <td>{v>0&&<div style={{display:"flex",gap:6}}><button className="mk-btn mk-btn-p" style={{padding:"4px 10px",fontSize:10}} onClick={()=>collect(n)}>Collect</button><button className="mk-btn mk-btn-s" style={{padding:"4px 10px",fontSize:10,opacity:rem.includes(n)?.5:1}} onClick={()=>remind(n)}>{rem.includes(n)?"Sent":"Remind"}</button></div>}</td>
      </tr>)}</tbody>
    </table></div>
    <div style={{marginTop:14,padding:"12px 14px",borderRadius:10,background:"var(--surface)",border:"1px solid var(--border)",fontSize:12,color:"var(--text-sub)",lineHeight:1.6,fontFamily:"var(--font-mono)"}}>
      Total Dues: <strong style={{color:"var(--orange)"}}>₹{Object.values(bal).reduce((a,b)=>a+b,0).toLocaleString("en-IN")}</strong> across active credit balances.
    </div>
  </div>;
}

function CashbookPreview(){
  const entries=[{date:"31 Jul",desc:"Sales — Ramesh Patil",amt:950,type:"in"},{date:"31 Jul",desc:"19kg — Hotel Raj",amt:1850,type:"in"},{date:"30 Jul",desc:"Driver Commission",amt:320,type:"out"},{date:"30 Jul",desc:"Vehicle Fuel",amt:500,type:"out"},{date:"29 Jul",desc:"Payment — Amit Verma",amt:1200,type:"in"}];
  const inf=entries.filter(e=>e.type==="in").reduce((a,b)=>a+b.amt,0);
  const out=entries.filter(e=>e.type==="out").reduce((a,b)=>a+b.amt,0);
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Cashbook & Payments</div><div className="mk-s">Daily cash flow summary</div></div></div>
    <div className="mk-grid">{[["Cash Inflow",`₹${inf.toLocaleString("en-IN")}`,"var(--green)"],["Cash Outflow",`₹${out.toLocaleString("en-IN")}`,"var(--red)"],["Net Balance",`₹${(inf-out).toLocaleString("en-IN")}`,inf>out?"var(--orange)":"var(--red)"]].map(([l,v,c])=><div key={String(l)} className="mk-stat"><div className="mk-stat-l">{l}</div><div className="mk-stat-v" style={{color:String(c)}}>{v}</div></div>)}</div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th></tr></thead>
      <tbody>{entries.map((e,i)=><tr key={i}><td>{e.date}</td><td style={{color:"var(--text)",fontWeight:500}}>{e.desc}</td><td style={{fontFamily:"var(--font-mono)",fontWeight:700,color:e.type==="in"?"var(--green)":"var(--red)"}}>{e.type==="in"?"+":"-"}₹{e.amt.toLocaleString("en-IN")}</td><td><span className={`mk-badge ${e.type==="in"?"mb-g":"mb-r"}`}>{e.type==="in"?"Inflow":"Outflow"}</span></td></tr>)}
      </tbody>
    </table></div>
  </div>;
}

function DeliveryPreview({onSuccess}:PP){
  const boys=[{name:"Raju Kumar",done:3,pending:2,area:"Pune West"},{name:"Santosh Patil",done:4,pending:0,area:"Pune East"},{name:"Vikas Kadam",done:1,pending:2,area:"Hadapsar"}];
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Delivery Boy Manager</div><div className="mk-s">Active delivery assignments</div></div><button className="mk-btn mk-btn-p" onClick={()=>onSuccess("Delivery assigned.")}><I.Plus/> Assign</button></div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>{boys.map(b=><div key={b.name} className="mk-card" style={{padding:14}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:8,background:"var(--orange-light)",border:"1px solid rgba(255,107,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--orange)"}}><I.Truck/></div><div><div style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>{b.name}</div><div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)"}}>{b.area}</div></div></div>
      <span className={`mk-badge ${b.pending>0?"mb-a":"mb-g"}`}>{b.pending>0?`${b.pending} Pending`:"All Done"}</span>
    </div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>{[["Done",b.done,"var(--green)"],["Pending",b.pending,b.pending>0?"var(--orange)":"var(--text-sub)"],["Total",b.done+b.pending,"var(--text)"]].map(([l,v,c])=><div key={String(l)} style={{textAlign:"center",padding:"8px",background:"var(--bg-subtle)",borderRadius:8,border:"1px solid var(--border)"}}><div style={{fontFamily:"var(--font-mono)",fontWeight:700,fontSize:15,color:String(c)}}>{v}</div><div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)",textTransform:"uppercase"}}>{l}</div></div>)}</div></div>)}</div>
  </div>;
}

function StockPreview({onSuccess}:PP){
  const [s,setS]=useState({d:142,c:28,sm:15});
  const items=[{k:"d" as const,label:"14.2kg Domestic",cap:200,col:"var(--orange)"},{k:"c" as const,label:"19kg Commercial",cap:60,col:"var(--text)"},{k:"sm" as const,label:"5kg Cylinder",cap:40,col:"var(--green)"}];
  return (
    <div style={{animation:"cardIn .4s ease both"}}>
      <div className="mk-h"><div><div className="mk-t">Product & Stock Monitor</div><div className="mk-s">Live cylinder inventory capacity</div></div></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {items.map(item=>{
          const v=s[item.k];const p=Math.round(v/item.cap*100);
          return (
            <div key={item.k} className="mk-card" style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div><div style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>{item.label}</div><div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)"}}>Capacity: {item.cap}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:20,fontWeight:700,color:item.col}}>{v}</span>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    <button className="mk-btn mk-btn-p" style={{padding:"3px 8px"}} onClick={()=>setS(x=>({...x,[item.k]:Math.min(x[item.k]+1,item.cap)}))}><I.Plus/></button>
                    <button className="mk-btn mk-btn-s" style={{padding:"3px 8px"}} onClick={()=>{if(v>0){setS(x=>({...x,[item.k]:x[item.k]-1}));onSuccess("Stock updated.");}}}><I.Minus/></button>
                  </div>
                </div>
              </div>
              <div style={{height:4,background:"var(--bg-subtle)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${p}%`,background:item.col,transition:"width .5s ease"}}/>
              </div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-sub)",marginTop:6}}>{p}% available capacity</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InflowOutflowPreview(){
  const e=[{date:"31 Jul",desc:"Ramesh Patil — Cash",amt:950,t:"in"},{date:"31 Jul",desc:"Hotel Raj — UPI",amt:1850,t:"in"},{date:"30 Jul",desc:"Fuel — Vehicle",amt:500,t:"out"},{date:"30 Jul",desc:"Driver Salary Advance",amt:2000,t:"out"},{date:"29 Jul",desc:"Amit Verma — Cash",amt:1200,t:"in"}];
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Inflow & Outflow</div><div className="mk-s">Separated cash flow entries</div></div></div>
    <div className="mk-grid">{[["Total Inflow","₹4,000","var(--green)"],["Total Outflow","₹2,500","var(--red)"]].map(([l,v,c])=><div key={String(l)} className="mk-stat"><div className="mk-stat-l">{l}</div><div className="mk-stat-v" style={{color:String(c)}}>{v}</div></div>)}</div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th></tr></thead>
      <tbody>{e.map((x,i)=><tr key={i}><td>{x.date}</td><td style={{color:"var(--text)",fontWeight:500}}>{x.desc}</td><td style={{fontFamily:"var(--font-mono)",fontWeight:700,color:x.t==="in"?"var(--green)":"var(--red)"}}>{x.t==="in"?"+":"-"}₹{x.amt.toLocaleString("en-IN")}</td><td><span className={`mk-badge ${x.t==="in"?"mb-g":"mb-r"}`}>{x.t==="in"?"Inflow":"Outflow"}</span></td></tr>)}</tbody>
    </table></div>
  </div>;
}

function ReportsPreview(){
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Reports & Analytics</div><div className="mk-s">Monthly sales statement — July 2026</div></div><div style={{display:"flex",gap:6}}><button className="mk-btn mk-btn-s" style={{fontSize:10}}>PDF</button><button className="mk-btn mk-btn-s" style={{fontSize:10}}>Excel</button></div></div>
    <div className="mk-grid">{[["Total Sales","₹3,24,580","var(--orange)"],["Cylinders","428","var(--text)"],["Udhari","₹18,240","var(--red)"],["Net Revenue","₹3,06,340","var(--green)"]].map(([l,v,c])=><div key={String(l)} className="mk-stat"><div className="mk-stat-l">{l}</div><div className="mk-stat-v" style={{color:String(c),fontFamily:"var(--font-mono)"}}>{v}</div></div>)}</div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Week</th><th>Sales</th><th>Collections</th><th>Udhari</th></tr></thead>
      <tbody>{[["Week 1","₹84,200","₹76,000","₹8,200"],["Week 2","₹79,400","₹71,000","₹8,400"],["Week 3","₹88,600","₹82,000","₹6,600"],["Week 4","₹72,380","₹67,580","₹4,800"]].map(([w,s,c,u])=><tr key={w}><td style={{fontWeight:600}}>{w}</td><td style={{fontFamily:"var(--font-mono)",color:"var(--text)"}}>{s}</td><td style={{fontFamily:"var(--font-mono)",color:"var(--green)"}}>{c}</td><td style={{fontFamily:"var(--font-mono)",color:"var(--red)"}}>{u}</td></tr>)}</tbody>
    </table></div>
  </div>;
}

function UsersPreview({onSuccess}:PP){
  const users=[{name:"Jayesh Patel",role:"Owner",access:"Full Access"},{name:"Priya Mehta",role:"Manager",access:"Reports + Sales"},{name:"Ravi Sharma",role:"Operator",access:"Billing Only"}];
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Multi-User & Roles</div><div className="mk-s">Agency staff access control</div></div><button className="mk-btn mk-btn-p" onClick={()=>onSuccess("Staff member invited.")}><I.Plus/> Add Staff</button></div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Name</th><th>Role</th><th>Access Level</th><th>Status</th></tr></thead>
      <tbody>{users.map((u,i)=><tr key={i}><td style={{fontWeight:700,color:"var(--text)"}}>{u.name}</td><td style={{color:"var(--text-sub)"}}>{u.role}</td><td><span className="mk-badge mb-b">{u.access}</span></td><td><span className="mk-badge mb-g">Active</span></td></tr>)}</tbody>
    </table></div>
    <div style={{marginTop:14,padding:"12px 14px",borderRadius:10,background:"var(--surface)",border:"1px solid var(--border)",fontSize:12,color:"var(--text-sub)",lineHeight:1.65,fontFamily:"var(--font-mono)"}}>Role-based access ensures staff members only see what they need. Protect financial data with Owner-only restrictions.</div>
  </div>;
}

const TRIAL_WA_URL = "https://wa.me/918605601801?text=Hello%20Jayesh%2C%20I%20want%20to%20start%20a%20free%20trial%20for%20LPG%20Agency%20ERP.";

/* ─── MAIN LANDING PAGE COMPONENT ────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [activeF, setActiveF] = useState(0);
  const [toast, setToast] = useState("");
  const curRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("lp-body");
    document.body.style.backgroundColor = "#FAFAFA";
    document.body.style.color = "#111111";
    document.documentElement.style.backgroundColor = "#FAFAFA";
    return () => {
      document.body.classList.remove("lp-body");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Custom Technical Cursor
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (curRef.current)  { curRef.current.style.left  = e.clientX + "px"; curRef.current.style.top  = e.clientY + "px"; }
      if (ringRef.current) { ringRef.current.style.left = e.clientX + "px"; ringRef.current.style.top = e.clientY + "px"; }
    };
    const over = (e: MouseEvent) => {
      const h = !!(e.target as HTMLElement).closest("a,button,[data-h]");
      curRef.current?.classList.toggle("h", h);
      ringRef.current?.classList.toggle("h", h);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);

  // Toast auto dismiss
  useEffect(() => { if (!toast) return; const t = setTimeout(()=>setToast(""), 3000); return ()=>clearTimeout(t); }, [toast]);

  const showToast = useCallback((m: string) => setToast(m), []);

  const renderPreview = () => {
    switch(activeF) {
      case 0: return <SalesPreview onSuccess={showToast}/>;
      case 1: return <CustomerPreview/>;
      case 2: return <UdhariPreview onSuccess={showToast}/>;
      case 3: return <CashbookPreview/>;
      case 4: return <DeliveryPreview onSuccess={showToast}/>;
      case 5: return <StockPreview onSuccess={showToast}/>;
      case 6: return <InflowOutflowPreview/>;
      case 7: return <ReportsPreview/>;
      case 8: return <UsersPreview onSuccess={showToast}/>;
      default: return null;
    }
  };

  return (
    <div className="lp-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className="cur" ref={curRef}/>
      <div className="cur-ring" ref={ringRef}/>

      {/* Toast Notification */}
      {toast && (
        <div style={{ position:"fixed",bottom:28,right:28,zIndex:2000,background:"#FFFFFF",border:"1px solid var(--border)",borderRadius:12,padding:"12px 20px",fontSize:12,fontFamily:"var(--font-mono)",color:"var(--text)",display:"flex",alignItems:"center",gap:10,boxShadow:"0 10px 30px rgba(0,0,0,0.08)",animation:"cardIn .3s ease both" }}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>{toast}
        </div>
      )}

      {/* Mobile drawer */}
      <div className={`mob-drawer${mobOpen?" open":""}`}>
        <button className="mob-close" onClick={()=>setMobOpen(false)}>✕</button>
        <a href="#features" onClick={()=>setMobOpen(false)}>Features</a>
        <a href="#how" onClick={()=>setMobOpen(false)}>How It Works</a>
        <a href="#features" onClick={()=>setMobOpen(false)}>App Workbench</a>
        <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" style={{color:"var(--orange)"}}>Start Free Trial</a>
        <Link to="/login" onClick={()=>setMobOpen(false)}>Login</Link>
      </div>

      {/* ══ NAVIGATION BAR ══ */}
      <nav className={`nav${scrolled?" on":""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-brand">
            <div className="nav-brand-mark"><I.Flame/></div>
            <div>
              <div className="nav-brand-name">GasAgency Hub</div>
              <div className="nav-brand-sub">Smart. Simple. Secure.</div>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#features">App Workbench</a></li>
          </ul>

          <div className="nav-actions">
            <Link to="/login" className="btn-gl">Login</Link>
            <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" className="btn-fire">
              <span className="btn-text-full">Start Free Trial</span> <I.Arrow/>
            </a>
          </div>

          <button className="mob-toggle" onClick={()=>setMobOpen(true)}><span/><span/><span/></button>
        </div>
      </nav>

      {/* ══ HERO SECTION (NOTHING / TEENAGE ENGINEERING EXHIBITION VIEW) ══ */}
      <section className="hero">
        {/* Left Column */}
        <div className="hero-left">
          <div className="hero-tech-tag">
            BUILT FOR INDIA'S LPG AGENCIES
          </div>

          <h1 className="hero-h1">
            RUN YOUR LPG AGENCY<br/>
            SMARTER, FASTER &amp;<br/>
            <span className="pixel-accent">MORE PROFITABLE.</span>
          </h1>

          <p className="hero-desc">
            Manage bookings, customers, payments, stock, udhari, and reports from one powerful platform. Designed for India. Built for growth.
          </p>

          <div className="hero-actions">
            <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" className="btn-hero-lg">
              Start Free Trial <I.Arrow/>
            </a>
            <a href="#features" className="btn-hero-ghost">
              <I.Play/> Watch Workbench
            </a>
          </div>

          <div className="hero-trust">
            <div className="trust-pill"><I.Shield/> 100% Secure Data</div>
            <div className="trust-pill"><I.Mobile/> Works Offline</div>
            <div className="trust-pill"><I.Cloud/> Any Device</div>
            <div className="trust-pill"><I.Globe/> Made for India</div>
          </div>
        </div>

        {/* Right Column — 3D Cylinder Product Studio */}
        <div className="hero-right">
          {/* Top HMI Floating Hardware Card */}
          <div className="hmi-card" style={{ top: "16%", right: "8%" }}>
            <div className="hmi-label">
              <span>Today's Collection</span>
              <span style={{color:"var(--green)"}}>▲ 12%</span>
            </div>
            <div className="hmi-value">₹24,580</div>
            <div className="hmi-sub">Real-time daily inflow</div>
          </div>

          {/* Bottom HMI Floating Hardware Card */}
          <div className="hmi-card" style={{ bottom: "18%", right: "8%" }}>
            <div className="hmi-label">
              <span>Pending Udhari</span>
              <span style={{color:"var(--red)"}}>▼ 6%</span>
            </div>
            <div className="hmi-value" style={{ color: "var(--red)" }}>₹8,240</div>
            <div className="hmi-sub">12 active customers</div>
          </div>

          {/* Center Pixel Art Cylinder Stage */}
          <div className="cyl-stage">
            <img src="/pixel-cylinder.png" alt="LPG Cylinder Pixel Art" className="cyl-img" style={{imageRendering:'pixelated'}}/>
            <div className="cyl-pedestal"/>
          </div>

          {/* ── SPOT 1: Floating Phone Video Mockup ── */}
          <div className="vid-phone-wrap">
            <div className="vid-phone-frame">
              <video
                src="/promo-video.mp4"
                autoPlay muted loop playsInline
                style={{display:'block',width:'100%',height:260,objectFit:'cover',borderRadius:19}}
              />
            </div>
            <div className="vid-phone-tag">Live Preview</div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE SYSTEM ══ */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MQ,...MQ,...MQ].map((item,i)=>(
            <div key={i} className="marquee-item">
              <div className="marquee-item-dot"/>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ INTERACTIVE WORKBENCH SECTION ══ */}
      <section className="sec" id="features">
        <div className="sec-inner">
          <div style={{ marginBottom: 48 }}>
            <div className="sec-num">01 // EVERYTHING YOU NEED</div>
            <h2 className="sec-h">
              All The Tools You Need,<br/>
              <span className="pixel-accent">One Powerful Platform.</span>
            </h2>
            <p className="sec-p">
              Click any capability below to interact with it and see exactly how our dashboard handles your daily workloads.
            </p>
          </div>

          {/* Feature Tabs Bar */}
          <div className="feat-tabs-strip">
            {FEATURES.map((f, i) => (
              <button key={i} className={`feat-tab${activeF===i?" act":""}`} onClick={()=>setActiveF(i)}>
                <div className="feat-tab-icon"><f.Icon/></div>
                <div className="feat-tab-label">{f.short}</div>
              </button>
            ))}
          </div>

          {/* Feature Panel & Live Interactive Workstation */}
          <div className="feat-panel">
            <div className="feat-panel-info">
              <div>
                <div className="feat-panel-tag">
                  <span>// MODULE {String(activeF + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="feat-panel-title">{FEATURES[activeF].label}</h3>
                <p className="feat-panel-desc">{FEATURES[activeF].desc}</p>
              </div>

              <div className="feat-panel-url">
                <div className="feat-panel-url-dot"/>
                <span>{FEATURES[activeF].url}</span>
              </div>
            </div>

            <div className="feat-panel-mock">
              {renderPreview()}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PIXEL ART SHOWCASE SECTION ══ */}
      <div className="pixel-showcase">
        <div className="pixel-showcase-inner">
          <div>
            <div className="pixel-label-tag">POWERFUL FEATURES</div>
            <h2 className="pixel-big-h">
              ALL THE TOOLS YOU NEED,<br/>
              ONE <em>POWERFUL</em> PLATFORM
            </h2>
            <p className="pixel-desc">
              Designed pixel-perfect for India's LPG distributors.
              Web, Mobile &amp; Tablet — all synced in real time.
              Works offline. Start your agency running same day.
            </p>
            <div className="pixel-stats-row">
              {[["500+","Agencies"],["99.9%","Uptime"],["₹0","Setup Fee"]].map(([v,l])=>(
                <div key={l} className="pixel-stat-box">
                  <div className="pixel-stat-val">{v}</div>
                  <div className="pixel-stat-lab">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="pixel-img-frame" style={{marginTop:20}}>
              <img src="/pixel-dashboard.png" alt="Pixel Art Dashboard" style={{marginTop:24}}/>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SPOT 2: CINEMATIC VIDEO STRIP ══ */}
      <div className="vid-strip">
        <div className="vid-strip-inner">
          <div>
            <div className="vid-strip-label">▶ // PRODUCT DEMO</div>
            <h2 className="vid-strip-h">
              See GasAgency Hub<br/>
              <span style={{color:'#FF6B00'}}>In Action.</span>
            </h2>
            <p className="vid-strip-p">
              Watch how your agency operations transform — from billing and udhari tracking to delivery management and reports. All in one dashboard, built for India.
            </p>
            <div style={{marginTop:24,display:'flex',gap:12,flexWrap:'wrap'}}>
              <a href="https://wa.me/918605601801?text=Hello%20Jayesh%2C%20I%20want%20to%20start%20a%20free%20trial%20for%20LPG%20Agency%20ERP." target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:'#FF6B00',color:'#fff',borderRadius:8,fontFamily:"var(--font-body)",fontWeight:600,fontSize:13,textDecoration:'none',transition:'all .2s'}}
              >
                Start Free Trial →
              </a>
              <a href="#features"
                style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:'transparent',color:'rgba(255,255,255,0.7)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,fontFamily:"var(--font-body)",fontWeight:500,fontSize:13,textDecoration:'none'}}
              >
                Try Workbench
              </a>
            </div>
          </div>
          <div className="vid-browser-frame">
            <div className="vid-browser-bar">
              <div className="vid-browser-dots">
                <div className="vid-browser-dot" style={{background:'#FF5F57'}}/>
                <div className="vid-browser-dot" style={{background:'#FEBC2E'}}/>
                <div className="vid-browser-dot" style={{background:'#28C840'}}/>
              </div>
              <div className="vid-browser-url">gasagency.app/dashboard</div>
            </div>
            <video
              src="/promo-video.mp4"
              autoPlay muted loop playsInline
              style={{display:'block',width:'100%',maxHeight:380,objectFit:'cover'}}
            />
          </div>
        </div>
      </div>

      {/* ══ HOW IT WORKS SECTION ══ */}
      <section className="sec" id="how" style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="sec-inner">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="sec-num" style={{ margin: "0 auto 20px" }}>02 // SIMPLE PROCESS</div>
            <h2 className="sec-h">
              Up &amp; Running In <span className="pixel-accent">4 Easy Steps.</span>
            </h2>
            <p className="sec-p" style={{ margin: "0 auto" }}>
              Start managing your gas agency faster with zero complicated onboarding.
            </p>
          </div>

          <div className="hiw-grid">
            {HOW_STEPS.map((step, idx) => (
              <div key={idx} className="hiw-card">
                <div className="hiw-num">{step.label}</div>
                <h3 className="hiw-title">{step.title}</h3>
                <p className="hiw-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Pixel Features Image Banner */}
          <div className="pixel-features-banner">
            <div className="pixel-label">PIXEL — BUILT FOR INDIA</div>
            <img src="/pixel-features.png" alt="Feature Icons Pixel Art" />
          </div>
        </div>
      </section>

      {/* ══ CTA EDITORIAL BANNER ══ */}
      <section className="sec">
        <div className="sec-inner">
          <div className="cta-box">
            <div className="sec-num" style={{ margin: "0 auto 20px" }}>03 // READY TO START</div>
            <h2 className="sec-h" style={{ fontSize: "clamp(32px, 4vw, 56px)", marginBottom: 16 }}>
              READY TO TRANSFORM YOUR<br/>
              <span className="pixel-accent">GAS AGENCY?</span>
            </h2>
            <p className="sec-p" style={{ margin: "0 auto 24px", textAlign: "center" }}>
              Start your free trial today. No credit card required. No setup fees. Just your agency, running smarter.
            </p>

            {/* ── SPOT 3: CTA Compact Video Preview ── */}
            <div className="vid-cta-wrap">
              <video
                src="/promo-video.mp4"
                autoPlay muted loop playsInline
                style={{display:'block',width:'100%',maxHeight:280,objectFit:'cover',borderRadius:15}}
              />
              <div className="vid-cta-pill">● LIVE DEMO</div>
            </div>

            {/* Pixel Art Badges Row */}
            <div className="cta-pixel-row">
              {["No Credit Card","Works Offline","Any Device","Made in India"].map(t=>(
                <div key={t} className="cta-pixel-badge"><span className="dot"/>{t}</div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" className="btn-hero-lg">
                Start Free Trial <I.Arrow/>
              </a>
              <Link to="/login" className="btn-hero-ghost">
                Agency Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "var(--surface)" }}>

        {/* Pixel Art Cityscape Scene */}
        <div className="footer-pixel-scene">
          <img className="cityscape" src="/pixel-cityscape.png" alt="Pixel Art City"/>
          <img className="footer-truck" src="/pixel-truck.png" alt="Pixel Delivery Truck"/>
        </div>

        <div style={{ borderTop: "3px solid var(--orange)", paddingTop: 56, paddingBottom: 40 }}>
          <div className="sec-inner">
            <div className="footer-grid">
              <div>
                <div className="nav-brand" style={{ marginBottom: 14 }}>
                  <div className="nav-brand-mark"><I.Flame/></div>
                  <div className="footer-brand-name">GasAgency Hub</div>
                </div>
                <p className="footer-p">
                  India's trusted LPG gas agency management platform. Engineered for speed, reliability, and growth.
                </p>
                <div className="footer-pixel-badge" style={{marginTop:16}}>LIVE SYS.ACTIVE</div>
              </div>

              <div>
                <div className="f-col-label">PRODUCT</div>
                <ul className="f-links">
                  <li><a href="#features">Features</a></li>
                  <li><a href="#features">Live Demo</a></li>
                  <li><a href="#features">Analytics</a></li>
                  <li><a href="#how">How It Works</a></li>
                </ul>
              </div>

              <div>
                <div className="f-col-label">SUPPORT</div>
                <ul className="f-links">
                  <li><a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer">Contact Us</a></li>
                  <li><a href="mailto:jayeshneo07@gmail.com">Email Support</a></li>
                  <li><a href="#features">Documentation</a></li>
                </ul>
              </div>

              <div>
                <div className="f-col-label">MADE IN INDIA</div>
                <div style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7, marginTop: 8 }}>
                  Designed &amp; built for Indian LPG distributors.
                </div>
                <img className="footer-india-badge" src="/pixel-india.png" alt="Made in India Pixel Badge"/>
              </div>
            </div>

            <div className="footer-bot">
              <div>© {new Date().getFullYear()} GasAgency Hub. All rights reserved.</div>
              <div style={{ display: "flex", gap: 20 }}>
                <Link to="/login" style={{ color: "var(--text-sub)", textDecoration: "none" }}>Agency Login</Link>
                <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--orange)", textDecoration: "none" }}>Start Free Trial</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
