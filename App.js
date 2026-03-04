import { useState, useMemo } from "react";

const STAGES = ["Idea", "Scripted", "Filmed", "Editing", "Scheduled", "Published"];
const PLATFORMS = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Twitter/X", "Blog", "Podcast", "Other"];
const CATEGORIES = ["Tutorial", "Behind the Scenes", "Story", "Product", "Trend", "Educational", "Entertainment", "Collab"];
const PRIORITIES = ["High", "Medium", "Low"];

const STAGE_COLORS = {
  "Idea": { bg: "#1a1a2e", accent: "#6c63ff", text: "#a89fff" },
  "Scripted": { bg: "#1a2a1e", accent: "#00c896", text: "#7fffd4" },
  "Filmed": { bg: "#2a1a1e", accent: "#ff6b6b", text: "#ffb3b3" },
  "Editing": { bg: "#2a241a", accent: "#ffa94d", text: "#ffd8a8" },
  "Scheduled": { bg: "#1a1e2a", accent: "#74c0fc", text: "#bde0ff" },
  "Published": { bg: "#1e1e1e", accent: "#69db7c", text: "#b2f2bb" },
};

const PRIORITY_DOT = { High: "#ff6b6b", Medium: "#ffa94d", Low: "#74c0fc" };

const INITIAL_IDEAS = [
  {
    id: 1, title: "Morning Routine Transformation",
    description: "Before/after morning routine, showing how 30 mins of intentional time changed my productivity",
    platform: "TikTok", category: "Story", stage: "Scripted", priority: "High",
    footage: ["Morning b-roll", "Desk setup clips"], tags: ["routine", "productivity"],
    hook: "I wasted 2 years of mornings until I did this one thing",
    dueDate: "2026-03-15", createdAt: "2026-02-28"
  },
  {
    id: 2, title: "Behind The Edit: Color Grading Tutorial",
    description: "Full walkthrough of my editing process, color grading secrets for cinematic look",
    platform: "YouTube", category: "Tutorial", stage: "Idea", priority: "Medium",
    footage: [], tags: ["editing", "tutorial", "color"],
    hook: "This $0 technique makes your videos look cinematic",
    dueDate: "2026-03-22", createdAt: "2026-03-01"
  },
  {
    id: 3, title: "Week in My Life — NYC Edition",
    description: "Raw, unfiltered week documenting all content creation, meetings, and random moments",
    platform: "Instagram", category: "Behind the Scenes", stage: "Filmed", priority: "High",
    footage: ["Monday vlog", "Studio day", "Coffee shop clips", "Subway moments"],
    tags: ["vlog", "nyc", "weekinmylife"],
    hook: "This week was chaotic. You need to see it.",
    dueDate: "2026-03-10", createdAt: "2026-02-20"
  },
];

let nextId = 4;

