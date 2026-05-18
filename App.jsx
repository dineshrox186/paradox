import { useState, useEffect, useRef, useCallback } from "react";

// ─── EDIT THESE ───────────────────────────────────────────────────────────────
const DISCORD_INVITE = "https://discord.gg/YOUR_INVITE_CODE";
const STORE_URL      = "https://store.paradoxsmp.net";
const SERVER_IP      = "play.paradoxsmp.net";
// ─────────────────────────────────────────────────────────────────────────────

const cn = (...cls) => cls.filter(Boolean).join(" ");

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Particles({ count = 55 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      o: Math.random() * 0.5 + 0.15,
      color: ["#38bdf8","#7dd3fc","#0ea5e9","#bae6fd","#e0f2fe"][Math.floor(Math.random() * 5)],
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.o;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("faq-item", open && "faq-open")} onClick={() => setOpen(!open)}>
      <div className="faq-q">
        <span>{q}</span>
        <span className="faq-arrow">{open ? "−" : "+"}</span>
      </div>
      <div className="faq-body" style={{ maxHeight: open ? "300px" : "0" }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display:"inline", marginRight:6, verticalAlign:"middle", flexShrink:0 }}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
);

function Navbar({ page, setPage, mobileOpen, setMobileOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const navLinks = ["Home", "Store", "Support"];
  return (
    <nav className={cn("navbar", scrolled && "navbar-scrolled")}>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => setPage("Home")}>
          <span className="logo-lt">⬡</span> Paradox <span className="logo-sky">SMP</span>
        </div>
        <div className="nav-links">
          {navLinks.map((l) => (
            <button key={l} className={cn("nav-link", page === l && "nav-active")} onClick={() => setPage(l)}>{l}</button>
          ))}
        </div>
        <div className="nav-cta">
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="btn-discord-nav">
            <DiscordIcon /> Discord
          </a>
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className={cn("ham-line", mobileOpen && "ham-open-1")} />
          <span className={cn("ham-line", mobileOpen && "ham-open-2")} />
          <span className={cn("ham-line", mobileOpen && "ham-open-3")} />
        </button>
      </div>
      <div className={cn("mobile-menu", mobileOpen && "mobile-open")}>
        {navLinks.map((l) => (
          <button key={l} className="mobile-link" onClick={() => { setPage(l); setMobileOpen(false); }}>{l}</button>
        ))}
        <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="mobile-link discord-mobile">
          <DiscordIcon /> Join Discord
        </a>
      </div>
    </nav>
  );
}

