import { useState } from "react";

// ─── Brand colors from Merch24 logo ─────────────────────────────────────────
// Charcoal: #484848  Green: #6abf47

const BRAND = {
  charcoal: "#484848",
  green: "#6abf47",
  greenDark: "#4e9432",
  greenLight: "#eaf6e3",
};

const SIZES = {
  shirt:       ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  jacket:      ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  pant_waist:  ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
  pant_length: ["28", "30", "32", "34", "36"],
  shoe:        ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13", "14"],
  hat:         ["S/M", "L/XL", "One Size"],
};

const ITEM_TYPES = [
  { id: "shirt",  label: "T-Shirt / Polo",   icon: "👕" },
  { id: "jacket", label: "Jacket / Hoodie",  icon: "🧥" },
  { id: "pant",   label: "Pants",            icon: "👖" },
  { id: "shoe",   label: "Shoes",            icon: "👟" },
  { id: "hat",    label: "Hat / Cap",        icon: "🧢" },
];

const DEMO = {
  id: "demo-123",
  name: "Company Retreat 2026",
  organizer: "Sarah Johnson",
  deadline: "2026-03-25",
  items: ["shirt", "jacket", "hat"],
  responses: [
    { name: "Alex Turner",  email: "alex@co.com",  shirt: "L",  jacket: "XL", hat: "L/XL", submittedAt: "2026-03-10" },
    { name: "Maya Patel",   email: "maya@co.com",  shirt: "S",  jacket: "S",  hat: "S/M",  submittedAt: "2026-03-10" },
    { name: "Chris Davies", email: "chris@co.com", shirt: "XL", jacket: "2XL",hat: "L/XL", submittedAt: "2026-03-11" },
  ],
};

function generateId() { return Math.random().toString(36).slice(2, 9); }

