import { useState, useEffect, useRef } from "react";

// ─── CSS injected via style tag ───────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --bg2: #11111a;
    --bg3: #1a1a28;
    --accent: #7c6aff;
    --accent2: #ff6a9b;
    --text: #f0eff8;
    --muted: #7a7990;
    --border: #2a2a3a;
    --card: #141420;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.2rem 5%;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.2rem; letter-spacing: -0.5px;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 2rem; font-size: 0.85rem; font-weight: 500; color: var(--muted); }
  .nav-links a:hover { color: var(--text); transition: color 0.2s; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    padding: 8rem 5% 5rem;
    position: relative; overflow: hidden;
  }
  .hero-blob {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,106,255,0.15) 0%, transparent 70%);
    top: -100px; right: -100px; pointer-events: none;
  }
  .hero-blob2 {
    position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,106,155,0.1) 0%, transparent 70%);
    bottom: -50px; left: 10%; pointer-events: none;
  }
  .hero-tag {
    display: inline-block;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent);
    border: 1px solid rgba(124,106,255,0.3);
    padding: 0.35rem 1rem; border-radius: 100px;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s both;
  }
  .hero-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 800; line-height: 1.05; letter-spacing: -2px;
    margin-bottom: 1.2rem;
    animation: fadeUp 0.7s 0.1s both;
  }
  .hero-name .highlight {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: 1.1rem; color: var(--muted); max-width: 520px;
    margin-bottom: 2.5rem; font-weight: 300; line-height: 1.7;
    animation: fadeUp 0.7s 0.2s both;
  }
  .hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; animation: fadeUp 0.7s 0.3s both; }
  .hero-stats {
    display: flex; gap: 3rem;
    margin-top: 4rem; padding-top: 3rem;
    border-top: 1px solid var(--border);
    animation: fadeUp 0.7s 0.4s both;
  }
  .stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem; font-weight: 800; color: var(--text);
  }
  .stat-label { font-size: 0.8rem; color: var(--muted); font-weight: 400; }

  /* BUTTONS */
  .btn-primary {
    background: var(--accent); color: #fff;
    padding: 0.85rem 2rem; border-radius: 8px;
    font-weight: 500; font-size: 0.95rem; cursor: pointer;
    border: none; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.2s;
    display: inline-block;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-secondary {
    border: 1px solid var(--border); color: var(--text);
    padding: 0.85rem 2rem; border-radius: 8px;
    font-weight: 500; font-size: 0.95rem; cursor: pointer;
    background: transparent; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; display: inline-block;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

  /* SECTIONS */
  .section { padding: 5rem 5%; }
  .section.alt { background: var(--bg2); }
  .sec-tag {
    font-size: 0.75rem; font-weight: 500; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent); margin-bottom: 0.75rem;
  }
  .sec-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 800; letter-spacing: -1px;
    margin-bottom: 1rem; line-height: 1.1;
  }
  .sec-desc {
    color: var(--muted); max-width: 520px; font-size: 1rem;
    line-height: 1.7; margin-bottom: 3rem; font-weight: 300;
  }

  /* ABOUT */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
  }
  .about-img {
    aspect-ratio: 1; background: var(--bg3); border-radius: 16px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 5rem; color: var(--accent);
    font-family: 'Syne', sans-serif; font-weight: 800;
  }
  .about-text p { color: var(--muted); font-size: 0.97rem; line-height: 1.8; margin-bottom: 1rem; font-weight: 300; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }
  .chip {
    background: var(--bg3); border: 1px solid var(--border);
    padding: 0.35rem 1rem; border-radius: 100px;
    font-size: 0.8rem; font-weight: 500; color: var(--muted);
    transition: all 0.2s; cursor: default;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent); }

  /* PROJECTS */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .proj-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    padding: 1.75rem; transition: border-color 0.2s, transform 0.2s;
    position: relative; overflow: hidden;
  }
  .proj-card:hover { border-color: var(--accent); transform: translateY(-4px); }
  .proj-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    opacity: 0; transition: opacity 0.2s;
  }
  .proj-card:hover::before { opacity: 1; }
  .proj-icon { font-size: 2.2rem; margin-bottom: 1.2rem; }
  .proj-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.6rem; letter-spacing: -0.3px; }
  .proj-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.2rem; font-weight: 300; }
  .proj-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.4rem; }
  .stack-tag {
    background: rgba(124,106,255,0.1); border: 1px solid rgba(124,106,255,0.2);
    color: var(--accent); padding: 0.25rem 0.7rem; border-radius: 6px;
    font-size: 0.75rem; font-weight: 500;
  }
  .proj-links { display: flex; gap: 1rem; }
  .proj-link { font-size: 0.82rem; color: var(--muted); font-weight: 500; transition: color 0.2s; }
  .proj-link:hover { color: var(--accent); }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
  .skill-cat { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; }
  .skill-cat-title {
    font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem;
  }
  .skill-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0; font-size: 0.9rem; color: var(--muted); font-weight: 300; }
  .skill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

  /* ACHIEVEMENTS */
  .ach-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
  .ach-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 14px;
    padding: 1.5rem; display: flex; gap: 1rem; align-items: flex-start;
    transition: border-color 0.2s;
  }
  .ach-card:hover { border-color: var(--accent2); }
  .ach-icon { font-size: 1.8rem; flex-shrink: 0; }
  .ach-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; }
  .ach-desc { font-size: 0.85rem; color: var(--muted); font-weight: 300; }
  .ach-year { font-size: 0.75rem; color: var(--accent2); font-weight: 500; margin-top: 0.3rem; }

  /* PROFILES */
  .profiles-row { display: flex; flex-wrap: wrap; gap: 1rem; }
  .profile-pill {
    display: flex; align-items: center; gap: 0.7rem;
    background: var(--card); border: 1px solid var(--border); border-radius: 12px;
    padding: 0.9rem 1.4rem; font-size: 0.9rem; font-weight: 500; color: var(--muted);
    transition: all 0.2s; cursor: pointer;
  }
  .profile-pill:hover { border-color: var(--accent); color: var(--text); transform: translateY(-2px); }
  .profile-icon { font-size: 1.2rem; }

  /* RESUME */
  .resume-section { text-align: center; }
  .resume-box {
    max-width: 500px; margin: 0 auto;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; padding: 3rem 2rem;
  }
  .resume-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem; }

  /* CONTACT */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .contact-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
  .contact-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--bg3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
  }
  .contact-label { font-size: 0.75rem; color: var(--muted); display: block; margin-bottom: 0.1rem; }
  .c-input {
    width: 100%; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.9rem 1.1rem;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s; margin-bottom: 1rem;
    display: block;
  }
  .c-input::placeholder { color: var(--muted); }
  .c-input:focus { border-color: var(--accent); }
  .c-textarea { height: 130px; resize: vertical; }

  /* FOOTER */
  .footer {
    padding: 2rem 5%; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 0.5rem; font-size: 0.82rem; color: var(--muted);
  }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-links a:hover { color: var(--text); }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .about-grid, .contact-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 1.5rem; flex-wrap: wrap; }
    .nav-links { display: none; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const projects = [
  {
    icon: "🤝",
    title: "Hand Sign Generator",
    desc: "Built a real-time hand-gesture recognition system using MediaPipe and CNN achieving 94% accuracy. Translated 26 ASL alphabets live from webcam feed with under 30ms latency.",
    stack: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
  },
  {
    icon: "📊",
    title: "Student Academic Dashboard",
    desc: "Developed a full-stack portal for students to track grades and attendance. Integrated FastAPI backend with role-based auth, deployed for 300+ student pilot at Chitkara University.",
    stack: ["React.js", "Node.js", "MongoDB", "FastAPI"],
    github: "https://github.com/deepanshuarora5810-bot/academic-x",
  },
  {
    icon: "📈",
    title: "InvestSafe",
    desc: "Built an AI-driven investment risk analyser that profiles user portfolios and flags high-risk assets. Trained classification model with 88% precision, surfaced via REST API.",
    stack: ["Python", "FastAPI", "React.js", "MongoDB", "ML"],
    github: "https://github.com/deepanshuarora5810-bot/invest_fear",
    demo: "https://youtu.be/8KRggdmzHyg?si=AFk6sg_5d9ZJWMyY",
  },
  {
    icon: "🍳",
    title: "RecipeTineEats",
    desc: "Created a recipe discovery platform with ingredient-based search, filtering, and collections. Integrated food API achieving sub-200ms average response with MySQL optimisation.",
    stack: ["React.js", "Node.js", "MySQL", "REST API"],
    github: "https://github.com/deepanshuarora5810-bot/recipe.git",
  },
];

const skillCategories = [
  {
    title: "Languages",
    items: ["Python", "C", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Frameworks & Libraries",
    items: ["React.js", "Node.js", "FastAPI"],
  },
  {
    title: "Databases",
    items: ["MongoDB", "MySQL"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Cloud Computing", "REST APIs"],
  },
  {
    title: "Concepts",
    items: ["Artificial Intelligence", "Machine Learning", "Web Development", "OOP", "DSA"],
  },
];

const achievements = [
  { icon: "🏆", title: "Smart India Hackathon (SIH)", desc: "National finalist; built AI-powered solution competing against 5,000+ teams.", year: "2025" },
  { icon: "🥈", title: "Eclipse 6.0 & Hack Helix", desc: "Top-tier finishes; delivered working prototypes under 24-hr constraints.", year: "2026" },
  { icon: "🌍", title: "Sustainability Hackathon, Dubai", desc: "Represented institution internationally; proposed an AI-driven sustainability model.", year: "2026" },
  { icon: "📜", title: "Microsoft AI-900", desc: "Azure AI Fundamentals Certification.", year: "2025" },
  { icon: "📜", title: "Microsoft AZ-900", desc: "Azure Cloud Fundamentals Certification.", year: "2026" },
  { icon: "🎓", title: "Oracle Generative AI Professional", desc: "Oracle Cloud Infrastructure Certification.", year: "2025" },
];

const profiles = [
  { icon: "🐙", name: "GitHub", handle: "@deepanshuarora5810-bot", href: "https://github.com/deepanshuarora5810-bot" },
  { icon: "💼", name: "LinkedIn", handle: "/in/deepanshu-arora-558873384", href: "https://www.linkedin.com/in/deepanshu-arora-558873384" },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">
        Deepanshu<span>.</span>
      </div>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#achievements">Achievements</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-blob" />
      <div className="hero-blob2" />
      <div className="hero-tag">Available for opportunities</div>
      <h1 className="hero-name">
        Deepanshu Arora
        <br />
        <span className="highlight">AI/ML Engineer</span>
      </h1>
      <p className="hero-sub">
        I build intelligent systems and scalable products — blending machine learning
        with modern full-stack development to solve real problems.
      </p>
      <div className="hero-cta">
        <a href="#projects" className="btn-primary">View Projects</a>
        <a href="#contact" className="btn-secondary">Contact Me</a>
      </div>
      <div className="hero-stats">
        <div>
          <div className="stat-val">6+</div>
          <div className="stat-label">ML Projects Shipped</div>
        </div>
        <div>
          <div className="stat-val">4+</div>
          <div className="stat-label">Hackathons Participated</div>
        </div>
        <div>
          <div className="stat-val">20+</div>
          <div className="stat-label">Certifications</div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section alt" id="about">
      <div className="about-grid">
        <div className="about-img">DA</div>
        <div className="about-text">
          <div className="sec-tag">About Me</div>
          <h2 className="sec-title">Building the future,<br />one model at a time.</h2>
          <p>
            I'm a final-year Computer Science student specializing in AI and Machine
            Learning. My work spans from fine-tuning LLMs to deploying production CV pipelines.
          </p>
          <p>
            Outside of models, I contribute to open-source AI tooling and compete in
            hackathons. Goal: join a research-forward team shipping AI to real users at scale.
          </p>
          <div className="chips">
            {["Generative AI", "NLP", "Computer Vision", "MLOps", "LLM Fine-tuning", "Open Source", "Research"].map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section" id="projects">
      <div className="sec-tag">Projects</div>
      <h2 className="sec-title">Selected Work</h2>
      <p className="sec-desc">Real products, real impact — highlights from my work.</p>
      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.title} className="proj-card">
            <div className="proj-icon">{p.icon}</div>
            <div className="proj-title">{p.title}</div>
            <p className="proj-desc">{p.desc}</p>
            <div className="proj-stack">
              {p.stack.map((s) => <span key={s} className="stack-tag">{s}</span>)}
            </div>
            <div className="proj-links">
              {p.github && p.github !== "#" && (
                <a className="proj-link" href={p.github} target="_blank" rel="noopener noreferrer">⌥ GitHub</a>
              )}
              {p.demo && p.demo !== "#" && (
                <a className="proj-link" href={p.demo} target="_blank" rel="noopener noreferrer">↗ Live Demo</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section alt" id="skills">
      <div className="sec-tag">Skills</div>
      <h2 className="sec-title">Tech Stack</h2>
      <p className="sec-desc">Languages, frameworks and tools I work with daily.</p>
      <div className="skills-grid">
        {skillCategories.map((cat) => (
          <div key={cat.title} className="skill-cat">
            <div className="skill-cat-title">{cat.title}</div>
            {cat.items.map((item) => (
              <div key={item} className="skill-item">
                <div className="skill-dot" />
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="sec-tag">Achievements</div>
      <h2 className="sec-title">Wins & Recognition</h2>
      <p className="sec-desc">Competitions, certifications, and milestones I'm proud of.</p>
      <div className="ach-grid">
        {achievements.map((a) => (
          <div key={a.title} className="ach-card">
            <div className="ach-icon">{a.icon}</div>
            <div>
              <div className="ach-title">{a.title}</div>
              <div className="ach-desc">{a.desc}</div>
              <div className="ach-year">{a.year}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Profiles() {
  return (
    <section className="section alt" id="profiles">
      <div className="sec-tag">Online Presence</div>
      <h2 className="sec-title">Find Me Online</h2>
      <p className="sec-desc">My code, competitive activity, and professional links.</p>
      <div className="profiles-row">
        {profiles.map((p) => (
          <a key={p.name} className="profile-pill" href={p.href} target="_blank" rel="noopener noreferrer">
            <span className="profile-icon">{p.icon}</span>
            <div>
              <div>{p.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 300 }}>{p.handle}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section className="section resume-section" id="resume">
      <div className="resume-box">
        <div className="sec-tag" style={{ textAlign: "center" }}>Resume</div>
        <h2 className="sec-title">Download My CV</h2>
        <p style={{ color: "var(--muted)", fontWeight: 300 }}>
          1-page, ATS-optimized resume focused on impact metrics and real outcomes.
        </p>
        <div className="resume-btns">
          <a href="https://drive.google.com/file/d/1RSjsJrnbdcFIa2tiNPIr7aG3413Bv2kA/view?usp=drivesdk" className="btn-primary" target="_blank" rel="noopener noreferrer">View Resume</a>
          <a href="https://drive.google.com/uc?export=download&id=1RSjsJrnbdcFIa2tiNPIr7aG3413Bv2kA" className="btn-secondary" target="_blank" rel="noopener noreferrer">Download PDF</a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    alert("Message sent! Connect a backend (EmailJS / Formspree) to activate this.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="section alt" id="contact">
      <div className="sec-tag">Contact</div>
      <h2 className="sec-title">Let's Connect</h2>
      <div className="contact-grid">
        <div>
          <p style={{ color: "var(--muted)", fontWeight: 300, fontSize: "0.97rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Open to full-time AI/ML roles, research collaborations, and interesting
            side projects. I reply within 24 hours.
          </p>
          {[
            { icon: "✉️", label: "Email", val: "deepanshu5810@gmail.com", href: "mailto:deepanshu5810@gmail.com" },
            { icon: "📞", label: "Phone", val: "+91 8570879836", href: "tel:+918570879836" },
            { icon: "💼", label: "LinkedIn", val: "linkedin.com/in/deepanshu-arora-558873384", href: "https://www.linkedin.com/in/deepanshu-arora-558873384" },
            { icon: "📍", label: "Location", val: "Chandigarh, India", href: "https://maps.google.com/?q=Chandigarh,India" },
          ].map((c) => (
            <a key={c.label} className="contact-item" href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className="contact-icon">{c.icon}</div>
              <div>
                <span className="contact-label">{c.label}</span>
                {c.val}
              </div>
            </a>
          ))}
        </div>
        <div>
          <input
            className="c-input"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="c-input"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
          />
          <textarea
            className="c-input c-textarea"
            name="message"
            placeholder="Your Message..."
            value={form.message}
            onChange={handleChange}
          />
          <button className="btn-primary" style={{ width: "100%", border: "none" }} onClick={handleSubmit}>
            Send Message
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>© 2025 Deepanshu Arora. All rights reserved.</div>
      <div className="footer-links">
        <a href="https://github.com/deepanshuarora5810-bot" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/deepanshu-arora-558873384" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:deepanshu5810@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function PortfolioWebsite() {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Achievements />
      <Profiles />
      <Resume />
      <Contact />
      <Footer />
    </>
  );
}
