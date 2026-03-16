<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SOEIT Achievement Portal — README</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --bg: #0a0c10;
    --bg2: #111318;
    --bg3: #181b22;
    --border: rgba(255,255,255,0.07);
    --border-bright: rgba(255,255,255,0.13);
    --gold: #f5c542;
    --gold2: #e8a93a;
    --teal: #38d9a9;
    --blue: #4da6ff;
    --purple: #a78bfa;
    --coral: #ff7c6e;
    --text: #e8e6e0;
    --muted: #7c7b76;
    --tag-bg: rgba(255,255,255,0.06);
    --radius: 12px;
    --radius-lg: 18px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    font-size: 15px;
    overflow-x: hidden;
  }

  /* ── ANIMATIONS ──────────────────────────────────── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%,100% { background-position: -200% center; } 50% { background-position: 200% center; } }
  @keyframes pulse    { 0%,100% { box-shadow: 0 0 0 0 rgba(245,197,66,0.35); } 50% { box-shadow: 0 0 0 10px rgba(245,197,66,0); } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(-18px); } to { opacity:1; transform:translateX(0); } }
  @keyframes rotate   { to { transform: rotate(360deg); } }
  @keyframes barGrow  { from { width:0%; } to { width: var(--w); } }
  @keyframes floatDot { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
  @keyframes borderPulse { 0%,100% { border-color: rgba(255,255,255,0.07); } 50% { border-color: rgba(245,197,66,0.25); } }

  .animate-up  { animation: fadeUp  0.6s cubic-bezier(.22,1,.36,1) both; }
  .animate-in  { animation: fadeIn  0.7s ease both; }
  .animate-slide { animation: slideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }

  /* ── LAYOUT ──────────────────────────────────────── */
  .container { max-width: 900px; margin: 0 auto; padding: 0 32px; }

  /* ── HERO ────────────────────────────────────────── */
  .hero {
    position: relative;
    padding: 80px 0 64px;
    text-align: center;
    overflow: hidden;
  }
  .hero-glow {
    position: absolute;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse at center, rgba(245,197,66,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(245,197,66,0.1);
    border: 1px solid rgba(245,197,66,0.25);
    border-radius: 999px;
    padding: 5px 16px;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: var(--gold);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 24px;
    animation: pulse 2.8s ease infinite;
  }
  .hero-badge .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: floatDot 1.8s ease-in-out infinite;
  }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 60px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.08;
    background: linear-gradient(135deg, #fff 30%, var(--gold) 70%, var(--teal) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 6s linear infinite;
    margin-bottom: 10px;
  }
  .hero-sub {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 20px;
    letter-spacing: 0.01em;
  }
  .hero-desc {
    max-width: 620px;
    margin: 0 auto 36px;
    color: #a09e98;
    font-size: 15px;
    line-height: 1.75;
  }

  /* ── BADGE STRIP ─────────────────────────────────── */
  .badge-strip {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 0;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 13px;
    border-radius: 7px;
    border: 1px solid var(--border-bright);
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    font-weight: 500;
    background: var(--bg3);
    transition: all 0.2s;
    cursor: default;
    color: var(--text);
  }
  .badge:hover { border-color: rgba(245,197,66,0.4); background: rgba(245,197,66,0.06); transform: translateY(-1px); }
  .badge .b-dot { width: 7px; height: 7px; border-radius: 50%; }

  /* ── SECTION TITLES ──────────────────────────────── */
  .section { padding: 56px 0; border-top: 1px solid var(--border); }
  .section-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 14px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .section-label .line { width: 18px; height: 1px; background: var(--gold); }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 8px;
    color: #f0ede8;
  }
  .section-desc {
    color: var(--muted);
    font-size: 14.5px;
    margin-bottom: 36px;
    max-width: 560px;
  }

  /* ── ARCHITECTURE ────────────────────────────────── */
  .arch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }
  .arch-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 20px;
    transition: all 0.25s;
    animation: borderPulse 4s ease infinite;
    position: relative;
    overflow: hidden;
  }
  .arch-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent, var(--gold));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  .arch-card:hover { border-color: var(--border-bright); transform: translateY(-3px); background: var(--bg3); }
  .arch-card:hover::before { transform: scaleX(1); }
  .arch-icon {
    font-size: 22px;
    margin-bottom: 12px;
    display: block;
  }
  .arch-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #f0ede8;
  }
  .arch-card p { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .arch-tag {
    display: inline-block;
    margin-top: 12px;
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    padding: 3px 9px;
    border-radius: 5px;
    background: var(--tag-bg);
    border: 1px solid var(--border);
    color: var(--muted);
  }

  /* ── ROLES TABLE ─────────────────────────────────── */
  .roles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
  .role-card {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 26px 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.25s;
    background: var(--bg2);
  }
  .role-card:hover { transform: translateY(-4px); }
  .role-accent {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 3px;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .role-emoji { font-size: 28px; margin-bottom: 14px; display: block; }
  .role-card h3 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 6px; }
  .role-level {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    padding: 3px 9px;
    border-radius: 5px;
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .role-card ul { list-style: none; }
  .role-card ul li {
    font-size: 13.5px;
    color: #9d9b95;
    padding: 5px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .role-card ul li:last-child { border-bottom: none; }
  .role-card ul li::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--accent, var(--gold));
    flex-shrink: 0;
  }

  /* ── FEATURES ────────────────────────────────────── */
  .feature-group { margin-bottom: 48px; }
  .feature-group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .feature-group-header .icon-wrap {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    border: 1px solid var(--border-bright);
    flex-shrink: 0;
  }
  .feature-group-header h3 {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
  }
  .feature-group-header .subtitle { font-size: 13px; color: var(--muted); }
  .features-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 12px;
  }
  .feat {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 18px;
    transition: all 0.22s;
  }
  .feat:hover { border-color: var(--border-bright); background: var(--bg3); }
  .feat .feat-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #e8e6e0;
    margin-bottom: 5px;
  }
  .feat .feat-desc { font-size: 13px; color: var(--muted); line-height: 1.55; }

  /* ── UPDATES TABLE ───────────────────────────────── */
  .updates-list { display: flex; flex-direction: column; gap: 12px; }
  .update-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.22s;
  }
  .update-item:hover { border-color: rgba(56,217,169,0.3); background: var(--bg3); }
  .update-icon {
    font-size: 20px;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--tag-bg);
    border-radius: 9px;
    border: 1px solid var(--border);
  }
  .update-title {
    font-family: 'Syne', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    color: var(--teal);
    margin-bottom: 4px;
  }
  .update-desc { font-size: 13.5px; color: #9d9b95; line-height: 1.55; }
  .update-date {
    margin-left: auto;
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--muted);
    white-space: nowrap;
    padding-top: 2px;
    flex-shrink: 0;
  }

  /* ── FILE TREE ───────────────────────────────────── */
  .file-tree {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px 28px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 2;
    overflow-x: auto;
  }
  .tree-line { display: flex; align-items: baseline; gap: 6px; white-space: nowrap; }
  .tree-folder { color: var(--gold); font-weight: 500; }
  .tree-file   { color: #9d9b95; }
  .tree-comment { color: #4d4d4d; font-size: 11.5px; }
  .tree-indent { display: inline-block; width: 20px; color: #2e2e2e; }

  /* ── ENV / CODE ──────────────────────────────────── */
  .code-block {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px;
    border-bottom: 1px solid var(--border);
    background: var(--bg3);
  }
  .code-header .file-name {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--gold);
  }
  .code-header .dots { display: flex; gap: 6px; }
  .code-header .dots span {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .code-body {
    padding: 18px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 12.5px;
    line-height: 1.85;
    overflow-x: auto;
  }
  .code-key   { color: var(--blue); }
  .code-val   { color: var(--teal); }
  .code-comment { color: #4a4a4a; }
  .code-cmd   { color: var(--gold2); }
  .code-dir   { color: var(--purple); }

  /* ── ROADMAP ─────────────────────────────────────── */
  .roadmap-list { display: flex; flex-direction: column; gap: 10px; }
  .roadmap-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.22s;
  }
  .roadmap-item:hover { border-color: rgba(167,139,250,0.3); transform: translateX(4px); }
  .roadmap-checkbox {
    width: 18px; height: 18px;
    border-radius: 5px;
    border: 1.5px solid var(--border-bright);
    flex-shrink: 0;
  }
  .roadmap-item h4 {
    font-family: 'Syne', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    color: #e8e6e0;
    margin-bottom: 2px;
  }
  .roadmap-item p { font-size: 13px; color: var(--muted); }
  .roadmap-tag {
    margin-left: auto;
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    padding: 3px 10px;
    border-radius: 5px;
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.2);
    color: var(--purple);
    white-space: nowrap;
  }

  /* ── FOOTER ──────────────────────────────────────── */
  .footer {
    padding: 48px 0;
    border-top: 1px solid var(--border);
    text-align: center;
  }
  .footer-logo {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(90deg, var(--gold), var(--teal));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  .footer p { font-size: 13.5px; color: var(--muted); }

  /* ── STACK TAG ROW ───────────────────────────────── */
  .stack-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
  .stack-tag {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid var(--border-bright);
    background: var(--bg3);
    color: var(--muted);
    transition: all 0.2s;
  }
  .stack-tag:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

  /* ── DIVIDER ─────────────────────────────────────── */
  .divider { height: 1px; background: var(--border); margin: 0; }

  /* ── RESPONSIVE ──────────────────────────────────── */
  @media (max-width: 600px) {
    .container { padding: 0 18px; }
    .hero { padding: 56px 0 44px; }
    .features-list { grid-template-columns: 1fr; }
    .arch-grid { grid-template-columns: 1fr 1fr; }
    .roles-grid { grid-template-columns: 1fr; }
    .update-date { display: none; }
  }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════ HERO -->
<div class="hero">
  <div class="hero-glow"></div>
  <div class="container">
    <div class="hero-badge animate-up">
      <span class="dot"></span>
      Arka Jain University · SOEIT
    </div>
    <h1 class="animate-up delay-1">Student Achievement<br>&amp; Management Portal</h1>
    <p class="hero-sub animate-up delay-2">Unified Digital Registry for the School of Engineering &amp; IT</p>
    <p class="hero-desc animate-up delay-3">
      A specialized academic management system that streamlines tracking of student milestones, professional achievements,
      and academic progress — with resilient media storage and role-based access for students, faculty, and administrators.
    </p>
    <div class="badge-strip animate-up delay-4">
      <span class="badge"><span class="b-dot" style="background:#68a063;"></span>Node.js v18.x</span>
      <span class="badge"><span class="b-dot" style="background:#646cff;"></span>Vite v5.0</span>
      <span class="badge"><span class="b-dot" style="background:#61dafb;"></span>React 18.2</span>
      <span class="badge"><span class="b-dot" style="background:#4da6ff;"></span>LibSQL / Turso</span>
      <span class="badge"><span class="b-dot" style="background:#f5c542;"></span>REVN Stack</span>
      <span class="badge"><span class="b-dot" style="background:#38d9a9;"></span>JWT · RBAC</span>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ ARCHITECTURE -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> Technical Architecture</div>
    <h2 class="section-title animate-up">Built on the REVN Stack</h2>
    <p class="section-desc animate-up delay-1">React · Express · Vite · Node — with LibSQL/Turso as the persistence layer for both relational metadata and binary file storage.</p>
    <div class="arch-grid">
      <div class="arch-card animate-up delay-1" style="--accent: #61dafb;">
        <span class="arch-icon">⚛</span>
        <h3>Frontend</h3>
        <p>Vite + React 18 with a custom Bespoke Academic CSS design system. Context-driven auth with RBAC routing.</p>
        <span class="arch-tag">Vite · React 18 · Vanilla CSS</span>
      </div>
      <div class="arch-card animate-up delay-2" style="--accent: #68a063;">
        <span class="arch-icon">⬡</span>
        <h3>Backend</h3>
        <p>Node.js &amp; Express with a RESTful architecture. Memory-resident file uploads via Multer middleware.</p>
        <span class="arch-tag">Node.js · Express · Multer</span>
      </div>
      <div class="arch-card animate-up delay-3" style="--accent: #4da6ff;">
        <span class="arch-icon">◈</span>
        <h3>Database</h3>
        <p>Turso (LibSQL) handles relational metadata and BLOB binary storage, ensuring zero data loss on server restarts.</p>
        <span class="arch-tag">Turso · LibSQL · BLOB Storage</span>
      </div>
      <div class="arch-card animate-up delay-4" style="--accent: #f5c542;">
        <span class="arch-icon">⚿</span>
        <h3>Security</h3>
        <p>JWT-based authentication with Role-Based Access Control. 30-day token expiry with protected REST endpoints.</p>
        <span class="arch-tag">JWT · RBAC · Auth Guards</span>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ ROLES -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> Access Control</div>
    <h2 class="section-title animate-up">Roles &amp; Permissions</h2>
    <p class="section-desc animate-up delay-1">Three distinct roles with graduated access levels — each scoped to their institutional responsibilities.</p>
    <div class="roles-grid">
      <!-- Student -->
      <div class="role-card animate-up delay-1" style="--accent: #38d9a9;">
        <div class="role-accent" style="background: linear-gradient(90deg, #38d9a9, #1fa882);"></div>
        <span class="role-emoji">🎓</span>
        <h3>Student</h3>
        <div class="role-level" style="background:rgba(56,217,169,0.1); border:1px solid rgba(56,217,169,0.25); color:#38d9a9;">Learner Access</div>
        <ul>
          <li>Submit achievements &amp; certificates</li>
          <li>Manage internships &amp; projects</li>
          <li>Track courses &amp; learning activities</li>
          <li>Public portfolio shareable link</li>
          <li>Hackathon Hub (90+ listings)</li>
        </ul>
      </div>
      <!-- Faculty -->
      <div class="role-card animate-up delay-2" style="--accent: #4da6ff;">
        <div class="role-accent" style="background: linear-gradient(90deg, #4da6ff, #1e7bd4);"></div>
        <span class="role-emoji">🏫</span>
        <h3>Faculty</h3>
        <div class="role-level" style="background:rgba(77,166,255,0.1); border:1px solid rgba(77,166,255,0.25); color:#4da6ff;">Overseer Access</div>
        <ul>
          <li>Verify department achievements</li>
          <li>Browse scholar directory (1–8 semesters)</li>
          <li>Broadcast institutional notices</li>
          <li>Download evidence ledgers as ZIP</li>
          <li>High-res document preview from DB</li>
        </ul>
      </div>
      <!-- Admin -->
      <div class="role-card animate-up delay-3" style="--accent: #f5c542;">
        <div class="role-accent" style="background: linear-gradient(90deg, #f5c542, #c49818);"></div>
        <span class="role-emoji">🔐</span>
        <h3>Administrator</h3>
        <div class="role-level" style="background:rgba(245,197,66,0.1); border:1px solid rgba(245,197,66,0.25); color:#f5c542;">Manager Access</div>
        <ul>
          <li>Bulk user lifecycle management</li>
          <li>Platform-wide institutional analytics</li>
          <li>Audit trail ZIP exports by enrollment no.</li>
          <li>Department-wide achievement reports</li>
          <li>Automated cascade deletion (FK safe)</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ FEATURES -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> System Features</div>
    <h2 class="section-title animate-up">Everything Built In</h2>
    <p class="section-desc animate-up delay-1">Feature-complete across all three roles — from BLOB-resilient certificate storage to live hackathon feeds.</p>

    <!-- Student -->
    <div class="feature-group animate-up delay-1">
      <div class="feature-group-header">
        <div class="icon-wrap" style="background:rgba(56,217,169,0.08); border-color:rgba(56,217,169,0.2);">🎓</div>
        <div>
          <h3 style="color:#38d9a9;">For Students</h3>
          <div class="subtitle">Submission · Tracking · Portfolio</div>
        </div>
      </div>
      <div class="features-list">
        <div class="feat"><div class="feat-title">Milestone Registry</div><div class="feat-desc">Submit achievements with Certificate, Title, Level, and Category metadata.</div></div>
        <div class="feat"><div class="feat-title">Persistent BLOB Storage</div><div class="feat-desc">All certificates stored directly in the database — zero 404s on server restarts.</div></div>
        <div class="feat"><div class="feat-title">Public Portfolio</div><div class="feat-desc">Professional shareable link with stats, verified achievements, and project showcases.</div></div>
        <div class="feat"><div class="feat-title">Course &amp; Internship Tracker</div><div class="feat-desc">Log ongoing learning activities, internship details, and progress milestones.</div></div>
        <div class="feat"><div class="feat-title">Hackathon Hub</div><div class="feat-desc">Live listing of 90+ real upcoming hackathons with integrated activity logging.</div></div>
      </div>
    </div>

    <!-- Faculty -->
    <div class="feature-group animate-up delay-2">
      <div class="feature-group-header">
        <div class="icon-wrap" style="background:rgba(77,166,255,0.08); border-color:rgba(77,166,255,0.2);">🏫</div>
        <div>
          <h3 style="color:#4da6ff;">For Faculty</h3>
          <div class="subtitle">Verification · Directory · Exports</div>
        </div>
      </div>
      <div class="features-list">
        <div class="feat"><div class="feat-title">Verification Engine</div><div class="feat-desc">Review submissions with high-res document previews served directly from the database.</div></div>
        <div class="feat"><div class="feat-title">Scholar Directory</div><div class="feat-desc">Filter students by Department, Semester (1–8), and Section (A–G).</div></div>
        <div class="feat"><div class="feat-title">Notification Center</div><div class="feat-desc">Broadcast official institutional notices to student dashboards system-wide.</div></div>
        <div class="feat"><div class="feat-title">Ledger Export</div><div class="feat-desc">Download any student's verified achievement evidence as a synchronized ZIP bundle.</div></div>
      </div>
    </div>

    <!-- Admin -->
    <div class="feature-group animate-up delay-3">
      <div class="feature-group-header">
        <div class="icon-wrap" style="background:rgba(245,197,66,0.08); border-color:rgba(245,197,66,0.2);">🔐</div>
        <div>
          <h3 style="color:#f5c542;">For Administrators</h3>
          <div class="subtitle">Management · Analytics · Audit</div>
        </div>
      </div>
      <div class="features-list">
        <div class="feat"><div class="feat-title">User Lifecycle Management</div><div class="feat-desc">Bulk account management with automated cascade cleanup of all related records.</div></div>
        <div class="feat"><div class="feat-title">Institutional Analytics</div><div class="feat-desc">Statistical reports on department-wide performance and achievement trends.</div></div>
        <div class="feat"><div class="feat-title">Audit Trails</div><div class="feat-desc">Automated ZIP exports named by Student Enrollment Number for university audits.</div></div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ UPDATES -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> Changelog</div>
    <h2 class="section-title animate-up">Recent Updates</h2>
    <p class="section-desc animate-up delay-1">Deployed March 16, 2026 — production-hardened fixes and new unified flows.</p>
    <div class="updates-list">
      <div class="update-item animate-up delay-1">
        <div class="update-icon">🛡️</div>
        <div>
          <div class="update-title">Robust User Deletion</div>
          <div class="update-desc">Fixed critical 500 errors by implementing exhaustive batch deletion for all related user data respecting FK constraints.</div>
        </div>
        <div class="update-date">Mar 16 · 2026</div>
      </div>
      <div class="update-item animate-up delay-2">
        <div class="update-icon">🔄</div>
        <div>
          <div class="update-title">Unified Registration Portal</div>
          <div class="update-desc">Single registration flow with a role-switcher covering both Student and Faculty onboarding paths.</div>
        </div>
        <div class="update-date">Mar 16 · 2026</div>
      </div>
      <div class="update-item animate-up delay-3">
        <div class="update-icon">🏷️</div>
        <div>
          <div class="update-title">Strict Prefix Validation</div>
          <div class="update-desc">Enforced enrollment number formats: <code style="background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;">AJU/</code> for students, <code style="background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;">ARKA/AJU/</code> for faculty.</div>
        </div>
        <div class="update-date">Mar 16 · 2026</div>
      </div>
      <div class="update-item animate-up delay-4">
        <div class="update-icon">🏥</div>
        <div>
          <div class="update-title">DB Reliability Optimizations</div>
          <div class="update-desc">Turso schema optimized with targeted indexes for high-speed lookups across all management modules.</div>
        </div>
        <div class="update-date">Mar 16 · 2026</div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ PROJECT STRUCTURE -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> Project Structure</div>
    <h2 class="section-title animate-up">Repository Layout</h2>
    <p class="section-desc animate-up delay-1">Monorepo with decoupled frontend and backend directories.</p>
    <div class="file-tree animate-up delay-2">
      <div class="tree-line"><span class="tree-folder">SOEIT-Portal/</span></div>
      <div class="tree-line"><span class="tree-indent">├─</span><span class="tree-folder">frontend/</span><span class="tree-comment"> # React 18 + Vite client</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">└─</span><span class="tree-folder">src/</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">  </span><span class="tree-indent">├─</span><span class="tree-folder">components/</span><span class="tree-comment"> # Sidebar, Navbar, Layouts</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">  </span><span class="tree-indent">├─</span><span class="tree-folder">context/</span><span class="tree-comment"> # AuthContext (JWT, RBAC)</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">  </span><span class="tree-indent">├─</span><span class="tree-folder">pages/</span><span class="tree-comment"> # auth / student / admin / faculty / public</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">  </span><span class="tree-indent">├─</span><span class="tree-folder">services/</span><span class="tree-comment"> # api.js — centralized API config</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">  </span><span class="tree-indent">└─</span><span class="tree-folder">styles/</span><span class="tree-comment"> # Vanilla CSS design system</span></div>
      <div class="tree-line"><span class="tree-indent">├─</span><span class="tree-folder">backend/</span><span class="tree-comment"> # Express + Turso/LibSQL API</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">├─</span><span class="tree-folder">controllers/</span><span class="tree-comment"> # Binary upload / serve logic</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">├─</span><span class="tree-folder">models/</span><span class="tree-comment"> # User, Achievement, File (BLOB), Course…</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">├─</span><span class="tree-folder">routes/</span><span class="tree-comment"> # Protected REST endpoints</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">├─</span><span class="tree-folder">middleware/</span><span class="tree-comment"> # Auth guards + Multer upload</span></div>
      <div class="tree-line"><span class="tree-indent">│ </span><span class="tree-indent">└─</span><span class="tree-folder">config/</span><span class="tree-comment"> # db.js — Turso connection &amp; schema init</span></div>
      <div class="tree-line"><span class="tree-indent">└─</span><span class="tree-file">demo_credentials.txt</span><span class="tree-comment"> # Dev-only credentials (not in UI)</span></div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ SETUP -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> Setup</div>
    <h2 class="section-title animate-up">Running Locally</h2>
    <p class="section-desc animate-up delay-1">Two environment files + two installs. Done.</p>

    <div class="code-block animate-up delay-1">
      <div class="code-header">
        <div class="dots"><span style="background:#ff5f57;"></span><span style="background:#febc2e;"></span><span style="background:#28c840;"></span></div>
        <span class="file-name">backend/.env</span>
      </div>
      <div class="code-body">
        <div><span class="code-key">PORT</span>=<span class="code-val">5000</span></div>
        <div><span class="code-key">TURSO_URL</span>=<span class="code-val">your_turso_db_url</span></div>
        <div><span class="code-key">JWT_SECRET</span>=<span class="code-val">your_high_entropy_secret</span></div>
        <div><span class="code-key">JWT_EXPIRE</span>=<span class="code-val">30d</span></div>
        <div><span class="code-key">SMTP_USER</span>=<span class="code-val">your_email@domain.com</span></div>
        <div><span class="code-key">SMTP_PASS</span>=<span class="code-val">your_app_password</span></div>
        <div><span class="code-key">CLIENT_URL</span>=<span class="code-val">https://your-vercel-frontend.vercel.app</span></div>
      </div>
    </div>

    <div class="code-block animate-up delay-2">
      <div class="code-header">
        <div class="dots"><span style="background:#ff5f57;"></span><span style="background:#febc2e;"></span><span style="background:#28c840;"></span></div>
        <span class="file-name">frontend/.env</span>
      </div>
      <div class="code-body">
        <div><span class="code-key">VITE_API_URL</span>=<span class="code-val">http://localhost:5000/api</span></div>
      </div>
    </div>

    <div class="code-block animate-up delay-3">
      <div class="code-header">
        <div class="dots"><span style="background:#ff5f57;"></span><span style="background:#febc2e;"></span><span style="background:#28c840;"></span></div>
        <span class="file-name">Terminal</span>
      </div>
      <div class="code-body">
        <div><span class="code-comment"># Install &amp; start backend (port 5000)</span></div>
        <div><span class="code-dir">cd backend</span> &amp;&amp; <span class="code-cmd">npm install</span></div>
        <div><span class="code-cmd">npm run dev</span></div>
        <div style="margin-top:10px;"><span class="code-comment"># Install &amp; start frontend (port 5173)</span></div>
        <div><span class="code-dir">cd ../frontend</span> &amp;&amp; <span class="code-cmd">npm install</span></div>
        <div><span class="code-cmd">npm run dev</span></div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ ROADMAP -->
<div class="section">
  <div class="container">
    <div class="section-label animate-slide"><span class="line"></span> Roadmap</div>
    <h2 class="section-title animate-up">Strategic Roadmap</h2>
    <p class="section-desc animate-up delay-1">Planned milestones for extending the portal's capabilities.</p>
    <div class="roadmap-list">
      <div class="roadmap-item animate-up delay-1">
        <div class="roadmap-checkbox"></div>
        <div>
          <h4>AI-driven Validation</h4>
          <p>Automated certificate parsing and fraud detection via OCR.</p>
        </div>
        <span class="roadmap-tag">Planned</span>
      </div>
      <div class="roadmap-item animate-up delay-2">
        <div class="roadmap-checkbox"></div>
        <div>
          <h4>Alumni Integration</h4>
          <p>Extending achievement lifecycles to SOEIT post-graduates.</p>
        </div>
        <span class="roadmap-tag">Planned</span>
      </div>
      <div class="roadmap-item animate-up delay-3">
        <div class="roadmap-checkbox"></div>
        <div>
          <h4>Institutional Dashboard</h4>
          <p>High-level dean's view for department-wide performance comparisons.</p>
        </div>
        <span class="roadmap-tag">Planned</span>
      </div>
      <div class="roadmap-item animate-up delay-4">
        <div class="roadmap-checkbox"></div>
        <div>
          <h4>Mobile App</h4>
          <p>React Native companion for on-the-go achievement submission.</p>
        </div>
        <span class="roadmap-tag">Planned</span>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════ FOOTER -->
<div class="footer">
  <div class="container">
    <div class="footer-logo animate-up">SOEIT Portal</div>
    <p class="animate-up delay-1">Designed &amp; Engineered for the School of Engineering &amp; IT</p>
    <p class="animate-up delay-2" style="margin-top:6px;">Arka Jain University — Pioneering Technical Education &amp; Student Success</p>
    <div class="stack-row animate-up delay-3" style="justify-content:center; margin-top:24px;">
      <span class="stack-tag">React 18</span>
      <span class="stack-tag">Vite 5</span>
      <span class="stack-tag">Node.js</span>
      <span class="stack-tag">Express</span>
      <span class="stack-tag">Turso / LibSQL</span>
      <span class="stack-tag">JWT</span>
      <span class="stack-tag">Multer</span>
      <span class="stack-tag">RBAC</span>
    </div>
  </div>
</div>

</body>
</html>