function exportCSV(campaign) {
  if (!campaign.responses.length) return;
  const headers = ["Name", "Email", ...campaign.items.map((i) => ITEM_TYPES.find((t) => t.id === i)?.label || i), "Submitted"];
  const rows = campaign.responses.map((r) => [
    r.name, r.email,
    ...campaign.items.map((i) => (i === "pant" ? `${r.pant_waist}/${r.pant_length}` : r[i] || "")),
    r.submittedAt,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${campaign.name.replace(/\s+/g, "_")}_sizes.csv`;
  a.click();
}

// ─── Logo SVG ────────────────────────────────────────────────────────────────
function Logo({ size = "md" }) {
  const scales = { sm: 0.55, md: 0.85, lg: 1.2 };
  const s = scales[size] || 1;
  return (
    <svg width={Math.round(260 * s)} height={Math.round(58 * s)} viewBox="0 0 260 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* MERCH text */}
      <text x="0" y="38" fontFamily="'Arial Black', 'Franklin Gothic Heavy', sans-serif" fontWeight="900" fontSize="42" fill="#484848" letterSpacing="-1">MERCH</text>
      {/* COLLECT text in green */}
      <text x="143" y="38" fontFamily="'Arial Black', 'Franklin Gothic Heavy', sans-serif" fontWeight="900" fontSize="42" fill="#6abf47" letterSpacing="-1">COLLECT</text>
      {/* Swoosh arrow under COLLECT */}
      <path d="M143 46 Q195 58 248 48 L244 44 L252 50 L244 54 L248 50 Q195 62 139 50Z" fill="#6abf47" />
      {/* Tagline */}
      <text x="1" y="54" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#888">Powered By Promotional Source</text>
    </svg>
  );
}

// ─── Shared UI ───────────────────────────────────────────────────────────────
function SizeBtn({ size, selected, onClick }) {
  return (
    <button
      type="button" onClick={onClick}
      style={selected ? { borderColor: BRAND.green, backgroundColor: BRAND.green, color: "#fff" } : {}}
      className={`px-3 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-100 ${
        selected ? "shadow scale-105" : "border-slate-200 bg-white text-slate-700 hover:border-green-400"
      }`}
    >
      {size}
    </button>
  );
}

function GreenBtn({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{ backgroundColor: BRAND.green }}
      className={`px-6 py-3 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      style={{ borderColor: BRAND.charcoal, color: BRAND.charcoal }}
      className={`px-6 py-3 font-bold rounded-xl border-2 hover:bg-gray-100 transition ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Landing ─────────────────────────────────────────────────────────────────
function Landing({ onNew, onDemo }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f7f8f6" }}>
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <Logo size="sm" />
        <GreenBtn onClick={onNew} className="text-sm py-2 px-5">+ New Campaign</GreenBtn>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
          Collect clothing sizes from your whole team in minutes.<br />
          <span style={{ color: BRAND.green }} className="font-bold">No more spreadsheet chaos.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GreenBtn onClick={onNew} className="text-lg py-4 px-10">Create a Campaign →</GreenBtn>
          <OutlineBtn onClick={onDemo} className="text-lg py-4 px-10">View Demo</OutlineBtn>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          {[
            ["🔗", "Share a link"],
            ["📋", "Collect all size types"],
            ["📊", "Export to CSV"],
            ["⚡", "No accounts needed"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Merch Collect · Powered By Promotional Source
      </footer>
    </div>
  );
}

// ─── Create Campaign ──────────────────────────────────────────────────────────
function CreateCampaign({ onCreated, onBack }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [deadline, setDeadline] = useState("");
  const [items, setItems] = useState(["shirt"]);
  const [error, setError] = useState("");

  function toggle(id) { setItems((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]); }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-bold text-sm">← Back</button>
        <Logo size="sm" />
        <span className="text-slate-300 font-light">|</span>
        <span className="font-bold text-slate-600">New Campaign</span>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${step >= n ? "text-white" : "bg-slate-200 text-slate-500"}`}
                style={step >= n ? { backgroundColor: BRAND.green } : {}}>
                {n}
              </div>
              <span className={`text-sm font-semibold ${step >= n ? "text-slate-700" : "text-slate-400"}`}>
                {n === 1 ? "Details" : "Items"}
              </span>
              {n < 2 && <div className="w-8 h-0.5 bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-black mb-6" style={{ color: BRAND.charcoal }}>Campaign Details</h2>
              <div className="space-y-5">
                {[
                  { label: "Campaign Name *", key: "name", val: name, set: setName, ph: "e.g. Summer Retreat 2026", type: "text" },
                  { label: "Organizer Name *", key: "org",  val: organizer, set: setOrganizer, ph: "e.g. Jane Smith", type: "text" },
                  { label: "Response Deadline (optional)", key: "dl", val: deadline, set: setDeadline, ph: "", type: "date" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold text-slate-600 mb-1">{f.label}</label>
                    <input
                      type={f.type} value={f.val} placeholder={f.ph}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none transition focus:border-green-400"
                      style={{ "--tw-ring-color": BRAND.green }}
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <GreenBtn onClick={() => { if (!name || !organizer) { setError("Please fill required fields."); return; } setError(""); setStep(2); }} className="mt-8 w-full py-4 text-lg">
                Next: Choose Items →
              </GreenBtn>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-black mb-2" style={{ color: BRAND.charcoal }}>What are you ordering?</h2>
              <p className="text-slate-500 text-sm mb-6">Select all item types to collect sizes for.</p>
              <div className="space-y-3">
                {ITEM_TYPES.map((item) => {
                  const on = items.includes(item.id);
                  return (
                    <button key={item.id} type="button" onClick={() => toggle(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left`}
                      style={on ? { borderColor: BRAND.green, backgroundColor: BRAND.greenLight } : { borderColor: "#e2e8f0" }}>
                      <span className="text-2xl">{item.icon}</span>
                      <span className={`font-bold flex-1`} style={{ color: on ? BRAND.greenDark : BRAND.charcoal }}>{item.label}</span>
                      {on && <span style={{ color: BRAND.green }} className="font-black text-lg">✓</span>}
                    </button>
                  );
                })}
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex gap-3 mt-8">
                <OutlineBtn onClick={() => setStep(1)} className="flex-1 py-4">← Back</OutlineBtn>
                <GreenBtn onClick={() => {
                  if (!items.length) { setError("Select at least one item."); return; }
                  onCreated({ id: generateId(), name, organizer, deadline, items, responses: [] });
                }} className="flex-1 py-4">Create Campaign →</GreenBtn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Submit Form ──────────────────────────────────────────────────────────────
function SubmitForm({ campaign, onSubmitted, onBack }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  function submit() {
    if (!form.name || !form.email) { setError("Please enter your name and email."); return; }
    for (const id of campaign.items) {
      if (id === "pant") {
        if (!form.pant_waist || !form.pant_length) { setError("Please select all pant sizes."); return; }
      } else if (!form[id]) {
        setError(`Please select your ${ITEM_TYPES.find((t) => t.id === id)?.label} size.`); return;
      }
    }
    onSubmitted({ ...form, submittedAt: new Date().toISOString().split("T")[0] });
    setDone(true);
  }

  if (done) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black mb-2" style={{ color: BRAND.charcoal }}>You're all set!</h2>
        <p className="text-slate-500 mb-8">Sizes submitted. Thanks, {form.name.split(" ")[0]}!</p>
        <Logo size="sm" />
        <div className="mt-6"><GreenBtn onClick={onBack} className="px-8 py-3">Back to Home</GreenBtn></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header bar */}
      <div className="text-white py-8 px-6 text-center" style={{ backgroundColor: BRAND.charcoal }}>
        <div className="flex justify-center mb-3"><Logo size="sm" /></div>
        <h1 className="text-2xl font-black mt-2">{campaign.name}</h1>
        <p className="text-slate-300 text-sm mt-1">Organized by {campaign.organizer}</p>
        {campaign.deadline && <p className="text-sm mt-1" style={{ color: BRAND.green }}>Please respond by {campaign.deadline}</p>}
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-5">
        <div className="bg-white rounded-3xl shadow p-6">
          <h3 className="font-black text-lg mb-4" style={{ color: BRAND.charcoal }}>Your Info</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Full Name *</label>
              <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-400" placeholder="Jane Smith" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Email *</label>
              <input type="email" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-400" placeholder="jane@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
        </div>

        {campaign.items.map((id) => {
          const def = ITEM_TYPES.find((t) => t.id === id);
          return (
            <div key={id} className="bg-white rounded-3xl shadow p-6">
              <h3 className="font-black text-lg mb-4" style={{ color: BRAND.charcoal }}>{def.icon} {def.label}</h3>
              {id === "pant" ? (
                <>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Waist</p>
                  <div className="flex flex-wrap gap-2 mb-4">{SIZES.pant_waist.map((s) => <SizeBtn key={s} size={s} selected={form.pant_waist === s} onClick={() => set("pant_waist", s)} />)}</div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Inseam</p>
                  <div className="flex flex-wrap gap-2">{SIZES.pant_length.map((s) => <SizeBtn key={s} size={s} selected={form.pant_length === s} onClick={() => set("pant_length", s)} />)}</div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">{SIZES[id].map((s) => <SizeBtn key={s} size={s} selected={form[id] === s} onClick={() => set(id, s)} />)}</div>
              )}
            </div>
          );
        })}

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
        <GreenBtn onClick={submit} className="w-full py-5 text-lg">Submit My Sizes ✓</GreenBtn>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ campaign, onSubmitForm, onBack, onExport }) {
  const daysLeft = campaign.deadline
    ? Math.ceil((new Date(campaign.deadline) - new Date()) / 86400000)
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-bold text-sm">← Home</button>
          <Logo size="sm" />
        </div>
        <GreenBtn onClick={onExport} disabled={!campaign.responses.length} className="py-2 px-5 text-sm">
          Export CSV ↓
        </GreenBtn>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: BRAND.charcoal }}>{campaign.name}</h1>
          <p className="text-slate-500 text-sm">Organized by {campaign.organizer}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Responses",  value: campaign.responses.length },
            { label: "Item Types", value: campaign.items.length },
            { label: daysLeft !== null ? "Days Left" : "Deadline", value: daysLeft !== null ? (daysLeft < 0 ? "Closed" : daysLeft) : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow p-5 text-center">
              <div className="text-3xl font-black" style={{ color: BRAND.green }}>{s.value}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Share link */}
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-sm font-bold text-slate-600 mb-2">📎 Share this link with your team</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono truncate">
              collect.merch24.ca/submit/{campaign.id}
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText(`collect.merch24.ca/submit/${campaign.id}`)}
              className="px-4 py-2 font-bold rounded-xl text-sm transition"
              style={{ backgroundColor: BRAND.greenLight, color: BRAND.greenDark }}
            >
              Copy
            </button>
          </div>
          <button onClick={onSubmitForm} className="mt-3 text-sm font-semibold hover:underline" style={{ color: BRAND.green }}>
            → Preview / fill out the form yourself
          </button>
        </div>

        {/* Responses */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-800">Responses</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: BRAND.greenLight, color: BRAND.greenDark }}>
              {campaign.responses.length} submitted
            </span>
          </div>
          {!campaign.responses.length ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-semibold">No responses yet.</p>
              <p className="text-sm mt-1">Share your link to start collecting sizes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Email</th>
                    {campaign.items.map((id) => (
                      <th key={id} className="px-4 py-3 text-left">
                        {ITEM_TYPES.find((t) => t.id === id)?.icon}{" "}
                        {ITEM_TYPES.find((t) => t.id === id)?.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.responses.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold" style={{ color: BRAND.charcoal }}>{r.name}</td>
                      <td className="px-5 py-3 text-slate-500">{r.email}</td>
                      {campaign.items.map((id) => (
                        <td key={id} className="px-4 py-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: BRAND.greenLight, color: BRAND.greenDark }}>
                            {id === "pant" ? `${r.pant_waist}/${r.pant_length}` : r[id] || "—"}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-slate-400 text-xs">{r.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [campaigns, setCampaigns] = useState([DEMO]);
  const [view, setView] = useState("landing");
  const [activeId, setActiveId] = useState(null);

  const active = campaigns.find((c) => c.id === activeId);

  function handleCreated(c) { setCampaigns((p) => [...p, c]); setActiveId(c.id); setView("dashboard"); }
  function handleResponse(r) {
    setCampaigns((p) => p.map((c) => c.id === activeId ? { ...c, responses: [...c.responses, r] } : c));
  }

  if (view === "landing")   return <Landing onNew={() => setView("create")} onDemo={() => { setActiveId("demo-123"); setView("dashboard"); }} />;
  if (view === "create")    return <CreateCampaign onCreated={handleCreated} onBack={() => setView("landing")} />;
  if (view === "dashboard" && active) return <Dashboard campaign={active} onBack={() => setView("landing")} onSubmitForm={() => setView("submit")} onExport={() => exportCSV(active)} />;
  if (view === "submit" && active)    return <SubmitForm campaign={active} onSubmitted={handleResponse} onBack={() => setView("landing")} />;
  return null;
}