const Modal = ({ onClose, onSave, editItem }) => {
  const [form, setForm] = useState(editItem || {
    title: "", description: "", platform: "Instagram", category: "Tutorial",
    stage: "Idea", priority: "Medium", footage: [], tags: [],
    hook: "", dueDate: "", createdAt: new Date().toISOString().split("T")[0]
  });
  const [footageInput, setFootageInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addFootage = () => {
    if (footageInput.trim()) {
      set("footage", [...(form.footage || []), footageInput.trim()]);
      setFootageInput("");
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      set("tags", [...(form.tags || []), tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }} onClick={onClose}>
      <div style={{
        background: "#111118", border: "1px solid #2a2a3e", borderRadius: "20px",
        padding: "36px", width: "100%", maxWidth: "640px", maxHeight: "90vh",
        overflowY: "auto", position: "relative"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#f0eeff", margin: 0 }}>
            {editItem ? "Edit Idea" : "New Idea"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <Field label="Title">
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="What's the content idea?" style={inputStyle} />
          </Field>

          <Field label="Hook / Opening Line">
            <input value={form.hook} onChange={e => set("hook", e.target.value)}
              placeholder="The first thing your audience will see or hear…" style={inputStyle} />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="What's this content about?" style={{ ...inputStyle, resize: "vertical" }} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Platform">
              <select value={form.platform} onChange={e => set("platform", e.target.value)} style={inputStyle}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Stage">
              <select value={form.stage} onChange={e => set("stage", e.target.value)} style={inputStyle}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select value={form.priority} onChange={e => set("priority", e.target.value)} style={inputStyle}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Due Date">
            <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} style={inputStyle} />
          </Field>

          <Field label="Footage Logged">
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input value={footageInput} onChange={e => setFootageInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addFootage()}
                placeholder="Add footage clip…" style={{ ...inputStyle, flex: 1, margin: 0 }} />
              <button onClick={addFootage} style={pillBtn}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {(form.footage || []).map((f, i) => (
                <span key={i} style={{ ...tagChip, background: "#1a2a1e", color: "#7fffd4", border: "1px solid #00c89640" }}>
                  🎬 {f}
                  <button onClick={() => set("footage", form.footage.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", color: "#7fffd4", cursor: "pointer", marginLeft: "4px", padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </Field>

          <Field label="Tags">
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag()}
                placeholder="Add tag…" style={{ ...inputStyle, flex: 1, margin: 0 }} />
              <button onClick={addTag} style={pillBtn}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {(form.tags || []).map((t, i) => (
                <span key={i} style={{ ...tagChip, background: "#1a1a2e", color: "#a89fff", border: "1px solid #6c63ff40" }}>
                  #{t}
                  <button onClick={() => set("tags", form.tags.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", color: "#a89fff", cursor: "pointer", marginLeft: "4px", padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
          <button onClick={onClose} style={{ ...pillBtn, background: "transparent", color: "#888", border: "1px solid #333" }}>Cancel</button>
          <button onClick={() => form.title && onSave(form)} style={{ ...pillBtn, background: "#6c63ff", color: "#fff", opacity: form.title ? 1 : 0.5 }}>
            {editItem ? "Save Changes" : "Add to Bank"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase", marginBottom: "6px" }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", background: "#0d0d18", border: "1px solid #2a2a3e", borderRadius: "10px",
  padding: "10px 14px", color: "#e0e0ff", fontSize: "14px", boxSizing: "border-box",
  outline: "none", fontFamily: "inherit"
};

const pillBtn = {
  background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "8px",
  padding: "9px 16px", color: "#a89fff", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap"
};

const tagChip = {
  display: "inline-flex", alignItems: "center", padding: "4px 10px",
  borderRadius: "20px", fontSize: "12px", fontWeight: 500
};

const IdeaCard = ({ idea, onEdit, onDelete, onStageChange }) => {
  const sc = STAGE_COLORS[idea.stage];
  const isOverdue = idea.dueDate && new Date(idea.dueDate) < new Date() && idea.stage !== "Published";

  return (
    <div style={{
      background: "#111118", border: "1px solid #1e1e2e", borderRadius: "16px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
      transition: "transform 0.15s, box-shadow 0.15s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#f0eeff", margin: 0, lineHeight: 1.3 }}>
          {idea.title}
        </h3>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button onClick={() => onEdit(idea)} style={{ ...iconBtn, color: "#6c63ff" }} title="Edit">✏️</button>
          <button onClick={() => onDelete(idea.id)} style={{ ...iconBtn, color: "#ff6b6b" }} title="Delete">🗑️</button>
        </div>
      </div>

      {/* Hook */}
      {idea.hook && (
        <div style={{ background: "#0d0d18", borderLeft: "3px solid #6c63ff", borderRadius: "0 8px 8px 0", padding: "8px 12px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#a89fff", fontStyle: "italic" }}>"{idea.hook}"</p>
        </div>
      )}

      {idea.description && (
        <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.5 }}>{idea.description}</p>
      )}

      {/* Meta chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ ...tagChip, background: "#1a1a2e", color: "#c5bfff", border: "1px solid #2a2a3e", fontSize: "11px" }}>
          {idea.platform}
        </span>
        <span style={{ ...tagChip, background: "#1a1a2e", color: "#c5bfff", border: "1px solid #2a2a3e", fontSize: "11px" }}>
          {idea.category}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", ...tagChip, background: "#1a1a2e", color: PRIORITY_DOT[idea.priority], border: `1px solid ${PRIORITY_DOT[idea.priority]}40`, fontSize: "11px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: PRIORITY_DOT[idea.priority], display: "inline-block" }} />
          {idea.priority}
        </span>
        {isOverdue && (
          <span style={{ ...tagChip, background: "#2a1a1e", color: "#ff6b6b", border: "1px solid #ff6b6b40", fontSize: "11px" }}>
            ⚠ Overdue
          </span>
        )}
      </div>

      {/* Footage */}
      {idea.footage && idea.footage.length > 0 && (
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>Footage</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {idea.footage.map((f, i) => (
              <span key={i} style={{ ...tagChip, background: "#0d1a12", color: "#7fffd4", border: "1px solid #00c89630", fontSize: "11px" }}>🎬 {f}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {idea.tags.map((t, i) => (
            <span key={i} style={{ fontSize: "11px", color: "#555" }}>#{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #1e1e2e" }}>
        <select value={idea.stage} onChange={e => onStageChange(idea.id, e.target.value)}
          style={{ background: sc.bg, border: `1px solid ${sc.accent}50`, borderRadius: "8px", padding: "5px 10px", color: sc.text, fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        {idea.dueDate && (
          <span style={{ fontSize: "11px", color: isOverdue ? "#ff6b6b" : "#555" }}>
            📅 {new Date(idea.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
};

const iconBtn = { background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: "2px 4px", opacity: 0.7 };

export default function ContentIdeaBank() {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [view, setView] = useState("grid"); // grid | kanban | pipeline
  const [filterStage, setFilterStage] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => ideas.filter(i => {
    if (filterStage !== "All" && i.stage !== filterStage) return false;
    if (filterPlatform !== "All" && i.platform !== filterPlatform) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
      !i.description.toLowerCase().includes(search.toLowerCase()) &&
      !(i.tags || []).some(t => t.includes(search.toLowerCase()))) return false;
    return true;
  }), [ideas, filterStage, filterPlatform, search]);

  const stats = useMemo(() => ({
    total: ideas.length,
    byStage: STAGES.reduce((a, s) => ({ ...a, [s]: ideas.filter(i => i.stage === s).length }), {}),
    highPriority: ideas.filter(i => i.priority === "High" && i.stage !== "Published").length,
    withFootage: ideas.filter(i => i.footage && i.footage.length > 0).length,
  }), [ideas]);

  const saveIdea = (form) => {
    if (editItem) {
      setIdeas(prev => prev.map(i => i.id === editItem.id ? { ...form, id: i.id } : i));
    } else {
      setIdeas(prev => [...prev, { ...form, id: nextId++ }]);
    }
    setShowModal(false);
    setEditItem(null);
  };

  const openEdit = (idea) => { setEditItem(idea); setShowModal(true); };
  const deleteIdea = (id) => setIdeas(prev => prev.filter(i => i.id !== id));
  const changeStage = (id, stage) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, stage } : i));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a12", fontFamily: "'DM Sans', sans-serif", color: "#e0e0ff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", margin: 0, background: "linear-gradient(135deg, #f0eeff, #6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Content Idea Bank
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>Your creative command center</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{
          background: "linear-gradient(135deg, #6c63ff, #9c88ff)", border: "none", borderRadius: "12px",
          padding: "12px 24px", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px"
        }}>
          + New Idea
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ padding: "20px 32px", display: "flex", gap: "16px", overflowX: "auto", borderBottom: "1px solid #1a1a2e" }}>
        {[
          { label: "Total Ideas", value: stats.total, color: "#6c63ff" },
          { label: "High Priority", value: stats.highPriority, color: "#ff6b6b" },
          { label: "Have Footage", value: stats.withFootage, color: "#00c896" },
          ...STAGES.map(s => ({ label: s, value: stats.byStage[s], color: STAGE_COLORS[s].accent }))
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "14px 20px", minWidth: "90px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ padding: "16px 32px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid #1a1a2e" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search ideas, tags…"
          style={{ ...inputStyle, maxWidth: "260px", background: "#0d0d18" }} />

        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={{ ...inputStyle, maxWidth: "140px", background: "#0d0d18" }}>
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>

        <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} style={{ ...inputStyle, maxWidth: "140px", background: "#0d0d18" }}>
          <option value="All">All Platforms</option>
          {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </select>

        <div style={{ marginLeft: "auto", display: "flex", gap: "4px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: "10px", padding: "4px" }}>
          {[["grid", "⊞ Grid"], ["kanban", "⋮⋮ Kanban"], ["pipeline", "→ Pipeline"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "#6c63ff" : "transparent", border: "none", borderRadius: "8px",
              padding: "7px 14px", color: view === v ? "#fff" : "#666", fontSize: "12px",
              cursor: "pointer", fontFamily: "inherit", fontWeight: view === v ? 600 : 400
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px" }}>
        {view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filtered.map(idea => (
              <IdeaCard key={idea.id} idea={idea} onEdit={openEdit} onDelete={deleteIdea} onStageChange={changeStage} />
            ))}
            {filtered.length === 0 && <EmptyState />}
          </div>
        )}

        {view === "kanban" && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, minmax(240px, 1fr))`, gap: "16px", overflowX: "auto" }}>
            {STAGES.map(stage => {
              const sc = STAGE_COLORS[stage];
              const stageIdeas = filtered.filter(i => i.stage === stage);
              return (
                <div key={stage}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: sc.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>{stage}</span>
                    <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.accent}40`, borderRadius: "20px", padding: "2px 10px", fontSize: "11px" }}>{stageIdeas.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {stageIdeas.map(idea => (
                      <IdeaCard key={idea.id} idea={idea} onEdit={openEdit} onDelete={deleteIdea} onStageChange={changeStage} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "pipeline" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {filtered.map((idea, idx) => {
              const sc = STAGE_COLORS[idea.stage];
              const stageIdx = STAGES.indexOf(idea.stage);
              return (
                <div key={idea.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 0", borderBottom: "1px solid #141420" }}>
                  <span style={{ width: "28px", textAlign: "center", fontSize: "13px", color: "#333", flexShrink: 0 }}>{idx + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px", color: "#f0eeff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{idea.title}</span>
                      <span style={{ ...tagChip, background: "#1a1a2e", color: "#888", border: "1px solid #2a2a3e", fontSize: "11px", flexShrink: 0 }}>{idea.platform}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {STAGES.map((s, i) => (
                        <div key={s} style={{
                          height: "4px", flex: 1, borderRadius: "2px",
                          background: i <= stageIdx ? STAGE_COLORS[s].accent : "#1e1e2e",
                          transition: "background 0.3s"
                        }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ ...tagChip, background: sc.bg, color: sc.text, border: `1px solid ${sc.accent}40`, fontSize: "11px" }}>{idea.stage}</span>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PRIORITY_DOT[idea.priority], display: "inline-block", flexShrink: 0 }} title={idea.priority} />
                    <button onClick={() => openEdit(idea)} style={{ ...iconBtn, color: "#6c63ff", fontSize: "13px" }}>✏️</button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <EmptyState />}
          </div>
        )}
      </div>

      {showModal && <Modal onClose={() => { setShowModal(false); setEditItem(null); }} onSave={saveIdea} editItem={editItem} />}
    </div>
  );
}

const EmptyState = () => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#333", gridColumn: "1 / -1" }}>
    <div style={{ fontSize: "48px", marginBottom: "12px" }}>💡</div>
    <p style={{ fontSize: "16px", margin: 0 }}>No ideas here yet</p>
    <p style={{ fontSize: "13px", margin: "6px 0 0", color: "#444" }}>Add your first idea or adjust your filters</p>
  </div>
);
