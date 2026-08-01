import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
const useClientEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const Route = createFileRoute("/landing")({ component: LandingPage });

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
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
  Flame:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c0 0-5 5.5-5 10a5 5 0 0010 0c0-2-1-4-2-5.5C14 8 13 9 13 10.5c0 1-.5 1.5-1 1.5-.8 0-1.5-.7-1-2C11.5 8.5 12 5.5 12 2z" fill="currentColor" stroke="none" fillOpacity="0.9"/></svg>,
};

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:        #070B14;
    --ink2:       #0A0F1D;
    --ink3:       #0F1628;
    --panel:      rgba(11,16,32,0.85);
    --fire:       #FF7A00;
    --fire-dim:   rgba(255,122,0,0.12);
    --fire-glow:  rgba(255,122,0,0.25);
    --blue:       #3D6BFF;
    --blue-dim:   rgba(61,107,255,0.1);
    --green:      #1DB954;
    --red:        #E53935;
    --hi:         #FFFFFF;
    --mid:        #CBD5E1;
    --lo:         #94A3B8;
    --rule:       rgba(255,255,255,0.1);
    --rule-fire:  rgba(255,122,0,0.25);
    --head:       'Space Grotesk', sans-serif;
    --body:       'Inter', sans-serif;
    --mono:       'JetBrains Mono', monospace;
  }

  html, body {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #070B14 !important;
    color: #FFFFFF !important;
  }

  .lp-page-wrapper {
    font-family: var(--body);
    background-color: #070B14 !important;
    color: #FFFFFF !important;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    z-index: 1;
  }

  /* noise + grid layer */
  .lp-page-wrapper::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,122,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,122,0,0.03) 1px, transparent 1px);
    background-size: 72px 72px;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--ink); }
  ::-webkit-scrollbar-thumb { background: rgba(255,122,0,0.3); }

  /* ── CURSOR ── */
  .cur {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--fire);
    transform: translate(-50%,-50%);
    transition: width .15s, height .15s, opacity .15s;
    mix-blend-mode: screen;
  }
  .cur-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 30px; height: 30px; border-radius: 50%;
    border: 1px solid rgba(255,122,0,0.3);
    transform: translate(-50%,-50%);
    transition: width .3s cubic-bezier(.16,1,.3,1), height .3s cubic-bezier(.16,1,.3,1), border-color .2s;
  }
  .cur.h { width: 4px; height: 4px; opacity: .5; }
  .cur-ring.h { width: 48px; height: 48px; border-color: var(--fire); }

  /* ── KEYFRAMES ── */
  @keyframes drift     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
  @keyframes driftSlow { 0%,100%{transform:translateY(0) rotate(0deg);} 40%{transform:translateY(-14px) rotate(.4deg);} 70%{transform:translateY(-7px) rotate(-.3deg);} }
  @keyframes ledPulse  { 0%,100%{opacity:.7;box-shadow:0 0 24px rgba(255,122,0,.3),0 0 60px rgba(255,122,0,.1);} 50%{opacity:1;box-shadow:0 0 48px rgba(255,122,0,.55),0 0 100px rgba(255,122,0,.2);} }
  @keyframes glowPulse { 0%,100%{opacity:.5;} 50%{opacity:1;} }
  @keyframes scanline  { 0%{top:-2px;opacity:0;} 5%{opacity:.6;} 95%{opacity:.6;} 100%{top:100%;opacity:0;} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn    { from{opacity:0;} to{opacity:1;} }
  @keyframes marquee   { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes cardIn    { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
  @keyframes blink     { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes barIn     { from{transform:scaleY(0);} to{transform:scaleY(1);} }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    transition: background .4s, border .4s;
    border-bottom: 1px solid transparent;
  }
  .nav.on {
    background: rgba(8,12,20,0.94);
    backdrop-filter: blur(24px) saturate(150%);
    border-bottom-color: var(--rule);
  }
  .nav-inner {
    max-width: 1360px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 40px;
  }
  .nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; cursor: none; }
  .nav-brand-mark {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--fire); display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(255,122,0,.35);
  }
  .nav-brand-name { font-family: var(--head); font-weight: 700; font-size: 15px; letter-spacing: -.02em; }
  .nav-brand-sub  { font-size: 10px; color: var(--mid); font-weight: 400; letter-spacing: .06em; text-transform: uppercase; margin-top: 1px; }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a { font-size: 13px; font-weight: 500; color: var(--mid); text-decoration: none; letter-spacing: .01em; transition: color .2s; cursor: none; }
  .nav-links a:hover { color: var(--hi); }
  .nav-actions { display: flex; gap: 10px; align-items: center; }
  .btn-gl {
    padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 500;
    color: var(--mid); border: 1px solid var(--rule); background: transparent;
    text-decoration: none; transition: all .2s; cursor: none; font-family: var(--body);
    letter-spacing: .01em;
  }
  .btn-gl:hover { color: var(--hi); border-color: rgba(255,255,255,.14); }
  .btn-fire {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 22px; border-radius: 6px; font-size: 13px; font-weight: 600;
    color: var(--hi); background: var(--fire); border: none; text-decoration: none;
    cursor: none; font-family: var(--body); letter-spacing: .01em;
    transition: all .25s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 4px 18px rgba(255,122,0,.25);
  }
  .btn-fire:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,122,0,.4); }
  .mob-toggle { display: none; background: none; border: none; cursor: pointer; }
  .mob-toggle span { display: block; width: 18px; height: 1px; background: var(--hi); margin: 5px 0; transition: all .3s; }

  /* ── MOBILE DRAWER ── */
  .mob-drawer { display: none; position: fixed; inset: 0; z-index: 900; background: rgba(8,12,20,.97); backdrop-filter: blur(24px); flex-direction: column; align-items: flex-start; justify-content: center; padding: 0 40px; gap: 32px; }
  .mob-drawer.open { display: flex; }
  .mob-drawer a { font-family: var(--head); font-size: 28px; font-weight: 700; color: var(--hi); text-decoration: none; }
  .mob-close { position: absolute; top: 24px; right: 24px; width: 40px; height: 40px; border: 1px solid var(--rule); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--hi); background: none; border-radius: 4px; font-size: 16px; }

  /* ── HERO ── */
  .hero {
    position: relative; height: 100vh; min-height: 750px;
    display: grid; grid-template-columns: 56% 44%;
    overflow: hidden; z-index: 1;
    padding-top: 70px;
  }

  /* Ambient orange light from center-right */
  .hero-ambient {
    position: absolute; pointer-events: none;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,122,0,.06) 0%, transparent 60%);
    top: -200px; right: -200px; z-index: 0;
  }

  /* Left column */
  .hero-left {
    display: flex; flex-direction: column; justify-content: center;
    padding: 30px 6% 50px 10%; position: relative; z-index: 2;
  }
  .hero-eyebrow {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    color: var(--fire); letter-spacing: .18em; text-transform: uppercase;
    animation: fadeUp .5s ease both;
  }
  .hero-eyebrow-line { width: 24px; height: 1px; background: var(--fire); }
  .hero-h1 {
    font-family: var(--head); font-weight: 700;
    font-size: clamp(38px, 4.8vw, 68px); line-height: 1.05;
    letter-spacing: -.04em; color: var(--hi);
    margin-bottom: 20px;
    animation: fadeUp .6s .06s ease both;
  }
  .hero-h1 em { font-style: normal; color: var(--fire); display: block; }
  .hero-desc {
    font-size: 15px; color: var(--mid); line-height: 1.7;
    max-width: 440px; margin-bottom: 32px;
    animation: fadeUp .6s .12s ease both;
  }
  .hero-actions {
    display: flex; gap: 12px; margin-bottom: 36px;
    animation: fadeUp .6s .18s ease both;
  }
  .btn-hero-lg {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 30px; border-radius: 6px; font-size: 14px; font-weight: 600;
    color: var(--hi); background: var(--fire); border: none; text-decoration: none;
    cursor: none; font-family: var(--body); letter-spacing: .01em;
    transition: all .3s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 0 32px rgba(255,122,0,.22);
  }
  .btn-hero-lg:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,122,0,.38); }
  .btn-hero-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 6px; font-size: 14px; font-weight: 500;
    color: var(--mid); border: 1px solid var(--rule); background: transparent;
    text-decoration: none; cursor: none; font-family: var(--body); letter-spacing: .01em;
    transition: all .25s;
  }
  .btn-hero-ghost:hover { color: var(--hi); border-color: rgba(255,255,255,.14); }

  /* Trust row */
  .hero-trust {
    display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 24px;
    animation: fadeUp .6s .24s ease both;
  }
  .trust-pill {
    display: flex; align-items: center; gap: 7px;
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    color: var(--lo); letter-spacing: .06em; text-transform: uppercase;
  }
  .trust-pill svg { color: var(--mid); }

  /* Right column — command display */
  .hero-right {
    position: relative; z-index: 2; overflow: hidden;
  }

  /* Cylinder stage */
  .cyl-stage {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-52%, -50%);
    width: 360px;
  }
  .cyl-img {
    width: 100%; display: block;
    mix-blend-mode: screen;
    filter: drop-shadow(0 24px 48px rgba(0,0,0,.9)) drop-shadow(0 0 64px rgba(255,122,0,.22));
    animation: driftSlow 9s ease-in-out infinite;
    position: relative; z-index: 2;
  }
  .cyl-pedestal-wrap {
    position: relative; margin-top: -24px; z-index: 1; text-align: center;
  }
  .cyl-pedestal {
    display: inline-block;
    width: 260px; height: 16px;
    background: radial-gradient(ellipse 80% 100%, #251000 0%, #0a0400 100%);
    border-radius: 50%;
    box-shadow: 0 0 40px rgba(255,122,0,.4), 0 0 100px rgba(255,122,0,.15);
    animation: glowPulse 3.5s ease-in-out infinite;
    position: relative;
  }
  .cyl-led-ring {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    width: 300px; height: 300px; border-radius: 50%;
    border: 1px solid rgba(255,122,0,.22);
    animation: ledPulse 4s ease-in-out infinite;
    pointer-events: none;
  }
  .cyl-led-ring-2 {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    width: 360px; height: 360px; border-radius: 50%;
    border: 1px solid rgba(255,122,0,.08);
    pointer-events: none;
  }
  .cyl-ground-glow {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    width: 220px; height: 40px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(255,122,0,.28), transparent 70%);
    animation: glowPulse 3.5s ease-in-out infinite;
    pointer-events: none;
  }

  /* HMI stat modules */
  .hmi {
    position: absolute; z-index: 4;
    background: rgba(8,12,20,.88);
    border: 1px solid var(--rule);
    padding: 14px 18px; min-width: 190px;
    animation: fadeIn .8s ease both;
  }
  .hmi::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: var(--fire);
  }
  .hmi-label {
    font-family: var(--mono); font-size: 9px; font-weight: 500;
    color: var(--mid); letter-spacing: .14em; text-transform: uppercase; margin-bottom: 6px;
  }
  .hmi-value {
    font-family: var(--mono); font-size: 22px; font-weight: 700;
    color: var(--hi); line-height: 1;
  }
  .hmi-sub { font-family: var(--mono); font-size: 10px; color: var(--lo); margin-top: 4px; }
  .hmi-dot {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--mono); font-size: 9px; font-weight: 500;
    text-transform: uppercase; letter-spacing: .08em;
  }
  .hmi-dot-led {
    width: 5px; height: 5px; border-radius: 50%;
    animation: glowPulse 2s ease-in-out infinite;
  }

  /* Hero scroll indicator */
  .scroll-cue {
    position: absolute; bottom: 12px; left: 10%;
    font-family: var(--mono); font-size: 8.5px; color: var(--lo);
    letter-spacing: .16em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px; z-index: 3;
    opacity: 0.7; pointer-events: none;
    animation: fadeIn 1.2s 1s ease both;
  }
  .scroll-cue-line { width: 24px; height: 1px; background: var(--lo); }

  /* ── MARQUEE ── */
  .marquee-wrap {
    overflow: hidden; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
    background: rgba(8,12,20,.7); position: relative; z-index: 2;
  }
  .marquee-track { display: flex; width: max-content; animation: marquee 32s linear infinite; }
  .marquee-item {
    display: flex; align-items: center; gap: 10px; padding: 12px 32px;
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    color: var(--lo); letter-spacing: .1em; text-transform: uppercase;
    border-right: 1px solid var(--rule); white-space: nowrap;
  }
  .marquee-item-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--fire); flex-shrink: 0; }

  /* ── SECTION BASE ── */
  .sec { padding: 120px 0; position: relative; z-index: 1; }
  .sec-inner { max-width: 1360px; margin: 0 auto; padding: 0 40px; }
  .sec-rule { width: 100%; height: 1px; background: var(--rule); }
  .sec-num {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    color: var(--fire); letter-spacing: .14em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px; margin-bottom: 48px;
  }
  .sec-num-line { flex: 1; height: 1px; background: var(--rule); max-width: 48px; }
  .sec-h {
    font-family: var(--head); font-weight: 700;
    font-size: clamp(32px, 4vw, 52px); line-height: 1.06;
    letter-spacing: -.03em; color: var(--hi);
  }
  .sec-h em { font-style: normal; color: var(--fire); }
  .sec-p { font-size: 15px; color: var(--mid); line-height: 1.7; max-width: 480px; }

  /* ── FEATURE EXPLORER ── */
  .feat-head { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; margin-bottom: 64px; }
  .feat-tabs-strip {
    display: flex; border: 1px solid var(--rule); overflow: hidden;
    background: rgba(8,12,20,.5);
  }
  .feat-tab {
    flex: 1; padding: 14px 10px 13px; cursor: none; transition: all .2s;
    border-right: 1px solid var(--rule); background: transparent; border-top: none; border-bottom: none; border-left: none;
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    position: relative;
  }
  .feat-tab:last-child { border-right: none; }
  .feat-tab::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--fire); transform: scaleX(0); transition: transform .25s;
  }
  .feat-tab.act::after { transform: scaleX(1); }
  .feat-tab.act { background: rgba(255,122,0,.04); }
  .feat-tab-icon { color: var(--lo); transition: color .2s; }
  .feat-tab.act .feat-tab-icon, .feat-tab:hover .feat-tab-icon { color: var(--fire); }
  .feat-tab-label {
    font-family: var(--mono); font-size: 8.5px; font-weight: 500;
    color: var(--lo); letter-spacing: .08em; text-transform: uppercase;
    transition: color .2s; text-align: center; line-height: 1.3;
  }
  .feat-tab.act .feat-tab-label, .feat-tab:hover .feat-tab-label { color: var(--mid); }

  /* Feature detail panel */
  .feat-panel {
    border: 1px solid var(--rule); background: rgba(8,12,20,.6);
    position: relative; overflow: hidden;
    display: grid; grid-template-columns: 1fr 1.6fr;
  }
  .feat-panel-info {
    padding: 40px 36px; border-right: 1px solid var(--rule);
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .feat-panel-tag {
    font-family: var(--mono); font-size: 9px; font-weight: 500;
    color: var(--fire); letter-spacing: .14em; text-transform: uppercase;
    display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
  }
  .feat-panel-tag-line { width: 20px; height: 1px; background: var(--fire); }
  .feat-panel-title { font-family: var(--head); font-size: 22px; font-weight: 700; line-height: 1.2; letter-spacing: -.02em; margin-bottom: 12px; }
  .feat-panel-desc { font-size: 14px; color: var(--mid); line-height: 1.7; }
  .feat-panel-url { font-family: var(--mono); font-size: 10px; color: var(--lo); margin-top: 20px; display: flex; align-items: center; gap: 6px; }
  .feat-panel-url-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
  .feat-panel-mock {
    background: var(--ink); overflow-y: auto; max-height: 520px;
    position: relative;
  }
  .feat-panel-mock::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--fire); opacity: .6;
    animation: scanline 6s ease-in-out infinite;
    pointer-events: none; z-index: 10;
  }
  .feat-panel-mock-inner { padding: 28px; min-height: 480px; }

  /* Mock app primitives (same data, new skin) */
  .mk-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .mk-t { font-family: var(--head); font-size: 15px; font-weight: 700; }
  .mk-s { font-size: 11px; color: var(--mid); margin-top: 2px; font-family: var(--mono); }
  .mk-btn { padding: 7px 14px; font-size: 11px; font-weight: 600; border: none; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 5px; font-family: var(--body); letter-spacing: .01em; }
  .mk-btn-p { background: var(--fire); color: var(--hi); }
  .mk-btn-p:hover { background: #e06800; }
  .mk-btn-s { background: rgba(255,255,255,.05); color: var(--hi); border: 1px solid var(--rule); }
  .mk-btn-s:hover { background: rgba(255,255,255,.09); }
  .mk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px,1fr)); gap: 8px; margin-bottom: 16px; }
  .mk-stat { background: rgba(255,255,255,.03); border: 1px solid var(--rule); padding: 12px 14px; }
  .mk-stat-l { font-family: var(--mono); font-size: 9px; color: var(--lo); text-transform: uppercase; letter-spacing: .06em; }
  .mk-stat-v { font-family: var(--mono); font-size: 16px; font-weight: 700; margin-top: 5px; }
  .mk-card { background: rgba(255,255,255,.025); border: 1px solid var(--rule); padding: 16px; }
  .mk-tw { overflow-x: auto; border: 1px solid var(--rule); }
  .mk-table { width: 100%; border-collapse: collapse; min-width: 400px; }
  .mk-table th { text-align: left; font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--lo); padding: 9px 12px; border-bottom: 1px solid var(--rule); text-transform: uppercase; letter-spacing: .06em; background: rgba(0,0,0,.2); }
  .mk-table td { font-size: 12px; color: #9ba8b6; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,.03); }
  .mk-table tr:last-child td { border-bottom: none; }
  .mk-badge { display: inline-flex; padding: 2px 7px; font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: .04em; }
  .mb-g { background: rgba(29,185,84,.1); color: #1DB954; }
  .mb-a { background: rgba(255,160,0,.1); color: #FFA000; }
  .mb-r { background: rgba(229,57,53,.1); color: #E53935; }
  .mb-b { background: rgba(61,107,255,.1); color: var(--blue); }
  .mk-label { display: block; font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--lo); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; }
  .mk-input, .mk-select {
    width: 100%; padding: 8px 10px; border: 1px solid var(--rule); background: rgba(0,0,0,.3);
    color: var(--hi); font-size: 12px; font-family: var(--body); outline: none;
    transition: border-color .2s; appearance: none;
  }
  .mk-input:focus, .mk-select:focus { border-color: rgba(255,122,0,.4); }
  .mk-fg { margin-bottom: 10px; }

  /* Bottom feature quick nav */
  .feat-nav {
    display: flex; border: 1px solid var(--rule); border-top: none; flex-wrap: wrap;
  }
  .feat-nav-item {
    flex: 1; min-width: 140px; padding: 20px 16px; text-align: left;
    border-right: 1px solid var(--rule); transition: background .2s; cursor: none; position: relative;
  }
  .feat-nav-item:last-child { border-right: none; }
  .feat-nav-item:hover { background: rgba(255,122,0,.03); }
  .feat-nav-item:hover .fni-icon { color: var(--fire); }
  .fni-icon { color: var(--lo); margin-bottom: 8px; transition: color .2s; }
  .fni-t { font-size: 12px; font-weight: 600; color: var(--hi); margin-bottom: 2px; }
  .fni-s { font-size: 11px; color: var(--lo); font-family: var(--mono); }

  /* ── PREVIEW SECTION ── */
  .preview-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px; align-items: center; }
  .preview-title { font-family: var(--head); font-size: clamp(26px,3vw,40px); font-weight: 700; line-height: 1.1; letter-spacing: -.025em; margin-bottom: 14px; }
  .preview-title em { font-style: normal; color: var(--fire); }
  .preview-body { font-size: 15px; color: var(--mid); line-height: 1.7; margin-bottom: 24px; }
  .preview-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  .preview-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--mid); line-height: 1.5; }
  .preview-list-check { width: 18px; height: 18px; flex-shrink: 0; border: 1px solid var(--rule-fire); display: flex; align-items: center; justify-content: center; color: var(--fire); margin-top: 1px; }
  .preview-img-frame {
    border: 1px solid var(--rule);
    box-shadow: 0 32px 80px rgba(0,0,0,.6);
    position: relative; overflow: hidden;
  }
  .preview-img-frame img { width: 100%; display: block; }
  .preview-img-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--fire), transparent);
    animation: scanline 5s ease-in-out infinite;
  }

  /* ── HOW IT WORKS ── */
  .hiw-grid-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
  .hiw-card-step {
    border: 1px solid var(--rule); padding: 32px 28px; background: rgba(8,12,20,.6);
    position: relative; transition: border-color .25s, transform .25s;
  }
  .hiw-card-step:hover { border-color: rgba(255,122,0,.35); transform: translateY(-3px); }
  .hiw-step-num-wrap {
    width: 40px; height: 40px; border: 1px solid var(--rule-fire);
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,122,0,.06); margin-bottom: 20px;
  }
  .hiw-step-num { font-family: var(--mono); font-size: 11px; font-weight: 700; color: var(--fire); }
  .hiw-step-label { font-family: var(--mono); font-size: 9px; color: var(--fire); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 6px; }
  .hiw-step-title { font-family: var(--head); font-size: 17px; font-weight: 700; letter-spacing: -.01em; margin-bottom: 8px; }
  .hiw-step-desc { font-size: 13px; color: var(--mid); line-height: 1.65; }
  .hiw-stat-sub { font-family: var(--mono); font-size: 10px; color: var(--lo); margin-top: 2px; }

  /* ── CTA ── */
  .cta {
    padding: 160px 0; position: relative; z-index: 1;
    border-top: 1px solid var(--rule);
  }
  .cta-inner { max-width: 1360px; margin: 0 auto; padding: 0 40px; }
  .cta-glow {
    position: absolute; pointer-events: none; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,122,0,.07), transparent 60%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
  }
  .cta-layout { display: grid; grid-template-columns: 1fr auto; gap: 60px; align-items: center; }
  .cta-h {
    font-family: var(--head); font-weight: 700;
    font-size: clamp(36px,5vw,64px); line-height: 1.03; letter-spacing: -.04em;
    margin-bottom: 16px; position: relative; z-index: 1;
  }
  .cta-h em { font-style: normal; color: var(--fire); }
  .cta-p { font-size: 15px; color: var(--mid); line-height: 1.65; max-width: 420px; position: relative; z-index: 1; }
  .cta-actions { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; position: relative; z-index: 1; flex-shrink: 0; }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--rule); padding: 56px 0 28px; position: relative; z-index: 1;
    background: rgba(5,8,14,.9);
  }
  .footer-inner { max-width: 1360px; margin: 0 auto; padding: 0 40px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
  .footer-brand { font-family: var(--head); font-size: 15px; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
  .footer-brand-mark { width: 30px; height: 30px; background: var(--fire); display: flex; align-items: center; justify-content: center; }
  .footer-p { font-size: 13px; color: var(--lo); line-height: 1.7; max-width: 260px; margin-bottom: 14px; }
  .footer-made { font-family: var(--mono); font-size: 9px; color: var(--lo); letter-spacing: .1em; text-transform: uppercase; }
  .f-col-label { font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--mid); margin-bottom: 16px; }
  .f-links { list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .f-links a { font-size: 13px; color: var(--lo); text-decoration: none; transition: color .2s; }
  .f-links a:hover { color: var(--hi); }
  .footer-bot {
    border-top: 1px solid var(--rule); padding-top: 22px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: var(--mono); font-size: 10px; color: var(--lo); letter-spacing: .06em;
  }

  /* ── REVEAL ── */
  .rv { opacity: 0; transform: translateY(24px); transition: opacity .75s ease, transform .75s cubic-bezier(.16,1,.3,1); }
  .rv.vi { opacity: 1; transform: translateY(0); }
  .rv-l { opacity: 0; transform: translateX(-24px); transition: opacity .75s ease, transform .75s cubic-bezier(.16,1,.3,1); }
  .rv-l.vi { opacity: 1; transform: translateX(0); }
  .rv-r { opacity: 0; transform: translateX(24px); transition: opacity .75s ease, transform .75s cubic-bezier(.16,1,.3,1); }
  .rv-r.vi { opacity: 1; transform: translateX(0); }
  .d1{transition-delay:.07s;} .d2{transition-delay:.14s;} .d3{transition-delay:.21s;} .d4{transition-delay:.28s;}

  /* ── RESPONSIVE ── */
  @media(max-width:1024px) {
    .hero { grid-template-columns: 1fr; height: auto; min-height: 100vh; padding-bottom: 60px; }
    .hero-right { height: 420px; }
    .cyl-stage { transform: translate(-50%,-50%); width: 280px; }
    .feat-head { grid-template-columns: 1fr; gap: 32px; }
    .feat-panel { grid-template-columns: 1fr; }
    .feat-panel-info { border-right: none; border-bottom: 1px solid var(--rule); }
    .preview-layout { grid-template-columns: 1fr; gap: 48px; }
    .hiw-layout { grid-template-columns: 1fr; }
    .hiw-panel { position: relative; top: 0; }
    .cta-layout { grid-template-columns: 1fr; }
    .cta-actions { align-items: flex-start; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
  @media(max-width:768px) {
    .nav-links { display: none; }
    .mob-toggle { display: block; margin-left: 4px; }
    .nav-actions { gap: 8px; }
    .btn-gl {
      display: inline-flex !important;
      padding: 7px 15px;
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF !important;
      border: 1px solid var(--fire);
      background: var(--fire-dim);
      border-radius: 6px;
      box-shadow: 0 0 12px rgba(255,122,0,.25);
    }
    .btn-fire {
      padding: 7px 14px;
      font-size: 12px;
    }
    .hero-left { padding: 90px 5% 40px; }
    .sec-inner { padding: 0 16px; }
    .nav-inner { padding: 12px 16px; }
    .sec { padding: 80px 0; }
    .feat-tabs-strip { overflow-x: auto; }
    .feat-tab { min-width: 80px; }
    .feat-nav { flex-direction: column; }
    .feat-nav-item { border-right: none; border-bottom: 1px solid var(--rule); }
    .footer-grid { grid-template-columns: 1fr; gap: 28px; }
    .footer-bot { flex-direction: column; gap: 8px; text-align: center; }
    .hmi { display: none !important; }
    body.lp-body { cursor: auto; }
    .cur, .cur-ring { display: none; }
    .cta-layout { gap: 32px; }
  }
  @media(max-width:480px) {
    .nav-brand-sub { display: none; }
    .btn-fire span.btn-text-full { display: none; }
    .btn-fire::after { content: 'Trial'; }
    .hero-actions { flex-direction: column; align-items: flex-start; }
    .hero-trust { gap: 18px; }
  }
`;

/* ─── CONSTANTS (exact original content) ─────────────────────────────────── */
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

const BOTTOM_NAV = [
  { Icon: I.File,   title: "Quick Sales Entry",    sub: "One-tap billing" },
  { Icon: I.Truck,  title: "Delivery Tracking",    sub: "Assign & monitor" },
  { Icon: I.Box,    title: "Stock Management",     sub: "Real-time inventory" },
  { Icon: I.Wallet, title: "Payment Collection",   sub: "Multiple modes" },
  { Icon: I.Bar,    title: "Reports & Analytics",  sub: "Export in one click" },
];

const HOW_STEPS = [
  { label: "Step 01", title: "Register Your Agency",   desc: "Create your agency account with a unique code in minutes. No technical setup needed." },
  { label: "Step 02", title: "Add Your Customers",     desc: "Import or manually add existing customer profiles with their contact and balance details." },
  { label: "Step 03", title: "Start Recording Sales",  desc: "Log cylinder sales, collect payments, and mark udharis as you go — on any device." },
  { label: "Step 04", title: "View Your Reports",      desc: "Check your dashboard for real-time totals, export reports, and stay on top of your business." },
];

const PREVIEW_BULLETS = [
  "See today's sales, collections, and outstanding at a glance",
  "View recent transactions in a clean, sorted table",
  "Monitor cylinder stock by product type",
  "Access everything on mobile — even in low-network areas",
];

const MQ = ["LPG Sales Management","Customer Ledger","Udhari Tracking","Delivery Management","Stock Inventory","Cashbook","Business Reports","Multi-User Access","Works on Mobile","Made for India"];

/* ─── ANIMATED COUNTER ─────────────────────────────────────────────────────── */
function Counter({ to, prefix="", suffix="" }: { to:number; prefix?:string; suffix?:string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / 1800, 1);
          setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: .5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{n.toLocaleString("en-IN")}{suffix}</span>;
}

/* ─── REVEAL HOOK ──────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const els = document.querySelectorAll(".rv,.rv-l,.rv-r");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vi"); });
    }, { threshold: .06, rootMargin: "0px 0px -24px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─── INTERACTIVE PREVIEWS ─────────────────────────────────────────────────── */
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
    </div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--rule)",paddingTop:12}}>
      <div><div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Net Payable</div><div style={{fontFamily:"var(--mono)",fontSize:20,fontWeight:700,color:"var(--fire)"}}>₹{(price*qty).toLocaleString("en-IN")}</div></div>
      <button type="submit" disabled={busy} className="mk-btn mk-btn-p" style={{padding:"10px 20px"}}>{busy?"Generating…":"Create Bill & Save"}</button>
    </div></form>
    :<div className="mk-card" style={{border:"1px solid rgba(255,122,0,.2)",background:"rgba(255,122,0,.02)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,122,0,.1)",paddingBottom:10,marginBottom:12}}><div><div style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:"var(--fire)"}}>{inv.no}</div><div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)"}}>{inv.date}</div></div><span className={`mk-badge ${inv.mode.includes("Udhari")?"mb-r":"mb-g"}`}>{inv.mode.includes("Udhari")?"Pending Credit":"Paid"}</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:12,color:"var(--mid)"}}>
        {[["Customer",inv.cust],["Product",inv.prod],["Qty × Rate",`${inv.qty} × ₹${price}`]].map(([l,v])=><div key={String(l)} style={{display:"flex",justifyContent:"space-between"}}><span>{l}</span><strong style={{color:"var(--hi)"}}>{v}</strong></div>)}
        <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(255,122,0,.1)",paddingTop:6}}><span>Total</span><strong style={{fontFamily:"var(--mono)",color:"var(--fire)",fontSize:15}}>₹{inv.total.toLocaleString("en-IN")}</strong></div>
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
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{Object.keys(data).map(k=><button key={k} onClick={()=>setSel(k)} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",border:`1px solid ${sel===k?"rgba(255,122,0,.3)":"var(--rule)"}`,background:sel===k?"rgba(255,122,0,.05)":"transparent",cursor:"none",textAlign:"left",transition:"all .2s"}}>
        <div style={{width:26,height:26,background:sel===k?"var(--fire)":"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{data[k].init}</div>
        <div><div style={{fontSize:12,fontWeight:700,color:"var(--hi)"}}>{data[k].name}</div><div style={{fontFamily:"var(--mono)",fontSize:10,color:data[k].bal!=="₹0"?"#E53935":"var(--lo)"}}>{data[k].bal!=="₹0"?`Owes: ${data[k].bal}`:"Settled"}</div></div>
      </button>)}</div>
      <div className="mk-card" style={{padding:14}}><div style={{borderBottom:"1px solid var(--rule)",paddingBottom:9,marginBottom:11}}><div style={{fontWeight:700,fontSize:13}}>{cur.name}</div><div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--lo)"}}>{cur.phone}</div></div>
        <div className="mk-tw"><table className="mk-table"><thead><tr><th>Date</th><th>Details</th><th>Amount</th><th>Balance</th></tr></thead>
          <tbody>{cur.tx.map((t:any,i:number)=><tr key={i}><td>{t.date}</td><td><div style={{fontWeight:600,color:"var(--hi)",fontSize:12}}>{t.desc}</div><div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)"}}>{t.type}</div></td><td style={{fontFamily:"var(--mono)",color:t.type==="Dr"?"#E53935":"#1DB954",fontWeight:700}}>{t.type==="Dr"?"+":"-"}{t.amt}</td><td style={{fontFamily:"var(--mono)",fontWeight:700}}>{t.bal}</td></tr>)}</tbody>
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
      <tbody>{Object.entries(bal).map(([n,v])=><tr key={n}><td style={{fontWeight:600,color:"var(--hi)"}}>{n}</td>
        <td style={{fontFamily:"var(--mono)",fontWeight:700,color:v>0?"#E53935":"#1DB954"}}>₹{v.toLocaleString("en-IN")}</td>
        <td><span className={`mk-badge ${v>0?"mb-r":"mb-g"}`}>{v>0?"Pending":"Cleared"}</span></td>
        <td>{v>0&&<div style={{display:"flex",gap:6}}><button className="mk-btn mk-btn-p" style={{padding:"4px 10px",fontSize:10}} onClick={()=>collect(n)}>Collect</button><button className="mk-btn mk-btn-s" style={{padding:"4px 10px",fontSize:10,opacity:rem.includes(n)?.5:1}} onClick={()=>remind(n)}>{rem.includes(n)?"Sent":"Remind"}</button></div>}</td>
      </tr>)}</tbody>
    </table></div>
    <div style={{marginTop:14,padding:"14px 16px",border:"1px solid var(--rule)"}}><div className="mk-s" style={{marginBottom:4}}>Total Outstanding</div><div style={{fontFamily:"var(--mono)",fontSize:22,fontWeight:700,color:"var(--fire)"}}>₹{Object.values(bal).reduce((a,b)=>a+b,0).toLocaleString("en-IN")}</div></div>
  </div>;
}

function CashbookPreview(){
  const entries=[{date:"31 Jul",desc:"Sales — Ramesh Patil",amt:950,type:"in"},{date:"31 Jul",desc:"19kg — Hotel Raj",amt:1850,type:"in"},{date:"30 Jul",desc:"Driver Commission",amt:320,type:"out"},{date:"30 Jul",desc:"Vehicle Fuel",amt:500,type:"out"},{date:"29 Jul",desc:"Payment — Amit Verma",amt:1200,type:"in"}];
  const inf=entries.filter(e=>e.type==="in").reduce((a,b)=>a+b.amt,0);
  const out=entries.filter(e=>e.type==="out").reduce((a,b)=>a+b.amt,0);
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Cashbook & Payments</div><div className="mk-s">Daily cash flow summary</div></div></div>
    <div className="mk-grid">{[["Cash Inflow",`₹${inf.toLocaleString("en-IN")}`,"#1DB954"],["Cash Outflow",`₹${out.toLocaleString("en-IN")}`,"#E53935"],["Net Balance",`₹${(inf-out).toLocaleString("en-IN")}`,inf>out?"#3D6BFF":"#E53935"]].map(([l,v,c])=><div key={String(l)} className="mk-stat"><div className="mk-stat-l">{l}</div><div className="mk-stat-v" style={{color:String(c)}}>{v}</div></div>)}</div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th></tr></thead>
      <tbody>{entries.map((e,i)=><tr key={i}><td>{e.date}</td><td style={{color:"var(--hi)",fontWeight:500}}>{e.desc}</td><td style={{fontFamily:"var(--mono)",fontWeight:700,color:e.type==="in"?"#1DB954":"#E53935"}}>{e.type==="in"?"+":"-"}₹{e.amt.toLocaleString("en-IN")}</td><td><span className={`mk-badge ${e.type==="in"?"mb-g":"mb-r"}`}>{e.type==="in"?"Inflow":"Outflow"}</span></td></tr>)}
      </tbody>
    </table></div>
  </div>;
}

function DeliveryPreview({onSuccess}:PP){
  const boys=[{name:"Raju Kumar",done:3,pending:2,area:"Pune West"},{name:"Santosh Patil",done:4,pending:0,area:"Pune East"},{name:"Vikas Kadam",done:1,pending:2,area:"Hadapsar"}];
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Delivery Boy Manager</div><div className="mk-s">Active delivery assignments</div></div><button className="mk-btn mk-btn-p" onClick={()=>onSuccess("Delivery assigned.")}><I.Plus/> Assign</button></div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>{boys.map(b=><div key={b.name} className="mk-card" style={{padding:14}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,border:"1px solid var(--rule-fire)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--fire)"}}><I.Truck/></div><div><div style={{fontWeight:700,fontSize:13}}>{b.name}</div><div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)"}}>{b.area}</div></div></div>
      <span className={`mk-badge ${b.pending>0?"mb-a":"mb-g"}`}>{b.pending>0?`${b.pending} Pending`:"All Done"}</span>
    </div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>{[["Done",b.done,"#1DB954"],["Pending",b.pending,b.pending>0?"#FFA000":"var(--lo)"],["Total",b.done+b.pending,"var(--hi)"]].map(([l,v,c])=><div key={String(l)} style={{textAlign:"center",padding:"8px",background:"rgba(0,0,0,.2)",border:"1px solid var(--rule)"}}><div style={{fontFamily:"var(--mono)",fontWeight:700,fontSize:15,color:String(c)}}>{v}</div><div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)",textTransform:"uppercase"}}>{l}</div></div>)}</div></div>)}</div>
  </div>;
}

function StockPreview({onSuccess}:PP){
  const [s,setS]=useState({d:142,c:28,sm:15});
  const items=[{k:"d" as const,label:"14.2kg Domestic",cap:200,col:"var(--fire)"},{k:"c" as const,label:"19kg Commercial",cap:60,col:"var(--blue)"},{k:"sm" as const,label:"5kg Cylinder",cap:40,col:"var(--green)"}];
  return (
    <div style={{animation:"cardIn .4s ease both"}}>
      <div className="mk-h"><div><div className="mk-t">Product & Stock</div><div className="mk-s">Live inventory monitor</div></div></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {items.map(item=>{
          const v=s[item.k];const p=Math.round(v/item.cap*100);
          return (
            <div key={item.k} className="mk-card" style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div><div style={{fontWeight:700,fontSize:13}}>{item.label}</div><div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)"}}>Capacity: {item.cap}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:22,fontWeight:700,color:item.col}}>{v}</span>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    <button className="mk-btn mk-btn-p" style={{padding:"2px 7px"}} onClick={()=>setS(x=>({...x,[item.k]:Math.min(x[item.k]+1,item.cap)}))}><I.Plus/></button>
                    <button className="mk-btn mk-btn-s" style={{padding:"2px 7px"}} onClick={()=>{if(v>0){setS(x=>({...x,[item.k]:x[item.k]-1}));onSuccess("Stock updated.");}}}><I.Minus/></button>
                  </div>
                </div>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,.05)"}}>
                <div style={{height:"100%",width:`${p}%`,background:item.col,transition:"width .6s cubic-bezier(.16,1,.3,1)"}}/>
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--lo)",marginTop:4}}>{p}% available</div>
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
    <div className="mk-grid">{[["Total Inflow","₹4,000","#1DB954"],["Total Outflow","₹2,500","#E53935"]].map(([l,v,c])=><div key={String(l)} className="mk-stat"><div className="mk-stat-l">{l}</div><div className="mk-stat-v" style={{color:String(c)}}>{v}</div></div>)}</div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th></tr></thead>
      <tbody>{e.map((x,i)=><tr key={i}><td>{x.date}</td><td style={{color:"var(--hi)",fontWeight:500}}>{x.desc}</td><td style={{fontFamily:"var(--mono)",fontWeight:700,color:x.t==="in"?"#1DB954":"#E53935"}}>{x.t==="in"?"+":"-"}₹{x.amt.toLocaleString("en-IN")}</td><td><span className={`mk-badge ${x.t==="in"?"mb-g":"mb-r"}`}>{x.t==="in"?"Inflow":"Outflow"}</span></td></tr>)}</tbody>
    </table></div>
  </div>;
}

function ReportsPreview(){
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Reports & Analytics</div><div className="mk-s">Monthly sales statement — July 2026</div></div><div style={{display:"flex",gap:6}}><button className="mk-btn mk-btn-s" style={{fontSize:10}}>PDF</button><button className="mk-btn mk-btn-s" style={{fontSize:10}}>Excel</button></div></div>
    <div className="mk-grid">{[["Total Sales","₹3,24,580","var(--fire)"],["Cylinders","428","var(--blue)"],["Udhari","₹18,240","#E53935"],["Net Revenue","₹3,06,340","#1DB954"]].map(([l,v,c])=><div key={String(l)} className="mk-stat"><div className="mk-stat-l">{l}</div><div className="mk-stat-v" style={{color:String(c),fontFamily:"var(--mono)"}}>{v}</div></div>)}</div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Week</th><th>Sales</th><th>Collections</th><th>Udhari</th></tr></thead>
      <tbody>{[["Week 1","₹84,200","₹76,000","₹8,200"],["Week 2","₹79,400","₹71,000","₹8,400"],["Week 3","₹88,600","₹82,000","₹6,600"],["Week 4","₹72,380","₹67,580","₹4,800"]].map(([w,s,c,u])=><tr key={w}><td style={{fontWeight:600}}>{w}</td><td style={{fontFamily:"var(--mono)",color:"var(--hi)"}}>{s}</td><td style={{fontFamily:"var(--mono)",color:"#1DB954"}}>{c}</td><td style={{fontFamily:"var(--mono)",color:"#E53935"}}>{u}</td></tr>)}</tbody>
    </table></div>
  </div>;
}

function UsersPreview({onSuccess}:PP){
  const users=[{name:"Jayesh Patel",role:"Owner",access:"Full Access"},{name:"Priya Mehta",role:"Manager",access:"Reports + Sales"},{name:"Ravi Sharma",role:"Operator",access:"Billing Only"}];
  return <div style={{animation:"cardIn .4s ease both"}}><div className="mk-h"><div><div className="mk-t">Multi-User & Roles</div><div className="mk-s">Agency staff access control</div></div><button className="mk-btn mk-btn-p" onClick={()=>onSuccess("Staff member invited.")}><I.Plus/> Add Staff</button></div>
    <div className="mk-tw"><table className="mk-table"><thead><tr><th>Name</th><th>Role</th><th>Access Level</th><th>Status</th></tr></thead>
      <tbody>{users.map((u,i)=><tr key={i}><td style={{fontWeight:700,color:"var(--hi)"}}>{u.name}</td><td style={{color:"var(--mid)"}}>{u.role}</td><td><span className="mk-badge mb-b">{u.access}</span></td><td><span className="mk-badge mb-g">Active</span></td></tr>)}</tbody>
    </table></div>
    <div style={{marginTop:14,padding:"12px 14px",border:"1px solid var(--rule)",fontSize:12,color:"var(--mid)",lineHeight:1.65,fontFamily:"var(--mono)"}}>Role-based access ensures staff members only see what they need. Protect financial data with Owner-only restrictions.</div>
  </div>;
}

const TRIAL_WA_URL = "https://wa.me/918605601801?text=Hello%20Jayesh%2C%20I%20want%20to%20start%20a%20free%20trial%20for%20LPG%20Agency%20ERP.";
const TRIAL_MAIL_URL = "mailto:jayeshneo07@gmail.com?subject=LPG%20Agency%20ERP%20Trial%20Request&body=Hello%20Jayesh%2C%20I%20am%20interested%20in%20starting%20a%20free%20trial%20for%20my%20LPG%20agency.";

/* ─── MAIN ──────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [activeF, setActiveF] = useState(0);
  const [toast, setToast] = useState("");
  const curRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cylRef  = useRef<HTMLDivElement>(null);

  useReveal();

  useEffect(() => {
    document.body.classList.add("lp-body");
    document.body.style.backgroundColor = "#070B14";
    document.body.style.color = "#FFFFFF";
    document.documentElement.style.backgroundColor = "#070B14";
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

  // Cylinder mouse parallax
  useEffect(() => {
    const hero = document.querySelector(".hero") as HTMLElement;
    if (!hero) return;
    const fn = (e: MouseEvent) => {
      if (!cylRef.current) return;
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) / r.width;
      const y = (e.clientY - r.top  - r.height / 2) / r.height;
      cylRef.current.style.transform = `translate(-52%, calc(-50% + ${y * -8}px)) rotate(${x * 2}deg)`;
    };
    hero.addEventListener("mousemove", fn);
    return () => hero.removeEventListener("mousemove", fn);
  }, []);

  // Cursor
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

  // Toast
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

  return (<div className="lp-page-wrapper">
    <style dangerouslySetInnerHTML={{ __html: CSS }}/>
    <div className="cur"  ref={curRef}/>
    <div className="cur-ring" ref={ringRef}/>

    {/* Toast */}
    {toast && <div style={{ position:"fixed",bottom:24,right:24,zIndex:2000,background:"rgba(8,12,20,.96)",border:"1px solid var(--rule)",padding:"11px 18px",fontSize:12,fontFamily:"var(--mono)",color:"var(--hi)",display:"flex",alignItems:"center",gap:8,animation:"cardIn .3s ease both" }}>
      <span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>{toast}
    </div>}

    {/* Mobile drawer */}
    <div className={`mob-drawer${mobOpen?" open":""}`}>
      <button className="mob-close" onClick={()=>setMobOpen(false)}>✕</button>
      <a href="#features" onClick={()=>setMobOpen(false)}>Features</a>
      <a href="#how" onClick={()=>setMobOpen(false)}>How It Works</a>
      <a href="#features" onClick={()=>setMobOpen(false)}>App Preview</a>
      <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" style={{color:"var(--fire)"}}>Start Free Trial</a>
      <Link to="/login" onClick={()=>setMobOpen(false)}>Login</Link>
    </div>

    {/* ══ NAV ══ */}
    <nav className={`nav${scrolled?" on":""}`}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <div className="nav-brand-mark"><I.Flame/></div>
          <div><div className="nav-brand-name">LPG Agency ERP</div><div className="nav-brand-sub">Smart. Simple. Secure.</div></div>
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">App Preview</a></li>
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

    {/* ══ HERO ══ */}
    <section className="hero">
      <div className="hero-ambient"/>

      {/* LEFT */}
      <div className="hero-left">
        <div className="hero-eyebrow"><div className="hero-eyebrow-line"/>Built for India's LPG Agencies</div>
        <h1 className="hero-h1">
          Run Your LPG Agency<br/>
          <em>Smarter, Faster</em><br/>
          &amp; More Profitable
        </h1>
        <p className="hero-desc">
          Manage bookings, customers, payments, stock, udhari, and reports from one powerful platform. Designed for India. Built for growth.
        </p>
        <div className="hero-actions">
          <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" className="btn-hero-lg">Start Free Trial <I.Arrow/></a>
          <a href="#features" className="btn-hero-ghost"><I.Play/> See App Preview</a>
        </div>
        <div className="hero-trust">
          <div className="trust-pill"><I.Shield/> 100% Secure Data</div>
          <div className="trust-pill"><I.Mobile/> Works Offline</div>
          <div className="trust-pill"><I.Cloud/> Any Device</div>
          <div className="trust-pill"><I.Globe/> Made for India</div>
        </div>
      </div>

      {/* RIGHT — command display */}
      <div className="hero-right">
        {/* Top HMI */}
        <div className="hmi" style={{ top: "18%", right: "4%", animationDelay: ".6s" }}>
          <div className="hmi-label">Today's Collection</div>
          <div className="hmi-value">₹24,580</div>
          <div className="hmi-sub">
            <div className="hmi-dot"><div className="hmi-dot-led" style={{background:"var(--green)"}}/> Live</div>
          </div>
        </div>

        {/* Bottom HMI */}
        <div className="hmi" style={{ bottom: "18%", right: "4%", animationDelay: ".9s" }}>
          <div className="hmi-label">Pending Udhari</div>
          <div className="hmi-value" style={{ color: "var(--red)" }}>₹8,240</div>
          <div className="hmi-sub"><div className="hmi-dot"><div className="hmi-dot-led" style={{background:"var(--red)"}}/> 12 customers</div></div>
        </div>

        {/* Cylinder on pedestal */}
        <div className="cyl-stage" ref={cylRef} style={{ transition: "transform .4s cubic-bezier(.16,1,.3,1)" }}>
          <img src="/cylinder-pedestal.png" alt="LPG Cylinder" className="cyl-img"/>
          <div className="cyl-pedestal-wrap">
            <div className="cyl-pedestal">
              <div className="cyl-led-ring"/>
              <div className="cyl-led-ring-2"/>
              <div className="cyl-ground-glow"/>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-cue"><div className="scroll-cue-line"/>Scroll to explore</div>
    </section>

    {/* ══ MARQUEE ══ */}
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...MQ,...MQ].map((item,i)=><div key={i} className="marquee-item"><div className="marquee-item-dot"/>{item}</div>)}
      </div>
    </div>

    {/* ══ FEATURES ══ */}
    <section className="sec" id="features" style={{ background: "var(--ink2)" }}>
      <div className="sec-inner">
        <div className="feat-head rv">
          <div>
            <div className="sec-num"><span>01</span><div className="sec-num-line"/>Everything You Need</div>
            <h2 className="sec-h">One Platform. All Your <em>Agency Needs.</em></h2>
          </div>
          <div style={{ paddingTop: 8 }}>
            <p className="sec-p">Click any capability below to interact with it and see exactly how our dashboard handles your daily workloads.</p>
          </div>
        </div>

        {/* Feature tabs — instrument panel style */}
        <div className="feat-tabs-strip rv d1">
          {FEATURES.map((f, i) => (
            <button key={i} className={`feat-tab${activeF===i?" act":""}`} onClick={()=>setActiveF(i)}>
              <div className="feat-tab-icon"><f.Icon/></div>
              <div className="feat-tab-label">{f.short}</div>
            </button>
          ))}
        </div>

        {/* Feature detail panel */}
        <div className="feat-panel rv d2">
          <div className="feat-panel-info">
            <div>
              <div className="feat-panel-tag"><div className="feat-panel-tag-line"/>Module {String(activeF+1).padStart(2,"0")}</div>
              <div className="feat-panel-title">{FEATURES[activeF].label}</div>
              <div className="feat-panel-desc">{FEATURES[activeF].desc}</div>
            </div>
            <div className="feat-panel-url"><div className="feat-panel-url-dot"/>{FEATURES[activeF].url}</div>
          </div>
          <div className="feat-panel-mock">
            <div className="feat-panel-mock-inner">{renderPreview()}</div>
          </div>
        </div>

        {/* Bottom navigation bar */}
        <div className="feat-nav rv d3">
          {BOTTOM_NAV.map((b,i)=>(
            <div key={i} className="feat-nav-item">
              <div className="fni-icon"><b.Icon/></div>
              <div className="fni-t">{b.title}</div>
              <div className="fni-s">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ APP PREVIEW ══ */}
    <section className="sec" id="preview" style={{ background: "var(--ink)", borderTop: "1px solid var(--rule)" }}>
      <div className="sec-inner">
        <div className="preview-layout">
          <div className="rv-l">
            <div className="sec-num"><span>02</span><div className="sec-num-line"/>See It Live</div>
            <h2 className="preview-title" style={{marginBottom:16}}>Your Agency Dashboard,<br/><em>All in One Place</em></h2>
            <p className="preview-body">A clean, fast dashboard that shows you exactly what's happening in your business — right when you open the app.</p>
            <ul className="preview-list">
              {PREVIEW_BULLETS.map((b,i)=><li key={i}><div className="preview-list-check"><I.Check/></div>{b}</li>)}
            </ul>
            <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" className="btn-fire" style={{ display:"inline-flex" }}>Start Free Trial <I.Arrow/></a>
          </div>
          <div className="rv-r">
            <div className="preview-img-frame">
              <img src="/real-dashboard.png" alt="Real LPG Agency ERP Dashboard"/>
              <div className="preview-img-bar"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ══ HOW IT WORKS ══ */}
    <section className="sec" id="how" style={{ background: "var(--ink2)", borderTop: "1px solid var(--rule)" }}>
      <div className="sec-inner">
        <div className="sec-num rv"><span>03</span><div className="sec-num-line"/>Simple Process</div>
        <h2 className="sec-h rv" style={{marginBottom:64}}>Up &amp; Running in<br/><em>4 Easy Steps</em></h2>
        <div className="hiw-grid-steps rv d1">
          {HOW_STEPS.map((s,i)=>(
            <div key={i} className="hiw-card-step">
              <div className="hiw-step-num-wrap"><div className="hiw-step-num">{String(i+1).padStart(2,"0")}</div></div>
              <div className="hiw-step-label">{s.label}</div>
              <div className="hiw-step-title">{s.title}</div>
              <div className="hiw-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ CTA ══ */}
    <section className="cta">
      <div className="cta-glow"/>
      <div className="cta-inner">
        <div className="cta-layout rv">
          <div>
            <h2 className="cta-h">Ready to Transform<br/><em>Your Gas Agency?</em></h2>
            <p className="cta-p">Start your free trial today. No credit card needed. No setup fees. Just your agency, running smarter.</p>
          </div>
          <div className="cta-actions">
            <a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer" className="btn-hero-lg" style={{fontSize:15,padding:"15px 32px"}}>Start Free Trial <I.Arrow/></a>
            <a href="#features" className="btn-hero-ghost" style={{fontSize:14,padding:"13px 28px"}}>Explore Features</a>
          </div>
        </div>
      </div>
    </section>

    {/* ══ FOOTER ══ */}
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><div className="footer-brand-mark"><I.Flame/></div>LPG Agency ERP</div>
            <p className="footer-p">India's trusted LPG gas agency management platform. Built to make every agency owner's life simpler.</p>
            <div className="footer-made">Made with care in India</div>
          </div>
          <div>
            <div className="f-col-label">Product</div>
            <ul className="f-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#features">App Preview</a></li>
              <li><Link to="/login" style={{color:"var(--lo)",textDecoration:"none"}}>Login</Link></li>
            </ul>
          </div>
          <div>
            <div className="f-col-label">Features</div>
            <ul className="f-links">
              <li><a href="#features">Sales Management</a></li>
              <li><a href="#features">Udhari Tracking</a></li>
              <li><a href="#features">Customer Ledger</a></li>
              <li><a href="#features">Reports &amp; Analytics</a></li>
            </ul>
          </div>
          <div>
            <div className="f-col-label">Support</div>
            <ul className="f-links">
              <li><a href={TRIAL_WA_URL} target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 LPG Agency ERP. All rights reserved.</span>
          <span>Smart. Simple. Secure.</span>
        </div>
      </div>
    </footer>
  </div>);
}