function HomePage() {
  useScrollReveal();
  const features = [
    { icon: "💰", title: "Player Economy", desc: "Trade, sell, and build your wealth with a dynamic player-driven market." },
    { icon: "📜", title: "Epic Quests", desc: "Embark on story-driven quests with unique rewards and lore." },
    { icon: "⚔️", title: "PvP Arenas", desc: "Test your skills in ranked PvP arenas with seasonal leaderboards." },
    { icon: "🌍", title: "Custom World", desc: "Explore a hand-crafted, 30,000 block world rich with secrets." },
    { icon: "🎉", title: "Server Events", desc: "Weekly community events, build battles, and holiday specials." },
    { icon: "🏰", title: "Clans", desc: "Form or join clans, claim territory, and dominate the leaderboard." },
  ];
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <Particles count={65} />
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
          <div className="fog" />
        </div>
        <div className="hero-content">
          <div className="hero-badge reveal">⚡ Season 3 is Live</div>
          <h1 className="hero-title reveal">
            A World Beyond<br /><span className="gradient-text">Survival.</span>
          </h1>
          <p className="hero-sub reveal">
            Paradox SMP is an immersive survival multiplayer experience — featuring custom economies, epic quests, clan warfare, and a thriving community of adventurers.
          </p>
          <div className="hero-btns reveal">
            <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="btn-primary">
              <DiscordIcon /> Join Discord
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint">scroll to explore ↓</div>
      </section>

      <section className="section features-section">
        <div className="section-label reveal">What We Offer</div>
        <h2 className="section-title reveal">Everything You Need to <span className="gradient-text">Thrive</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-glow" />
            </div>
          ))}
        </div>
      </section>

      <section className="section stats-section">
        <div className="stats-inner reveal">
          {[
            { val: "12,400+", label: "Registered Players" },
            { val: "3 Years", label: "Running Strong" },
            { val: "99%",     label: "Uptime" },
            { val: "850+",    label: "Active Daily" },
          ].map((s, i) => (
            <div key={i} className="stat-block">
              <div className="stat-num">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StorePage() {
  useScrollReveal();
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Ranks", "Crates", "Cosmetics", "Keys"];
  const products = [
    { cat:"Ranks",     name:"Wanderer",    price:"$4.99",  color:"#7dd3fc", badge:"",           desc:"Basic perks: /fly in claimed land, colored chat, 2 homes." },
    { cat:"Ranks",     name:"Explorer",    price:"$9.99",  color:"#38bdf8", badge:"Popular",    desc:"5 homes, /nick, particle trails, exclusive Explorer kit." },
    { cat:"Ranks",     name:"Pathfinder",  price:"$19.99", color:"#818cf8", badge:"",           desc:"10 homes, custom join messages, 3 plot claims, monthly crate key." },
    { cat:"Ranks",     name:"Sovereign",   price:"$39.99", color:"#f59e0b", badge:"Best Value", desc:"Unlimited homes, all cosmetics, priority queue, VIP Discord role." },
    { cat:"Crates",    name:"Sky Crate",   price:"$2.99",  color:"#bae6fd", badge:"",           desc:"50+ rewards including rare items, XP bottles, and custom tools." },
    { cat:"Crates",    name:"Storm Crate", price:"$4.99",  color:"#67e8f9", badge:"New",        desc:"Lightning-themed rewards, exclusive storm particle, rare enchants." },
    { cat:"Cosmetics", name:"Wing Bundle", price:"$7.99",  color:"#c4b5fd", badge:"",           desc:"5 unique wing cosmetics that display on your back in-game." },
    { cat:"Cosmetics", name:"Aura Pack",   price:"$5.99",  color:"#a5f3fc", badge:"",           desc:"Choose from 12 ambient particle auras to surround your character." },
    { cat:"Keys",      name:"Vote Key x10",price:"$1.99",  color:"#fbbf24", badge:"",           desc:"10 Vote Crate keys — great rewards for new players." },
    { cat:"Keys",      name:"Myth Key x5", price:"$8.99",  color:"#f87171", badge:"Rare",       desc:"5 Mythic keys with chances at exclusive gear and rank upgrades." },
  ];
  const filtered = activeTab === "All" ? products : products.filter(p => p.cat === activeTab);
  return (
    <div className="page store-page">
      <div className="store-hero">
        <Particles count={30} />
        <h1 className="store-title reveal">Paradox <span className="gradient-text">Store</span></h1>
        <p className="store-sub reveal">Support the server and unlock exclusive perks. All purchases are permanent.</p>
        <div className="store-notice reveal">🔒 Powered by Tebex — Secure Checkout</div>
      </div>
      <section className="section">
        <div className="featured-banner reveal">
          <div className="featured-badge">⭐ Featured Package</div>
          <h3 className="featured-name">Sovereign Rank</h3>
          <p className="featured-desc">The ultimate Paradox experience — every perk, every feature, forever.</p>
          <div className="featured-price">$39.99</div>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-primary">Buy Now →</a>
        </div>
      </section>
      <section className="section">
        <div className="store-tabs reveal">
          {tabs.map(t => (
            <button key={t} className={cn("store-tab", activeTab === t && "tab-active")} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
        <div className="products-grid">
          {filtered.map((p, i) => (
            <div key={i} className="product-card reveal" style={{ "--accent": p.color }}>
              {p.badge && <div className="product-badge">{p.badge}</div>}
              <div className="product-icon" style={{ color: p.color }}>
                {p.cat === "Ranks" ? "👑" : p.cat === "Crates" ? "📦" : p.cat === "Cosmetics" ? "✨" : "🗝️"}
              </div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-desc">{p.desc}</p>
              <div className="product-footer">
                <span className="product-price">{p.price}</span>
                <a href={STORE_URL} target="_blank" rel="noreferrer" className="btn-buy">Buy</a>
              </div>
              <div className="product-glow" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SupportPage() {
  useScrollReveal();
  const faqs = [
    { q:"How do I connect to the server?",        a:`Open Minecraft Java Edition, go to Multiplayer > Add Server, and enter: ${SERVER_IP}. We support 1.20+.` },
    { q:"What version does the server run?",       a:"Paradox SMP runs on the latest stable version of Minecraft Java Edition (1.21). Bedrock Edition is not supported at this time." },
    { q:"I was unfairly banned. What do I do?",    a:"Submit a ban appeal through our Discord server in the #ban-appeals channel. Include your username and the reason you believe the ban was incorrect." },
    { q:"How do I report a cheater or griefer?",   a:"Use /report <username> in-game or post in the #player-reports channel on Discord. Attach screenshots or video evidence if possible." },
    { q:"Do purchased ranks transfer across seasons?", a:"Yes! All ranks are permanent and carry over between seasons. Cosmetics and crate contents do not carry over." },
    { q:"Can I get a refund on a purchase?",       a:"Due to the digital nature of our products, all sales are final. If you experience a technical issue with your purchase, contact us and we will resolve it." },
    { q:"How do I create a clan?",                 a:"Use /clan create <name> in-game. Creating a clan costs $5,000 in-game currency. You can then invite players with /clan invite <player>." },
  ];
  return (
    <div className="page support-page">
      <div className="support-hero">
        <Particles count={25} />
        <h1 className="support-title reveal">Support <span className="gradient-text">Hub</span></h1>
        <p className="support-sub reveal">Our staff team is here to help. Find answers or reach us directly on Discord.</p>
      </div>
      <section className="section">
        <div className="section-label reveal">Get Help</div>
        <div className="discord-contact-card reveal">
          <div style={{ fontSize:"2.8rem", flexShrink:0 }}>💬</div>
          <div style={{ flex:1, minWidth:200 }}>
            <h3 className="contact-title">Discord Support</h3>
            <p className="contact-desc">Get help from staff and the community in our Discord server. Our team is active 7 days a week.</p>
          </div>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="btn-primary" style={{ flexShrink:0, whiteSpace:"nowrap" }}>
            <DiscordIcon /> Join Discord
          </a>
        </div>
      </section>
      <section className="section">
        <div className="section-label reveal">Knowledge Base</div>
        <h2 className="section-title reveal">Frequently Asked <span className="gradient-text">Questions</span></h2>
        <div className="faq-list">
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <span>© 2026 Paradox SMP. Not affiliated with Mojang or Microsoft.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const changePage = useCallback((p) => {
    setPage(p); setMobileOpen(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:     #060d14;
          --bg2:    #080f18;
          --card:   #0c1822;
          --border: rgba(56,189,248,0.13);
          --bord2:  rgba(56,189,248,0.28);
          --sky:    #38bdf8;
          --skylt:  #7dd3fc;
          --text:   #e0f2fe;
          --muted:  #5c7f96;
          --nav-h:  72px;
          --r:      14px;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--sky); border-radius: 3px; }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .revealed { opacity: 1; transform: none; }

        .gradient-text { background: linear-gradient(135deg, var(--sky) 0%, var(--skylt) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* NAV */
        .navbar { position: fixed; top:0; left:0; right:0; z-index:100; height: var(--nav-h); background: transparent; border-bottom: 1px solid transparent; transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s; }
        .navbar-scrolled { background: rgba(6,13,20,0.88); backdrop-filter: blur(18px); border-bottom-color: var(--border); }
        .nav-inner { max-width:1280px; margin:0 auto; height:100%; display:flex; align-items:center; padding:0 28px; gap:32px; }
        .nav-logo { font-family:'Cinzel',serif; font-size:1.25rem; font-weight:700; color:var(--text); cursor:pointer; white-space:nowrap; flex-shrink:0; letter-spacing:0.04em; }
        .logo-lt  { color: var(--skylt); }
        .logo-sky { color: var(--sky); }
        .nav-links { display:flex; gap:6px; margin:0 auto; }
        .nav-link { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.92rem; font-weight:500; color:var(--muted); padding:8px 16px; border-radius:8px; transition:color 0.2s, background 0.2s; }
        .nav-link:hover { color:var(--text); background:rgba(56,189,248,0.08); }
        .nav-active { color:var(--sky) !important; }
        .nav-cta { display:flex; gap:10px; align-items:center; flex-shrink:0; }
        .btn-discord-nav { display:flex; align-items:center; gap:6px; background:rgba(88,101,242,0.18); color:#a5b4fc; border:1px solid rgba(88,101,242,0.35); padding:8px 16px; border-radius:9px; font-size:0.88rem; font-weight:500; text-decoration:none; transition:background 0.2s, border-color 0.2s; }
        .btn-discord-nav:hover { background:rgba(88,101,242,0.32); border-color:rgba(88,101,242,0.6); }
        .hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; margin-left:auto; }
        .ham-line { display:block; width:24px; height:2px; background:var(--text); border-radius:2px; transition:transform 0.3s, opacity 0.3s; }
        .ham-open-1 { transform:translateY(7px) rotate(45deg); }
        .ham-open-2 { opacity:0; }
        .ham-open-3 { transform:translateY(-7px) rotate(-45deg); }
        .mobile-menu { display:flex; flex-direction:column; gap:4px; background:rgba(6,13,20,0.97); backdrop-filter:blur(20px); padding:0 20px; max-height:0; overflow:hidden; transition:max-height 0.4s ease, padding 0.3s; border-bottom:1px solid transparent; }
        .mobile-open { max-height:360px; padding:16px 20px; border-bottom-color:var(--border); }
        .mobile-link { display:flex; align-items:center; gap:8px; background:none; border:none; cursor:pointer; text-align:left; font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:500; color:var(--muted); padding:12px 8px; border-radius:8px; text-decoration:none; transition:color 0.2s, background 0.2s; }
        .mobile-link:hover { color:var(--text); background:rgba(56,189,248,0.07); }
        .discord-mobile { color:#a5b4fc; }

        .page { padding-top: var(--nav-h); min-height:100vh; }

        /* HERO */
        .hero { position:relative; min-height:calc(100vh - var(--nav-h)); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:80px 24px 60px; overflow:hidden; }
        .hero-bg { position:absolute; inset:0; z-index:0; }
        .hero-gradient { position:absolute; inset:0; background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(56,189,248,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(14,165,233,0.07) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(125,211,252,0.05) 0%, transparent 50%), linear-gradient(180deg, #060d14 0%, #091520 50%, #060d14 100%); }
        .cloud { position:absolute; border-radius:50%; background:rgba(56,189,248,0.025); filter:blur(60px); animation:drift 18s ease-in-out infinite; }
        .cloud-1 { width:500px; height:200px; top:15%; left:-10%; }
        .cloud-2 { width:350px; height:150px; top:40%; right:-5%; animation-delay:6s; animation-duration:22s; }
        .cloud-3 { width:280px; height:120px; bottom:20%; left:30%; animation-delay:12s; animation-duration:15s; }
        @keyframes drift { 0%,100% { transform:translateX(0) translateY(0); } 50% { transform:translateX(30px) translateY(-20px); } }
        .fog { position:absolute; bottom:0; left:0; right:0; height:200px; background:linear-gradient(to top, rgba(6,13,20,0.9), transparent); pointer-events:none; }
        .hero-content { position:relative; z-index:1; max-width:780px; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.25); color:var(--sky); padding:6px 16px; border-radius:99px; font-size:0.84rem; font-weight:600; letter-spacing:0.05em; margin-bottom:24px; animation:pulse-badge 3s ease-in-out infinite; }
        @keyframes pulse-badge { 0%,100% { box-shadow:0 0 0 0 rgba(56,189,248,0.2); } 50% { box-shadow:0 0 0 8px rgba(56,189,248,0); } }
        .hero-title { font-family:'Cinzel',serif; font-size:clamp(2.8rem,7vw,5.5rem); font-weight:900; line-height:1.05; margin-bottom:22px; }
        .hero-sub { font-size:clamp(1rem,2vw,1.18rem); color:var(--muted); max-width:580px; margin:0 auto 36px; line-height:1.7; }
        .hero-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-bottom:36px; }
        .hero-scroll-hint { position:absolute; bottom:24px; left:50%; transform:translateX(-50%); font-size:0.78rem; color:var(--muted); letter-spacing:0.1em; opacity:0.5; animation:bob 2.5s ease-in-out infinite; }
        @keyframes bob { 0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(6px); } }

        /* BTN */
        .btn-primary { background:linear-gradient(135deg, var(--sky), var(--skylt)); color:#060d14; border:none; cursor:pointer; padding:14px 32px; border-radius:var(--r); font-size:1rem; font-weight:700; font-family:'DM Sans',sans-serif; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow:0 4px 28px rgba(56,189,248,0.35); }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(56,189,248,0.5); opacity:0.92; }

        /* SECTIONS */
        .section { max-width:1200px; margin:0 auto; padding:80px 24px; }
        .section-label { font-size:0.78rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--sky); margin-bottom:12px; }
        .section-title { font-family:'Cinzel',serif; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; margin-bottom:48px; line-height:1.2; }

        /* FEATURES */
        .features-section { text-align:center; }
        .features-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:20px; }
        .feature-card { position:relative; overflow:hidden; background:var(--card); border:1px solid var(--border); border-radius:18px; padding:32px 28px; text-align:left; transition:border-color 0.3s, transform 0.3s, box-shadow 0.3s; cursor:default; }
        .feature-card:hover { border-color:var(--bord2); transform:translateY(-4px); box-shadow:0 16px 48px rgba(56,189,248,0.1); }
        .feature-card:hover .feature-glow { opacity:1; }
        .feature-glow { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity 0.4s; background:radial-gradient(ellipse 60% 50% at 50% 0%, rgba(56,189,248,0.07), transparent); }
        .feature-icon { font-size:2rem; margin-bottom:16px; }
        .feature-title { font-family:'Cinzel',serif; font-size:1.05rem; font-weight:600; margin-bottom:10px; color:var(--text); }
        .feature-desc { font-size:0.92rem; color:var(--muted); line-height:1.65; }

        /* STATS */
        .stats-section { padding:0 24px 80px; }
        .stats-inner { background:linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(14,165,233,0.03) 100%); border:1px solid var(--border); border-radius:22px; padding:48px 40px; display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:32px; text-align:center; }
        .stat-num { font-family:'Cinzel',serif; font-size:2.4rem; font-weight:900; background:linear-gradient(135deg, var(--sky), var(--skylt)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .stat-label { font-size:0.88rem; color:var(--muted); margin-top:6px; }

        /* STORE */
        .store-page { background:var(--bg); }
        .store-hero { position:relative; padding:80px 24px 60px; text-align:center; overflow:hidden; background:radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56,189,248,0.06), transparent); }
        .store-title { font-family:'Cinzel',serif; font-size:clamp(2.5rem,6vw,4rem); font-weight:900; margin-bottom:16px; }
        .store-sub { color:var(--muted); font-size:1.05rem; max-width:500px; margin:0 auto 20px; }
        .store-notice { display:inline-flex; align-items:center; gap:8px; background:rgba(56,189,248,0.07); border:1px solid var(--border); padding:8px 20px; border-radius:99px; font-size:0.84rem; color:var(--muted); }
        .featured-banner { background:linear-gradient(135deg, rgba(245,158,11,0.1), rgba(56,189,248,0.06)); border:1px solid rgba(245,158,11,0.3); border-radius:20px; padding:40px; text-align:center; }
        .featured-badge { display:inline-block; background:rgba(245,158,11,0.15); color:#fbbf24; padding:5px 14px; border-radius:99px; font-size:0.8rem; font-weight:700; letter-spacing:0.06em; margin-bottom:14px; }
        .featured-name { font-family:'Cinzel',serif; font-size:2rem; font-weight:700; margin-bottom:10px; color:#fbbf24; }
        .featured-desc { color:var(--muted); margin-bottom:18px; }
        .featured-price { font-size:2.5rem; font-weight:900; font-family:'Cinzel',serif; background:linear-gradient(135deg,#fbbf24,#f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; }
        .store-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:36px; }
        .store-tab { background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--muted); padding:9px 20px; border-radius:10px; cursor:pointer; font-size:0.9rem; font-weight:500; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
        .store-tab:hover { color:var(--text); background:rgba(56,189,248,0.08); }
        .tab-active { background:rgba(56,189,248,0.12) !important; border-color:var(--bord2) !important; color:var(--sky) !important; }
        .products-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(270px,1fr)); gap:18px; margin-bottom:32px; }
        .product-card { position:relative; overflow:hidden; background:var(--card); border:1px solid var(--border); border-radius:18px; padding:28px; cursor:default; transition:border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
        .product-card:hover { border-color:var(--accent, var(--sky)); transform:translateY(-3px); box-shadow:0 12px 36px rgba(56,189,248,0.08); }
        .product-card:hover .product-glow { opacity:1; }
        .product-glow { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity 0.4s; background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.05), transparent); }
        .product-badge { position:absolute; top:16px; right:16px; background:linear-gradient(135deg, var(--sky), var(--skylt)); color:#060d14; padding:3px 10px; border-radius:99px; font-size:0.72rem; font-weight:800; letter-spacing:0.05em; }
        .product-icon { font-size:2rem; margin-bottom:14px; }
        .product-name { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:600; margin-bottom:10px; }
        .product-desc { font-size:0.87rem; color:var(--muted); line-height:1.6; margin-bottom:20px; }
        .product-footer { display:flex; justify-content:space-between; align-items:center; }
        .product-price { font-size:1.3rem; font-weight:800; font-family:'Cinzel',serif; color:var(--accent, var(--sky)); }
        .btn-buy { background:linear-gradient(135deg, var(--sky), var(--skylt)); color:#060d14; border:none; cursor:pointer; padding:8px 20px; border-radius:9px; font-size:0.88rem; font-weight:700; font-family:'DM Sans',sans-serif; text-decoration:none; display:inline-block; transition:opacity 0.2s, transform 0.15s; }
        .btn-buy:hover { opacity:0.85; transform:scale(1.04); }

        /* SUPPORT */
        .support-page { background:var(--bg); }
        .support-hero { position:relative; padding:80px 24px 60px; text-align:center; overflow:hidden; background:radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56,189,248,0.05), transparent); }
        .support-title { font-family:'Cinzel',serif; font-size:clamp(2.5rem,6vw,4rem); font-weight:900; margin-bottom:16px; }
        .support-sub { color:var(--muted); font-size:1.05rem; max-width:520px; margin:0 auto; }
        .discord-contact-card { background:var(--card); border:1px solid var(--border); border-radius:18px; padding:32px 36px; display:flex; align-items:center; gap:28px; flex-wrap:wrap; transition:border-color 0.3s; }
        .discord-contact-card:hover { border-color:var(--bord2); }
        .contact-title { font-family:'Cinzel',serif; font-size:1.15rem; font-weight:600; margin-bottom:8px; }
        .contact-desc { font-size:0.92rem; color:var(--muted); line-height:1.65; }
        .faq-list { display:flex; flex-direction:column; gap:10px; margin-top:16px; }
        .faq-item { background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:hidden; cursor:pointer; transition:border-color 0.2s; }
        .faq-item:hover, .faq-open { border-color:var(--bord2); }
        .faq-q { display:flex; justify-content:space-between; align-items:center; padding:18px 22px; font-weight:500; font-size:0.97rem; gap:12px; }
        .faq-arrow { color:var(--sky); font-size:1.2rem; flex-shrink:0; transition:transform 0.3s; }
        .faq-open .faq-arrow { transform:rotate(180deg); }
        .faq-body { overflow:hidden; transition:max-height 0.4s ease; }
        .faq-body p { padding:0 22px 20px; font-size:0.92rem; color:var(--muted); line-height:1.7; }

        /* FOOTER */
        .footer { background:var(--bg2); border-top:1px solid var(--border); padding:24px; margin-top:40px; }
        .footer-bottom { max-width:1200px; margin:0 auto; display:flex; justify-content:center; font-size:0.8rem; color:var(--muted); }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display:none; }
          .hamburger { display:flex; }
          .stats-inner { grid-template-columns:1fr 1fr; }
          .discord-contact-card { flex-direction:column; text-align:center; }
        }
        @media (max-width: 480px) {
          .store-tabs { justify-content:center; }
          .section { padding:60px 18px; }
          .stats-inner { padding:32px 20px; }
        }
      `}</style>

      <Navbar page={page} setPage={changePage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div key={page} style={{ animation:"fadeIn 0.4s ease" }}>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }`}</style>
        {page === "Home"    && <HomePage />}
        {page === "Store"   && <StorePage />}
        {page === "Support" && <SupportPage />}
      </div>
      <Footer />
    </>
  );
}
