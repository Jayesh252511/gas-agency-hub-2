import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/landing")({ component: LandingPage });

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Inline styles + keyframes (no external deps needed)                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');

  :root {
    --navy:   #07091a;
    --navy2:  #0c1130;
    --blue:   #1e4cc3;
    --blue2:  #2563eb;
    --indigo: #4338ca;
    --saffron:#f97316;
    --amber:  #fb923c;
    --gold:   #fbbf24;
    --white:  #f8fafc;
    --muted:  #94a3b8;
    --card:   rgba(14,22,56,0.7);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body.landing-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--navy);
    color: var(--white);
    overflow-x: hidden;
  }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-18px) rotate(1.5deg); }
  }
  @keyframes floatSlow {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-10px); }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 32px 8px rgba(249,115,22,0.18); }
    50%      { box-shadow: 0 0 64px 24px rgba(249,115,22,0.36); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes counter {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes scribble-draw {
    from { stroke-dashoffset: 1000; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes particle-float {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
    50%  { transform: translateY(-60px) translateX(20px) scale(1.1); opacity: 0.5; }
    100% { transform: translateY(-120px) translateX(-10px) scale(0.8); opacity: 0; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes badge-ping {
    0%    { transform: scale(1); opacity: 1; }
    75%,100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes nav-slide-down {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradient-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* ── Utility ── */
  .land-section { padding: 96px 24px; max-width: 1200px; margin: 0 auto; }
  .land-section-full { padding: 96px 0; width: 100%; }

  .shimmer-text {
    background: linear-gradient(90deg, #f97316 0%, #fbbf24 25%, #f8fafc 50%, #fbbf24 75%, #f97316 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
  .gradient-text {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .saffron-text {
    background: linear-gradient(90deg, #f97316, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-card {
    background: rgba(14,22,56,0.65);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
  }
  .glass-card-light {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
  }

  /* Nav */
  .land-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    animation: nav-slide-down 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .land-nav.scrolled {
    background: rgba(7,9,26,0.92);
    backdrop-filter: blur(24px);
    box-shadow: 0 1px 0 rgba(255,255,255,0.06);
  }
  .land-nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px;
  }
  .land-nav-logo {
    display: flex; align-items: center; gap: 12px;
    text-decoration: none;
  }
  .land-nav-logo-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, #f97316, #1e4cc3);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    flex-shrink: 0;
  }
  .land-nav-logo-text { line-height: 1.2; }
  .land-nav-logo-name { font-weight: 800; font-size: 15px; color: #f8fafc; }
  .land-nav-logo-sub  { font-size: 11px; color: #94a3b8; font-weight: 500; }
  .land-nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  .land-nav-links a {
    color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500;
    transition: color 0.2s;
  }
  .land-nav-links a:hover { color: #f8fafc; }
  .land-nav-buttons { display: flex; gap: 10px; align-items: center; }
  .btn-ghost {
    padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 600;
    color: #f8fafc; border: 1px solid rgba(255,255,255,0.12);
    background: transparent; cursor: pointer; text-decoration: none;
    transition: all 0.2s ease;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
  .btn-primary {
    padding: 9px 20px; border-radius: 10px; font-size: 14px; font-weight: 700;
    color: #fff; background: linear-gradient(135deg, #f97316, #ea580c);
    border: none; cursor: pointer; text-decoration: none;
    box-shadow: 0 4px 16px rgba(249,115,22,0.35);
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-primary:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px rgba(249,115,22,0.5); }
  .btn-primary:active { transform: scale(0.97); }

  /* Hero */
  .hero-section {
    min-height: 100vh; display: flex; align-items: center;
    position: relative; overflow: hidden;
    padding: 120px 24px 80px;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(30,76,195,0.2) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 80% 70%, rgba(249,115,22,0.12) 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 10% 80%, rgba(67,56,202,0.12) 0%, transparent 60%),
                var(--navy);
  }
  .hero-inner {
    max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
    width: 100%;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 100px;
    background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.25);
    font-size: 12px; font-weight: 600; color: #fb923c;
    margin-bottom: 20px; animation: fadeUp 0.5s ease forwards;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #f97316;
    position: relative;
  }
  .hero-badge-dot::after {
    content: ''; position: absolute; inset: -2px; border-radius: 50%;
    border: 2px solid #f97316; animation: badge-ping 1.5s ease infinite;
  }
  .hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px); font-weight: 800; line-height: 1.1;
    margin-bottom: 20px; animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-desc {
    font-size: 17px; color: #94a3b8; line-height: 1.7; max-width: 520px;
    animation: fadeUp 0.6s 0.2s ease both; margin-bottom: 36px;
  }
  .hero-cta-row {
    display: flex; gap: 14px; flex-wrap: wrap;
    animation: fadeUp 0.6s 0.3s ease both;
  }
  .btn-hero-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 32px; border-radius: 14px; font-size: 16px; font-weight: 700;
    color: #fff; background: linear-gradient(135deg, #f97316, #ea580c);
    border: none; cursor: pointer; text-decoration: none;
    box-shadow: 0 6px 24px rgba(249,115,22,0.4);
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-hero-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 12px 36px rgba(249,115,22,0.55); }
  .btn-hero-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 32px; border-radius: 14px; font-size: 16px; font-weight: 600;
    color: #f8fafc; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04); text-decoration: none;
    transition: all 0.2s ease;
  }
  .btn-hero-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }

  .hero-stats {
    display: flex; gap: 32px; margin-top: 48px;
    animation: fadeUp 0.6s 0.4s ease both;
  }
  .hero-stat-item { text-align: center; }
  .hero-stat-num { font-size: 28px; font-weight: 800; }
  .hero-stat-label { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px; }
  .hero-stat-divider { width: 1px; background: rgba(255,255,255,0.08); align-self: stretch; }

  .hero-img-wrap {
    display: flex; justify-content: center; align-items: center;
    position: relative; animation: fadeIn 0.8s 0.3s ease both;
  }
  .hero-cylinder {
    width: min(420px, 90vw); aspect-ratio: 1;
    object-fit: contain;
    animation: float 5s ease-in-out infinite;
    filter: drop-shadow(0 32px 64px rgba(249,115,22,0.25));
    position: relative; z-index: 2;
  }
  .hero-glow-ring {
    position: absolute; inset: 10%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(249,115,22,0.12) 0%, transparent 70%);
    animation: pulse-glow 3s ease-in-out infinite;
    z-index: 1;
  }
  .hero-orbit {
    position: absolute; inset: -10%;
    border-radius: 50%;
    border: 1px solid rgba(249,115,22,0.1);
    animation: spin-slow 20s linear infinite;
  }
  .hero-orbit-dot {
    position: absolute; top: -4px; left: 50%; transform: translateX(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: #f97316;
    box-shadow: 0 0 12px rgba(249,115,22,0.8);
  }

  /* Floating mini cards on hero */
  .hero-float-card {
    position: absolute; padding: 10px 14px;
    border-radius: 12px; backdrop-filter: blur(16px);
    background: rgba(14,22,56,0.85);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 13px; font-weight: 600; color: #f8fafc;
    display: flex; align-items: center; gap: 8px;
    white-space: nowrap; z-index: 10;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .hero-float-card.card-1 {
    top: 8%; right: -5%;
    animation: floatSlow 3.2s ease-in-out infinite;
  }
  .hero-float-card.card-2 {
    bottom: 15%; left: -8%;
    animation: floatSlow 4s 0.8s ease-in-out infinite;
  }
  .hero-float-card.card-3 {
    bottom: 30%; right: -8%;
    animation: floatSlow 3.5s 1.2s ease-in-out infinite;
  }
  .float-card-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  /* Scribble SVGs */
  .scribble-svg {
    position: absolute; pointer-events: none; overflow: visible;
  }
  .scribble-path {
    fill: none; stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 1000; stroke-dashoffset: 0;
    animation: scribble-draw 2s ease forwards;
  }

  /* Marquee brand strip */
  .marquee-strip {
    overflow: hidden; padding: 20px 0;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
  }
  .marquee-track {
    display: flex; gap: 48px; align-items: center;
    animation: marquee 18s linear infinite;
    white-space: nowrap; width: max-content;
  }
  .marquee-item {
    display: flex; align-items: center; gap: 10px;
    color: #475569; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .marquee-item span { font-size: 20px; }

  /* Features */
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    margin-top: 56px;
  }
  .feature-card {
    padding: 28px; border-radius: 20px;
    background: rgba(14,22,56,0.6);
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor: default; position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .feature-card:hover {
    transform: translateY(-6px);
    border-color: rgba(249,115,22,0.2);
    background: rgba(20,30,75,0.8);
    box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.1);
  }
  .feature-card:hover::before { opacity: 1; }
  .feature-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 16px;
  }
  .feature-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .feature-desc { font-size: 14px; color: #64748b; line-height: 1.6; }

  /* Section headings */
  .section-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: #f97316; margin-bottom: 14px;
  }
  .section-eyebrow::before, .section-eyebrow::after {
    content: ''; display: block;
    width: 24px; height: 1px; background: #f97316;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 48px); font-weight: 800; line-height: 1.15;
    margin-bottom: 16px;
  }
  .section-desc {
    font-size: 16px; color: #64748b; line-height: 1.7; max-width: 560px; margin: 0 auto;
  }
  .text-center { text-align: center; }

  /* How it works */
  .how-steps { display: flex; gap: 0; margin-top: 56px; position: relative; }
  .how-steps::before {
    content: ''; position: absolute; top: 32px; left: calc(16.67% - 1px); right: calc(16.67% - 1px);
    height: 1px; background: linear-gradient(90deg, rgba(249,115,22,0.4), rgba(249,115,22,0.1));
    z-index: 0;
  }
  .how-step { flex: 1; text-align: center; padding: 0 16px; position: relative; z-index: 1; }
  .how-step-num {
    width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 800;
    background: linear-gradient(135deg, rgba(249,115,22,0.15), rgba(30,76,195,0.15));
    border: 2px solid rgba(249,115,22,0.3);
    position: relative;
  }
  .how-step-num::after {
    content: ''; position: absolute; inset: -4px; border-radius: 50%;
    border: 1px solid rgba(249,115,22,0.1);
  }
  .how-step-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .how-step-desc { font-size: 13px; color: #64748b; line-height: 1.6; }

  /* Dashboard preview */
  .preview-img {
    width: 100%; border-radius: 20px;
    box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
    animation: floatSlow 6s ease-in-out infinite;
  }
  .preview-wrap {
    position: relative; padding: 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 28px;
  }
  .preview-wrap::before {
    content: ''; position: absolute; top: -1px; left: 60px; right: 60px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent);
  }

  /* Testimonials */
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
  .testimonial-card {
    padding: 24px; border-radius: 20px;
    background: rgba(14,22,56,0.6);
    border: 1px solid rgba(255,255,255,0.07);
    transition: transform 0.3s ease;
  }
  .testimonial-card:hover { transform: translateY(-4px); }
  .testimonial-stars { color: #fbbf24; font-size: 14px; margin-bottom: 12px; }
  .testimonial-text { font-size: 14px; color: #94a3b8; line-height: 1.7; font-style: italic; margin-bottom: 16px; }
  .testimonial-author { display: flex; align-items: center; gap: 10px; }
  .testimonial-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #1e4cc3, #f97316);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff;
  }
  .testimonial-name { font-size: 14px; font-weight: 700; }
  .testimonial-role { font-size: 12px; color: #64748b; }

  /* Stats section */
  .stats-section {
    background: linear-gradient(135deg, rgba(30,76,195,0.12) 0%, rgba(249,115,22,0.08) 100%);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
  .stat-item {
    padding: 48px 32px; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.05);
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 48px; font-weight: 800; line-height: 1;
  }
  .stat-label { font-size: 14px; color: #64748b; margin-top: 8px; font-weight: 500; }

  /* Pricing */
  .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
  .pricing-card {
    padding: 32px; border-radius: 24px;
    background: rgba(14,22,56,0.6); border: 1px solid rgba(255,255,255,0.07);
    position: relative; overflow: hidden;
    transition: transform 0.3s ease;
  }
  .pricing-card:hover { transform: translateY(-6px); }
  .pricing-card.popular {
    background: linear-gradient(135deg, rgba(30,76,195,0.2), rgba(249,115,22,0.1));
    border-color: rgba(249,115,22,0.3);
    box-shadow: 0 0 60px rgba(249,115,22,0.1);
  }
  .pricing-popular-badge {
    position: absolute; top: 16px; right: 16px;
    padding: 4px 12px; border-radius: 100px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    font-size: 11px; font-weight: 700; color: #fff;
  }
  .pricing-plan { font-size: 13px; font-weight: 600; color: #f97316; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
  .pricing-price { font-size: 40px; font-weight: 800; margin-bottom: 4px; }
  .pricing-price sub { font-size: 16px; vertical-align: bottom; margin-bottom: 4px; }
  .pricing-price sup { font-size: 20px; }
  .pricing-period { font-size: 13px; color: #64748b; margin-bottom: 24px; }
  .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
  .pricing-features li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; }
  .pricing-features li::before { content: '✓'; color: #22c55e; font-weight: 700; flex-shrink: 0; }
  .btn-pricing {
    width: 100%; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700;
    cursor: pointer; text-decoration: none; display: block; text-align: center;
    transition: all 0.2s ease;
  }
  .btn-pricing-outline {
    background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #f8fafc;
  }
  .btn-pricing-outline:hover { background: rgba(255,255,255,0.06); }
  .btn-pricing-fill {
    background: linear-gradient(135deg, #f97316, #ea580c); border: none; color: #fff;
    box-shadow: 0 6px 20px rgba(249,115,22,0.35);
  }
  .btn-pricing-fill:hover { box-shadow: 0 10px 30px rgba(249,115,22,0.5); transform: translateY(-2px); }

  /* CTA Section */
  .cta-section {
    background: linear-gradient(135deg, #0c1130, #111827);
    border-radius: 32px; margin: 0 24px;
    padding: 80px 48px; text-align: center; position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: ''; position: absolute; top: -50%; left: -20%; right: -20%; bottom: -50%;
    background: radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .cta-glow-left {
    position: absolute; left: -80px; top: 50%; transform: translateY(-50%);
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(30,76,195,0.3) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-glow-right {
    position: absolute; right: -80px; top: 50%; transform: translateY(-50%);
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Footer */
  .land-footer {
    padding: 64px 24px 32px; max-width: 1200px; margin: 0 auto;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
  .footer-brand-name { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
  .footer-brand-desc { font-size: 13px; color: #64748b; line-height: 1.7; max-width: 260px; margin-bottom: 20px; }
  .footer-social { display: flex; gap: 10px; }
  .footer-social-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; color: inherit;
  }
  .footer-social-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
  .footer-col-title { font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.06em; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a { font-size: 14px; color: #64748b; text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: #f8fafc; }
  .footer-bottom {
    padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px; color: #475569;
  }
  .india-flag { display: inline-flex; align-items: center; gap: 4px; }

  /* Mobile menu */
  .mobile-menu-btn {
    display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
    background: none; border: none;
  }
  .mobile-menu-btn span {
    width: 22px; height: 2px; background: #f8fafc; border-radius: 2px;
    transition: all 0.3s ease;
  }
  .mobile-drawer {
    display: none; position: fixed; inset: 0; z-index: 200;
    background: rgba(7,9,26,0.98); backdrop-filter: blur(20px);
    flex-direction: column; align-items: center; justify-content: center; gap: 32px;
  }
  .mobile-drawer.open { display: flex; }
  .mobile-drawer a {
    font-size: 24px; font-weight: 700; color: #f8fafc; text-decoration: none;
    transition: color 0.2s;
  }
  .mobile-drawer a:hover { color: #f97316; }
  .mobile-close {
    position: absolute; top: 20px; right: 20px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; width: 40px; height: 40px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #f8fafc;
  }

  /* Doodle elements */
  .doodle-wrap {
    position: absolute; pointer-events: none; overflow: visible; opacity: 0.3;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .pricing-grid { grid-template-columns: repeat(2, 1fr); }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .stat-item:nth-child(2) { border-right: none; }
    .stat-item:nth-child(3) { border-top: 1px solid rgba(255,255,255,0.05); }
    .testimonials-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
  @media (max-width: 768px) {
    .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 40px; }
    .hero-img-wrap { order: -1; }
    .hero-cylinder { width: 260px; }
    .hero-cta-row { justify-content: center; }
    .hero-stats { justify-content: center; }
    .hero-desc { margin: 0 auto 36px; }
    .hero-float-card { display: none; }
    .how-steps { flex-direction: column; gap: 32px; }
    .how-steps::before { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .land-nav-links { display: none; }
    .land-nav-buttons .btn-ghost { display: none; }
    .mobile-menu-btn { display: flex; }
    .cta-section { padding: 56px 24px; margin: 0 16px; border-radius: 24px; }
    .land-section { padding: 64px 20px; }
    .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
  }
  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr; }
    .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .stat-item:last-child { border-bottom: none; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Data                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "📊",
    color: "#1e4cc3",
    title: "Sales Management",
    desc: "Record cylinder and regulator sales in seconds. Track daily, monthly revenue with smart summaries.",
  },
  {
    icon: "👥",
    color: "#7c3aed",
    title: "Customer Ledger",
    desc: "Maintain complete digital customer records. Track udhari, payments, and outstanding balances.",
  },
  {
    icon: "🏍️",
    color: "#059669",
    title: "Delivery Boys",
    desc: "Assign deliveries, track performance, and manage delivery staff commissions effortlessly.",
  },
  {
    icon: "💰",
    color: "#f97316",
    title: "Payment Tracking",
    desc: "Record inflow and outflow payments. Never miss a cash entry with real-time cashbook.",
  },
  {
    icon: "📦",
    color: "#dc2626",
    title: "Stock & Inventory",
    desc: "Monitor cylinder stock in real time. Get alerts when cylinders go below threshold levels.",
  },
  {
    icon: "📈",
    color: "#0891b2",
    title: "Analytics & Reports",
    desc: "Generate profit/loss reports, export to Excel/PDF, and gain business insights at a glance.",
  },
  {
    icon: "💸",
    color: "#7c3aed",
    title: "Udhari Management",
    desc: "Track outstanding dues with customer-wise credit history. Send reminders and record payments.",
  },
  {
    icon: "🔔",
    color: "#d97706",
    title: "Smart Notifications",
    desc: "Get alerts for pending payments, low stock, and overdue udharis directly on your device.",
  },
  {
    icon: "🔒",
    color: "#1e4cc3",
    title: "Multi-User Roles",
    desc: "Admin, manager, accountant — assign roles with granular access control and audit logs.",
  },
];

const STEPS = [
  { num: "01", emoji: "🏢", title: "Register Agency", desc: "Create your agency account with unique agency code in minutes." },
  { num: "02", emoji: "👤", title: "Add Customers", desc: "Import or add your existing customers with contact details." },
  { num: "03", emoji: "🛢️", title: "Start Sales", desc: "Record cylinder sales, collect payments, track udharis." },
  { num: "04", emoji: "📊", title: "Get Insights", desc: "View real-time dashboard and export monthly reports instantly." },
];

const TESTIMONIALS = [
  {
    text: "BestCylinder transformed how we manage our 800+ customer base. Udhari tracking alone saved us ₹2 lakhs in lost dues last year.",
    name: "Ramesh Patil",
    role: "Gas Agency Owner, Pune",
    avatar: "RP",
  },
  {
    text: "The dashboard is so clean and fast. My accountant loves the Excel export feature. Best investment for our agency in years.",
    name: "Sunita Sharma",
    role: "Gas Agency Manager, Nagpur",
    avatar: "SS",
  },
  {
    text: "Earlier everything was on paper. Now with BestCylinder, I can check my business status from my phone anywhere, anytime.",
    name: "Vijay Deshmukh",
    role: "LPG Distributor, Nashik",
    avatar: "VD",
  },
];

const MARQUEE_ITEMS = [
  { emoji: "🛢️", text: "LPG Management" },
  { emoji: "🇮🇳", text: "Made in India" },
  { emoji: "📱", text: "Mobile First" },
  { emoji: "💡", text: "Smart Analytics" },
  { emoji: "🔒", text: "Bank-Grade Security" },
  { emoji: "📊", text: "Real-time Reports" },
  { emoji: "💰", text: "Udhari Tracking" },
  { emoji: "🚀", text: "Fast & Reliable" },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Counter Hook                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  IntersectFade                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function IntersectFade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Floating Particles                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 6,
    color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#1e4cc3" : "#fbbf24",
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: 0.4,
            animation: `particle-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Scribble underline SVG                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
function ScribbleUnderline({ color = "#f97316", width = 200 }: { color?: string; width?: number }) {
  return (
    <svg
      viewBox={`0 0 ${width} 14`}
      style={{ width, height: 14, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M4 8 Q${width * 0.25} 4 ${width * 0.5} 8 Q${width * 0.75} 12 ${width - 4} 7`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1000"
        strokeDashoffset="0"
        style={{ animation: "scribble-draw 1.5s ease forwards" }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Doodle Corner decorations                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
function DoodleStars() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20 L24 12 L28 20 L36 24 L28 28 L24 36 L20 28 L12 24 Z" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="200" style={{ animation: "scribble-draw 2s ease forwards" }} />
      <circle cx="70" cy="30" r="4" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeDasharray="50" style={{ animation: "scribble-draw 2s 0.3s ease forwards" }} />
      <path d="M90 60 L93 54 L96 60 L102 63 L96 66 L93 72 L90 66 L84 63 Z" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="200" style={{ animation: "scribble-draw 2s 0.6s ease forwards" }} />
      <circle cx="30" cy="90" r="6" stroke="#f97316" strokeWidth="1.5" fill="none" strokeDasharray="50" style={{ animation: "scribble-draw 2s 0.9s ease forwards" }} />
      <path d="M80 90 Q90 80 100 90 Q90 100 80 90" stroke="#a78bfa" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="100" style={{ animation: "scribble-draw 2s 1.2s ease forwards" }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  StatCounter Component                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function StatCounter({ target, suffix, label, color }: { target: number; suffix: string; label: string; color: string }) {
  const { count, ref } = useCounter(target);
  return (
    <div className="stat-item" ref={ref as any}>
      <div className="stat-num" style={{ color }}>{count.toLocaleString("en-IN")}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Landing Page                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("landing-body");
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => {
      document.body.classList.remove("landing-body");
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* ── MOBILE DRAWER ─────────────────────────────────── */}
      <div className={`mobile-drawer${mobileOpen ? " open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
        <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</a>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
        <Link to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", color: "#fb923c", fontWeight: 800, fontSize: 24 }}>
          Agency Login →
        </Link>
      </div>

      {/* ── NAV ───────────────────────────────────────────── */}
      <nav className={`land-nav${scrolled ? " scrolled" : ""}`}>
        <div className="land-nav-inner">
          {/* Logo */}
          <a href="#" className="land-nav-logo">
            <div className="land-nav-logo-icon">🔥</div>
            <div className="land-nav-logo-text">
              <div className="land-nav-logo-name">BestCylinder</div>
              <div className="land-nav-logo-sub">India's LPG Platform</div>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="land-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#testimonials">Reviews</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>

          {/* CTA buttons */}
          <div className="land-nav-buttons">
            <Link to="/login" className="btn-ghost">Agency Login</Link>
            <Link to="/login" className="btn-primary">Get Started Free</Link>
          </div>

          {/* Mobile hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <Particles />

        {/* Doodle top-right */}
        <div style={{ position: "absolute", top: 120, right: 40, opacity: 0.25, zIndex: 3 }}>
          <DoodleStars />
        </div>
        {/* Doodle bottom-left */}
        <div style={{ position: "absolute", bottom: 80, left: 20, opacity: 0.18, zIndex: 3, transform: "scaleX(-1)" }}>
          <DoodleStars />
        </div>

        {/* Scribble circle doodle */}
        <svg style={{ position: "absolute", top: "35%", left: "5%", opacity: 0.12, pointerEvents: "none" }}
          width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="600" strokeLinecap="round"
            style={{ animation: "scribble-draw 3s ease forwards" }} />
        </svg>

        <div className="hero-inner">
          {/* Left */}
          <div>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              🇮🇳 Built for India's LPG Agencies
            </div>

            <h1 className="hero-title">
              Manage Your
              <br />
              <span className="saffron-text">Gas Agency</span>
              <br />
              <span className="gradient-text">Smarter & Faster</span>
            </h1>

            {/* Scribble underline under "Smarter" */}
            <div style={{ marginTop: -8, marginBottom: 20, paddingLeft: 0 }}>
              <ScribbleUnderline color="#f97316" width={260} />
            </div>

            <p className="hero-desc">
              Complete LPG agency ERP — sales, customers, udhari, stock, payments, and reports.
              Designed for Indian gas distributors. Works on any device, even offline.
            </p>

            <div className="hero-cta-row">
              <Link to="/login" className="btn-hero-primary">
                🚀 Start Free Trial
              </Link>
              <a href="#features" className="btn-hero-secondary">
                ✨ Explore Features
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-num saffron-text">500+</div>
                <div className="hero-stat-label">Agencies</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <div className="hero-stat-num saffron-text">2L+</div>
                <div className="hero-stat-label">Customers</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <div className="hero-stat-num saffron-text">99.9%</div>
                <div className="hero-stat-label">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right — Cylinder */}
          <div className="hero-img-wrap">
            <div className="hero-glow-ring" />
            <div className="hero-orbit"><div className="hero-orbit-dot" /></div>
            <img
              src="/landing-hero-cylinder.png"
              alt="LPG Gas Cylinder"
              className="hero-cylinder"
            />

            {/* Floating mini cards */}
            <div className="hero-float-card card-1">
              <div className="float-card-icon" style={{ background: "rgba(34,197,94,0.15)" }}>📈</div>
              <div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Today's Sales</div>
                <div style={{ fontWeight: 700 }}>₹24,580</div>
              </div>
            </div>
            <div className="hero-float-card card-2">
              <div className="float-card-icon" style={{ background: "rgba(249,115,22,0.15)" }}>🛢️</div>
              <div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Stock Available</div>
                <div style={{ fontWeight: 700 }}>142 Cylinders</div>
              </div>
            </div>
            <div className="hero-float-card card-3">
              <div className="float-card-icon" style={{ background: "rgba(99,102,241,0.15)" }}>💰</div>
              <div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Pending Udhari</div>
                <div style={{ fontWeight: 700, color: "#fb923c" }}>₹8,240</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="marquee-item">
              <span>{item.emoji}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features">
        <div className="land-section">
          <IntersectFade>
            <div className="text-center">
              <div className="section-eyebrow">Everything You Need</div>
              <h2 className="section-title">
                Powerful Features for<br />
                <span className="saffron-text">Every Gas Agency</span>
              </h2>
              <p className="section-desc">
                From sales to reports, BestCylinder handles your entire business workflow — so you can focus on growing your agency.
              </p>
            </div>
          </IntersectFade>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <IntersectFade key={i} delay={i * 0.06}>
                <div className="feature-card">
                  {/* Doodle dot top right */}
                  <div style={{ position: "absolute", top: 16, right: 16, opacity: 0.2 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="4" cy="4" r="2" stroke={f.color} strokeWidth="1.5" fill="none" />
                      <circle cx="12" cy="4" r="2" stroke={f.color} strokeWidth="1.5" fill="none" />
                      <circle cx="20" cy="4" r="2" stroke={f.color} strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                  <div className="feature-icon" style={{ background: `${f.color}18` }}>
                    {f.icon}
                  </div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </IntersectFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <div className="stats-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="stats-grid">
            <StatCounter target={500} suffix="+" label="Active Agencies" color="#f97316" />
            <StatCounter target={200000} suffix="+" label="Customers Managed" color="#60a5fa" />
            <StatCounter target={50} suffix="Cr+" label="Transactions Processed" color="#22c55e" />
            <StatCounter target={99} suffix=".9%" label="Platform Uptime" color="#a78bfa" />
          </div>
        </div>
      </div>

      {/* ── DASHBOARD PREVIEW ─────────────────────────────── */}
      <section style={{ padding: "96px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(30,76,195,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        {/* Large doodle spiral */}
        <svg style={{ position: "absolute", right: -60, top: "20%", opacity: 0.06, pointerEvents: "none" }}
          width="400" height="400" viewBox="0 0 400 400">
          <path d="M200 200 Q300 100 350 200 Q400 300 300 350 Q200 400 100 300 Q0 200 100 100 Q200 0 300 100"
            stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"
            strokeDasharray="2000" style={{ animation: "scribble-draw 4s ease forwards" }} />
        </svg>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <IntersectFade>
            <div className="text-center" style={{ marginBottom: 48 }}>
              <div className="section-eyebrow">See It In Action</div>
              <h2 className="section-title">
                Your Agency Dashboard,<br />
                <span className="gradient-text">All in One Place</span>
              </h2>
            </div>
          </IntersectFade>
          <IntersectFade delay={0.1}>
            <div className="preview-wrap">
              <img src="/landing-dashboard.png" alt="BestCylinder Dashboard" className="preview-img" />
            </div>
          </IntersectFade>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "96px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <IntersectFade>
            <div className="text-center">
              <div className="section-eyebrow">Simple Process</div>
              <h2 className="section-title">
                Up & Running in<br />
                <span className="saffron-text">4 Easy Steps</span>
              </h2>
            </div>
          </IntersectFade>

          <div className="how-steps">
            {STEPS.map((s, i) => (
              <IntersectFade key={i} delay={i * 0.1}>
                <div className="how-step">
                  <div className="how-step-num">
                    <span style={{ fontSize: 26 }}>{s.emoji}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>Step {s.num}</div>
                  <div className="how-step-title">{s.title}</div>
                  <div className="how-step-desc">{s.desc}</div>
                </div>
              </IntersectFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section id="testimonials" style={{ padding: "96px 24px", position: "relative" }}>
        {/* Doodle quote marks */}
        <div style={{ position: "absolute", left: 40, top: 80, fontSize: 200, color: "#f97316", opacity: 0.03, fontFamily: "serif", lineHeight: 1 }}>"</div>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <IntersectFade>
            <div className="text-center">
              <div className="section-eyebrow">Real Stories</div>
              <h2 className="section-title">
                Trusted by Gas Agencies<br />
                <span className="gradient-text">Across India</span>
              </h2>
            </div>
          </IntersectFade>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <IntersectFade key={i} delay={i * 0.1}>
                <div className="testimonial-card">
                  <div className="testimonial-stars">★★★★★</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </IntersectFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <IntersectFade>
            <div className="text-center">
              <div className="section-eyebrow">Transparent Pricing</div>
              <h2 className="section-title">
                Simple Plans,<br />
                <span className="saffron-text">No Hidden Charges</span>
              </h2>
              <p className="section-desc">
                All plans include unlimited cylinder entries, customer records, and 24/7 support. Cancel anytime.
              </p>
            </div>
          </IntersectFade>

          <div className="pricing-grid">
            {/* Starter */}
            <IntersectFade delay={0}>
              <div className="pricing-card">
                <div className="pricing-plan">Starter</div>
                <div className="pricing-price"><sup>₹</sup>999<sub>/mo</sub></div>
                <div className="pricing-period">For small agencies up to 200 customers</div>
                <ul className="pricing-features">
                  <li>Up to 200 Customers</li>
                  <li>Sales & Payment Tracking</li>
                  <li>Basic Reports (PDF)</li>
                  <li>2 Staff Users</li>
                  <li>Mobile App Access</li>
                </ul>
                <Link to="/login" className="btn-pricing btn-pricing-outline">Get Started</Link>
              </div>
            </IntersectFade>

            {/* Pro — Popular */}
            <IntersectFade delay={0.1}>
              <div className="pricing-card popular">
                <div className="pricing-popular-badge">Most Popular</div>
                <div className="pricing-plan">Professional</div>
                <div className="pricing-price"><sup>₹</sup>2,499<sub>/mo</sub></div>
                <div className="pricing-period">For growing agencies up to 1000 customers</div>
                <ul className="pricing-features">
                  <li>Up to 1000 Customers</li>
                  <li>Full Sales & Udhari Management</li>
                  <li>Excel/PDF Reports</li>
                  <li>10 Staff Users</li>
                  <li>Delivery Boy Tracking</li>
                  <li>Analytics Dashboard</li>
                  <li>Priority Support</li>
                </ul>
                <Link to="/login" className="btn-pricing btn-pricing-fill">Start Free Trial</Link>
              </div>
            </IntersectFade>

            {/* Enterprise */}
            <IntersectFade delay={0.2}>
              <div className="pricing-card">
                <div className="pricing-plan">Enterprise</div>
                <div className="pricing-price"><sup>₹</sup>5,999<sub>/mo</sub></div>
                <div className="pricing-period">For large distributors with multiple branches</div>
                <ul className="pricing-features">
                  <li>Unlimited Customers</li>
                  <li>Multi-Branch Support</li>
                  <li>Custom Reports</li>
                  <li>Unlimited Staff Users</li>
                  <li>API Access</li>
                  <li>Dedicated Account Manager</li>
                  <li>White-Label Option</li>
                </ul>
                <Link to="/login" className="btn-pricing btn-pricing-outline">Contact Sales</Link>
              </div>
            </IntersectFade>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ padding: "32px 0 96px" }}>
        <IntersectFade>
          <div className="cta-section">
            <div className="cta-glow-left" />
            <div className="cta-glow-right" />

            {/* Doodle arrows */}
            <svg style={{ position: "absolute", top: 24, left: 48, opacity: 0.15 }}
              width="80" height="40" viewBox="0 0 80 40">
              <path d="M4 20 Q20 4 40 20 Q60 36 76 20" stroke="#f97316" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeDasharray="500" style={{ animation: "scribble-draw 2s ease forwards" }} />
              <path d="M68 12 L76 20 L68 28" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <svg style={{ position: "absolute", bottom: 24, right: 48, opacity: 0.15, transform: "scaleX(-1)" }}
              width="80" height="40" viewBox="0 0 80 40">
              <path d="M4 20 Q20 4 40 20 Q60 36 76 20" stroke="#60a5fa" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeDasharray="500" style={{ animation: "scribble-draw 2s ease forwards" }} />
              <path d="M68 12 L76 20 L68 28" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
              <h2 className="section-title" style={{ marginBottom: 16 }}>
                Ready to Transform<br />
                <span className="saffron-text">Your Gas Agency?</span>
              </h2>
              <p style={{ color: "#64748b", marginBottom: 36, fontSize: 16, maxWidth: 480, margin: "0 auto 36px" }}>
                Join 500+ agencies across India already using BestCylinder.
                Start your free 14-day trial — no credit card required.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/login" className="btn-hero-primary">
                  🔥 Start Free Trial
                </Link>
                <a href="tel:+911800000000" className="btn-hero-secondary" style={{ textDecoration: "none" }}>
                  📞 Talk to Sales
                </a>
              </div>
            </div>
          </div>
        </IntersectFade>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#07091a" }}>
        <div className="land-footer">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div className="land-nav-logo-icon" style={{ width: 36, height: 36, fontSize: 16 }}>🔥</div>
                <div className="footer-brand-name">BestCylinder India</div>
              </div>
              <p className="footer-brand-desc">
                India's most trusted LPG Agency Management Platform. Empowering gas distributors from Kanyakumari to Kashmir.
              </p>
              <div className="footer-social">
                <a className="footer-social-btn" href="#" aria-label="Twitter">𝕏</a>
                <a className="footer-social-btn" href="#" aria-label="LinkedIn">in</a>
                <a className="footer-social-btn" href="#" aria-label="WhatsApp">📱</a>
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><Link to="/login" style={{ color: "#64748b", textDecoration: "none" }}>Agency Login</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Refund Policy</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 BestCylinder India. All rights reserved.</div>
            <div className="india-flag">
              Made with ❤️ in <span>🇮🇳</span> India
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
