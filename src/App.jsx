import { useState, useEffect } from "react";

const STEP_NAMES = {
  0:"Scheduling",1:"Initial Engagement",2:"Consultation & Direction",3:"Application & Case Opening",
  4:"Initial Materials Collection",5:"Record Title Development",6:"Verification Checklist & Docs",
  7:"Document Review & Confirmation",8:"Invoice & Payment",9:"Record Presentation Planning",
  10:"Branding Materials",11:"Certificate Content & Production",12:"Media & Event Coordination",
  13:"Event Preparation",14:"Pre-Event Checks","14a":"Record Attempt Protocol",
  15:"Presentation Ceremony",16:"Post-Event Media & Publicity",17:"Financial Closure",18:"Record Holder Engagement"
};

const STEP_CHECKLIST = {
  0: [
    "Identify contact channel (WhatsApp / referral / event)",
    "Send initial message",
    "Confirm appointment date & time",
    "Attend appointment",
  ],
  1: [
    "Engage via WhatsApp / other channels",
    "Introduce record opportunity",
    "Share record information",
    "Arrange meeting (F2F or online)",
    "Follow up until meeting confirmed",
  ],
  2: [
    "Attend meeting",
    "Present record platforms",
    "Understand applicant achievement & background",
    "Benchmark against ASEAN / Asia level",
    "Determine: Direct Record Recognition OR Official Record Attempt",
    "Advise on suitable approach",
    "Propose record positioning",
    "Share benefits, packages, media options",
    "Ask about presentation ceremony plan",
  ],
  3: [
    "Send application form link",
    "Issue acknowledgement after receiving form",
    "Create WhatsApp group",
    "Applicant: submitted form",
    "Applicant: added team to WhatsApp group",
  ],
  4: [
    "Request corporate profile",
    "Request product information",
    "Request presentation deck",
    "Received all materials from applicant",
  ],
  5: [
    "Review materials",
    "Develop proposed record titles",
    "Send titles to applicant",
    "Discuss and refine with applicant",
    "Chief Adjudicator reviewed & endorsed",
    "Applicant confirmed final title",
  ],
  6: [
    "Prepare verification checklist based on title",
    "Send checklist to applicant",
    "Follow up document submission",
    "Applicant uploaded docs to Google Drive",
    "Received Google Drive link",
  ],
  7: [
    "Review all submitted documents",
    "Follow up any missing items",
    "Compile verification summary",
    "Chief Adjudicator approved documents",
    "Official record recognition confirmed",
  ],
  8: [
    "Issue invoice",
    "Payment received from applicant",
  ],
  9: [
    "Ask for preferred presentation date",
    "Request event form (recipient, GOH, event info)",
    "Issue confirmation letter",
    "Applicant confirmed event date",
    "Applicant confirmed event plan",
    "Applicant submitted event form",
  ],
  10: [
    "Request logo in AI format (black version preferred)",
    "Received logo from applicant",
  ],
  11: [
    "Prepare certificate content draft",
    "Send draft for applicant approval",
    "Submit to supplier after confirmation",
    "Receive mock-up from supplier",
    "Send mock-up for final approval",
    "Applicant approved mock-up",
    "Proceed production",
    "(If attempt) Produce provisional certificate",
  ],
  12: [
    "Confirm media coverage option",
    "Follow up press release from applicant",
    "Follow up ceremony flow from applicant",
    "Follow up event details from applicant",
    "Arrange media attendance",
    "Share event details with media",
    "Prepare interview questions",
    "Send interview questions to applicant",
    "Request event poster from applicant",
    "Applicant provided press release",
    "Applicant provided ceremony flow",
    "Applicant provided event poster",
  ],
  13: [
    "Send event preparation note (screen flow, emcee script, marketing)",
    "Update WhatsApp group description",
    "Prepare certificate frame, floor stand, table stand, merchandise box",
    "Prepare official presentation items (frame, plaques)",
    "Arrange internal staff and presenter",
    "Confirm backdrop size (6x2 / 8x8 / 8x10 / 8x16)",
    "Collect frame and plaques from supplier",
    "Applicant: screen setup ready",
    "Applicant: emcee arranged",
  ],
  14: [
    "Screen ready confirmed",
    "Emcee ready confirmed",
    "Frame and plaques placement correct",
    "Media attendance confirmed",
  ],
  15: [
    "Chief Adjudicator officiated",
    "Record presented officially",
    "Certificate Frame presented",
    "Wall Plaque presented",
    "Record Holder Plaque presented",
    "Media interviews arranged",
    "Video (reels) and photos taken",
    "Photo link shared to media and group",
    "Group description updated with title, materials, digital cert",
    "(If attempt) Provisional cert presented",
    "(If attempt) Frame retrieved for finalisation",
  ],
  16: [
    "Track media coverage",
    "Collect news links",
    "Send for record holder approval",
    "Publish after approval",
    "Share final links",
  ],
  17: [
    "Full payment received",
    "Case closed",
  ],
  18: [
    "Maintain relationship",
    "Send Gather of Achievers invitation",
    "Share RSVP link",
  ],
};

const STEP_NEXT = {
  0:"Schedule a consultation meeting",
  1:"Set up and confirm an initial consultation meeting",
  2:"Complete consultation and confirm record direction",
  3:"Submit application form and set up WhatsApp group",
  4:"Submit corporate profile, product info, and presentation deck",
  5:"Review and confirm the proposed record titles",
  6:"Upload verification documents to Google Drive and share link",
  7:"Complete any missing documents for review",
  8:"Complete payment",
  9:"Confirm presentation event date, plan, and submit event form",
  10:"Provide logo in AI format (black version preferred)",
  11:"Review and approve certificate content and mock-up",
  12:"Provide press release, ceremony flow, event poster, and event details",
  13:"Complete event preparation: screen, emcee, backdrop, items",
  14:"Confirm all pre-event items: screen, emcee, frame, media",
  15:"Attend and complete the record presentation ceremony",
  16:"Approve media coverage links for publishing",
  17:"Ensure full payment and close the case",
  18:"Maintain relationship and RSVP for Gather of Achievers",
};


const STEP_SUBSTATUS = {
  0: [
    { value: "to_contact",    label: "📲 Yet to contact" },
    { value: "msg_sent",      label: "📤 Message sent, awaiting reply" },
    { value: "chatting",      label: "💬 In conversation" },
    { value: "appt_set",      label: "📅 Appointment set" },
    { value: "appt_done",     label: "✅ Appointment done" },
  ],
  1: [
    { value: "to_engage",     label: "📲 Yet to engage" },
    { value: "introduced",    label: "📤 Record opportunity introduced" },
    { value: "info_shared",   label: "📋 Info shared" },
    { value: "meeting_arranging", label: "🗓️ Arranging meeting" },
    { value: "meeting_confirmed", label: "✅ Meeting confirmed" },
  ],
  2: [
    { value: "meeting_pending",  label: "⏳ Meeting not yet done" },
    { value: "meeting_done",     label: "✅ Meeting done" },
    { value: "direction_set",    label: "🎯 Record direction confirmed" },
    { value: "direct_record",    label: "📌 Direct Record Recognition" },
    { value: "attempt_record",   label: "🏁 Official Record Attempt" },
  ],
  3: [
    { value: "form_not_sent",    label: "📋 Application form not sent yet" },
    { value: "form_sent",        label: "📤 Form sent, awaiting submission" },
    { value: "form_received",    label: "✅ Form received" },
    { value: "ack_sent",         label: "📨 Acknowledgement issued" },
    { value: "wa_group_created", label: "💬 WhatsApp group created" },
  ],
  4: [
    { value: "pending_request",  label: "⏳ Materials not yet requested" },
    { value: "requested",        label: "📤 Materials requested" },
    { value: "partial",          label: "📂 Partial materials received" },
    { value: "all_received",     label: "✅ All materials received" },
  ],
  5: [
    { value: "drafting",         label: "📝 Drafting proposed titles" },
    { value: "sent",             label: "📤 Titles sent to client" },
    { value: "waiting",          label: "⏳ Waiting for client feedback" },
    { value: "followup",         label: "🔔 Need to follow up client" },
    { value: "refining",         label: "🔄 Refining based on feedback" },
    { value: "endorsed",         label: "🏅 Chief Adjudicator endorsed" },
    { value: "confirmed",        label: "🎉 Client confirmed final title" },
  ],
  6: [
    { value: "checklist_prep",   label: "📝 Preparing checklist" },
    { value: "checklist_sent",   label: "📤 Checklist sent to client" },
    { value: "waiting_docs",     label: "⏳ Waiting for documents" },
    { value: "followup_docs",    label: "🔔 Following up documents" },
    { value: "partial_docs",     label: "📂 Partial docs received" },
    { value: "all_docs_received",label: "✅ All documents received" },
  ],
  7: [
    { value: "reviewing",        label: "🔍 Reviewing documents" },
    { value: "missing_items",    label: "⚠️ Missing items – following up" },
    { value: "panel_review",     label: "📋 Adjudication panel reviewing" },
    { value: "approved",         label: "✅ Chief Adjudicator approved" },
    { value: "record_confirmed", label: "🏆 Record recognition confirmed" },
  ],
  8: [
    { value: "invoice_pending",  label: "📄 Invoice not yet issued" },
    { value: "invoice_sent",     label: "📤 Invoice sent" },
    { value: "payment_partial",  label: "💰 Partial payment received" },
    { value: "payment_done",     label: "✅ Full payment received" },
  ],
  9: [
    { value: "date_pending",     label: "📅 Event date not confirmed" },
    { value: "date_confirmed",   label: "✅ Event date confirmed" },
    { value: "form_pending",     label: "📋 Event form not submitted" },
    { value: "form_received",    label: "📨 Event form received" },
    { value: "conf_letter_sent", label: "📤 Confirmation letter issued" },
  ],
  10: [
    { value: "logo_pending",     label: "⏳ Logo not yet requested" },
    { value: "logo_requested",   label: "📤 Logo requested" },
    { value: "logo_received",    label: "✅ Logo received (AI format)" },
  ],
  11: [
    { value: "cert_drafting",    label: "📝 Drafting certificate content" },
    { value: "cert_sent",        label: "📤 Content sent for approval" },
    { value: "cert_approved",    label: "✅ Content approved by client" },
    { value: "submitted_supplier", label: "🏭 Submitted to supplier" },
    { value: "mock_received",    label: "📬 Mock-up received" },
    { value: "mock_sent",        label: "📤 Mock-up sent for approval" },
    { value: "mock_approved",    label: "✅ Mock-up approved" },
    { value: "in_production",    label: "⚙️ In production" },
    { value: "cert_ready",       label: "🎉 Certificate ready" },
  ],
  12: [
    { value: "media_confirming", label: "📰 Confirming media option" },
    { value: "pr_requested",     label: "📤 Press release requested" },
    { value: "pr_received",      label: "✅ Press release received" },
    { value: "flow_requested",   label: "📤 Ceremony flow requested" },
    { value: "flow_received",    label: "✅ Ceremony flow received" },
    { value: "poster_requested", label: "📤 Event poster requested" },
    { value: "poster_received",  label: "✅ Event poster received" },
    { value: "iq_sent",          label: "📤 Interview questions sent" },
    { value: "media_booked",     label: "📸 Media arranged & confirmed" },
    { value: "details_shared",   label: "✅ All details shared with media" },
  ],
  13: [
    { value: "prep_note_sent",   label: "📤 Event prep note sent" },
    { value: "wa_desc_updated",  label: "💬 WhatsApp group description updated" },
    { value: "items_preparing",  label: "📦 Preparing frame, plaques, merchandise" },
    { value: "backdrop_confirmed", label: "🖼️ Backdrop size confirmed" },
    { value: "items_collected",  label: "✅ Frame & plaques collected from supplier" },
    { value: "all_prep_done",    label: "🎉 All event prep completed" },
  ],
  14: [
    { value: "screen_pending",   label: "🖥️ Screen not yet confirmed" },
    { value: "screen_ready",     label: "✅ Screen confirmed ready" },
    { value: "emcee_pending",    label: "🎤 Emcee not yet confirmed" },
    { value: "emcee_ready",      label: "✅ Emcee confirmed ready" },
    { value: "placement_ok",     label: "✅ Frame & plaques placement confirmed" },
    { value: "media_confirmed",  label: "✅ Media attendance confirmed" },
    { value: "all_checks_done",  label: "🟢 All pre-event checks done" },
  ],
  15: [
    { value: "event_pending",    label: "📅 Event not yet happened" },
    { value: "event_done",       label: "✅ Event completed" },
    { value: "cert_presented",   label: "🏆 Certificate presented" },
    { value: "media_done",       label: "📸 Media interviews done" },
    { value: "photos_shared",    label: "📤 Photos shared to group & media" },
    { value: "group_updated",    label: "💬 Group description updated" },
  ],
  16: [
    { value: "tracking",         label: "🔍 Tracking media coverage" },
    { value: "links_collected",  label: "📰 News links collected" },
    { value: "sent_for_approval",label: "📤 Sent for record holder approval" },
    { value: "approved",         label: "✅ Approved by record holder" },
    { value: "published",        label: "🌐 Published & links shared" },
  ],
  17: [
    { value: "payment_pending",  label: "💰 Awaiting final payment" },
    { value: "payment_received", label: "✅ Full payment received" },
    { value: "case_closed",      label: "🔒 Case closed" },
  ],
  18: [
    { value: "active",           label: "🤝 Maintaining relationship" },
    { value: "invite_sent",      label: "📤 Gather of Achievers invite sent" },
    { value: "rsvp_received",    label: "✅ RSVP received" },
  ],
};

const INITIAL_CANDIDATES = [
  { id: 1, name: "Jesslyn", org: "Apple Travel", step: 1, status: "Follow up to confirm meeting", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 2, name: "Janahan", org: "ASEAN Records (individual)", step: 6, status: "Pending doc submission – share Google Drive link", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 3, name: "", org: "Ringgit Plus & Alliance Bank", step: 4, status: "Missing corporate profile or titles confirmation", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 4, name: "Annie Wong", org: "JCI Penang", step: 3, status: "Remind to complete application form", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 5, name: "Mita Lim", org: "ICE Holidays Group", step: 5, status: "Confirm/refine proposed titles with client", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 6, name: "Jia Wei", org: "H&H", step: 12, status: "Waiting for press release, ceremony flow, event poster; confirm media plans; PIC: Jia Wei for event prep", priority: "medium", notes: "Multiple tasks ongoing:\n- Step 12: Waiting for press release, ceremony flow, event poster from client\n- Step 12: Confirm media plans and send event details to media\n- Step 13: Check event prep status with Jia Wei (screen, emcee, backdrop)\n- Step 13: Confirm event flow, venue, time", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 9, name: "Jia Wei", org: "Melix Lab (Asia Records)", step: 13, status: "Follow up mock approval & event prep", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },

  { id: 11, name: "", org: "Cooker Land", step: 6, status: "Send checklist, follow up doc submission", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 12, name: "", org: "Dare to Dream", step: 1, status: "Draft and send appropriate response", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 13, name: "Jia Wei & Eldrick", org: "", step: 17, status: "Remind to prepare documents", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 14, name: "", org: "Transtar – Intact Water", step: 11, status: "Mock approved – monitor production", priority: "low", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 15, name: "", org: "Transtar – India Gate", step: 11, status: "Mock NOT approved – follow up urgently", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 16, name: "", org: "UKM Esport", step: 6, status: "Confirm doc submission and presentation date", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 17, name: "", org: "Laundry Bar", step: 5, status: "Do Laundry Bar titles", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 18, name: "Caren / Erika", org: "Mykori", step: 1, status: "Text to initiate meeting arrangements", priority: "high", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 19, name: "Asher", org: "", step: 0, status: "Follow up message pending", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 20, name: "", org: "HE Clinic", step: 5, status: "Follow up on title review with HOD", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 21, name: "", org: "AR MY: TOYM", step: 5, status: "Waiting for their reply", priority: "low", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 22, name: "Aliyah", org: "", step: 11, status: "Cert draft sent – request review & comments", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
  { id: 23, name: "", org: "Unspecified Team", step: 11, status: "Cert draft sent – request review & comments", priority: "medium", notes: "", checklist: {}, lastUpdated: new Date().toISOString() },
];

const P = {
  high:   { emoji: "🔴", label: "Urgent",     bg: "#2a1515", border: "#6b2020", text: "#ff6b6b" },
  medium: { emoji: "🟡", label: "In Progress", bg: "#221e0e", border: "#6b5a10", text: "#ffd166" },
  low:    { emoji: "🟢", label: "Monitoring",  bg: "#0e2218", border: "#1a5c38", text: "#6bffb8" },
  done:   { emoji: "✅", label: "Done",        bg: "#161616", border: "#333",    text: "#888" },
};

export default function App() {
  const [view, setView] = useState("list");
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editStep, setEditStep] = useState(0);
  const [editNote, setEditNote] = useState("");
  const [editName, setEditName] = useState("");
  const [editTitleSub, setEditTitleSub] = useState("");
  const [editApptDate, setEditApptDate] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [editTitleStatus, setEditTitleStatus] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftLang, setDraftLang] = useState("en");
  const [copied, setCopied] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newStep, setNewStep] = useState(1);
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newNotes, setNewNotes] = useState("");
  const [newTitleSub, setNewTitleSub] = useState("");
  const [merging, setMerging] = useState(false);
  const [mergeTargetId, setMergeTargetId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("asean_tracker_permanent");
        if (r?.value) setCandidates(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const persist = async (data) => {
    setCandidates(data);
    try { await window.storage.set("asean_tracker_permanent", JSON.stringify(data)); } catch {}
  };

  const saveNewCandidate = () => {
    if (!newName.trim() && !newOrg.trim()) return;
    const stepNum = Number(newStep);
    const nc = {
      id: Date.now(),
      name: newName.trim(),
      org: newOrg.trim(),
      step: stepNum,
      stepName: STEP_NAMES[stepNum] || "",
      status: newStatus.trim() || STEP_NEXT[stepNum] || "Follow up",
      priority: newPriority,
      notes: newNotes.trim(),
      checklist: {},
      titleSubStatus: newTitleSub,
      apptDate: "",
      lastUpdated: new Date().toISOString()
    };
    const updated = [...candidates, nc];
    persist(updated);
    setAddingNew(false);
    setNewName(""); setNewOrg(""); setNewStep(1);
    setNewStatus(""); setNewPriority("medium"); setNewNotes(""); setNewTitleSub("");
  };

  const deleteCandidate = (id) => {
    const u = candidates.filter(c => c.id !== id);
    persist(u);
    setView("list");
    setSelected(null);
  };

  const mergeInto = (keepId, deleteId) => {
    const keep = candidates.find(c => c.id === keepId);
    const del = candidates.find(c => c.id === deleteId);
    if (!keep || !del) return;
    const mergedNotes = [keep.notes, del.notes ? ("From #" + del.id + " " + (del.org||del.name||"") + ": " + del.notes) : ""].filter(Boolean).join("\n");
    const mergedStatus = keep.status + (del.status && del.status !== keep.status ? " | " + del.status : "");
    const updated = candidates
      .filter(c => c.id !== deleteId)
      .map(c => c.id === keepId ? { ...c, notes: mergedNotes, status: mergedStatus, lastUpdated: new Date().toISOString() } : c);
    persist(updated);
    setSelected(updated.find(c => c.id === keepId));
    setMerging(false);
    setMergeTargetId(null);
  };

  const changePriority = (id, p) => {
    const u = candidates.map(c => c.id === id ? { ...c, priority: p, lastUpdated: new Date().toISOString() } : c);
    persist(u); setSelected(u.find(c => c.id === id));
  };

  const toggleCheckItem = (id, step, itemIdx) => {
    const u = candidates.map(c => {
      if (c.id !== id) return c;
      const key = `${step}_${itemIdx}`;
      const newChecklist = { ...c.checklist, [key]: !c.checklist[key] };
      return { ...c, checklist: newChecklist, lastUpdated: new Date().toISOString() };
    });
    persist(u); setSelected(u.find(c => c.id === id));
  };

  const openEdit = (c) => {
    setEditStatus(c.status); setEditStep(c.step); setEditNote(c.notes || "");
    setEditName(c.name || ""); setEditOrg(c.org || "");
    setEditApptDate(c.apptDate || ""); setEditTitleStatus(c.titleStatus || "");
    setEditing(true); setDraft("");
  };

  const saveEdits = (id) => {
    const n = Number(editStep);
    const u = candidates.map(c => c.id === id ? {
      ...c, name: editName, org: editOrg, status: editStatus, step: n,
      stepName: STEP_NAMES[n] || c.stepName,
      notes: editNote, apptDate: editApptDate, titleStatus: editTitleStatus,
      lastUpdated: new Date().toISOString()
    } : c);
    persist(u); setSelected(u.find(c => c.id === id)); setEditing(false);
  };

  const generateDraft = async (c, lang) => {
    setDraftLoading(true); setDraft(""); setCopied(false);
    const contactName = c.name || (c.org ? `the team at ${c.org}` : "there");
    const checklist = STEP_CHECKLIST[c.step] || [];
    const pending = checklist.filter((_, i) => !c.checklist[`${c.step}_${i}`]);
    const langInstruction = lang === "zh"
      ? "Write in conversational Mandarin Chinese (简体中文), friendly WhatsApp tone."
      : lang === "my"
      ? "Write in Bahasa Malaysia, friendly WhatsApp tone."
      : "Write in English, friendly WhatsApp tone.";
    const prompt = `You are Gillian, Managing Director of ASEAN Records / Asia Records.

Write a short WhatsApp follow-up message to ${contactName}${c.org ? ` from ${c.org}` : ""}.

Current step: Step ${c.step} – ${STEP_NAMES[c.step] || ""}
Current status: ${c.status}
Outstanding items for this step: ${pending.length > 0 ? pending.join(", ") : "follow up on progress"}
Notes: ${c.notes || "none"}

${langInstruction}

Rules:
- Warm and friendly, not pushy
- 3–5 lines max
- Clearly state what you need or what's next
- End with an open invitation to reply
- Do NOT start with "Dear" — use first name or Hi
- Output ONLY the message, nothing else`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 400, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setDraft(data.content?.find(b => b.type === "text")?.text?.trim() || "");
    } catch { setDraft("Error – try again."); }
    setDraftLoading(false);
  };

  const copyDraft = () => {
    if (!draft) return;
    try {
      navigator.clipboard.writeText(draft).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    } catch {
      const el = document.createElement("textarea"); el.value = draft;
      document.body.appendChild(el); el.select(); document.execCommand("copy");
      document.body.removeChild(el); setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendAiUpdate = async () => {
    if (!inputText.trim()) return;
    setAiLoading(true); setAiMsg("");
    const list = candidates.map(c => `ID${c.id}: ${c.name||""} | ${c.org||""} | Step${c.step} ${STEP_NAMES[c.step]||""} | ${c.status} | ${c.priority}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `Tracker for ASEAN Records / Asia Records.\n\nCandidates:\n${list}\n\nUpdate: "${inputText}"\n\nReturn ONLY JSON:\n{"updates":[{"id":<n>,"status":"...","step":<n>,"priority":"high|medium|low|done"}],"summary":"...","new_candidate":null}` }] })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      let parsed; try { parsed = JSON.parse(text); } catch { const m = text.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); }
      if (parsed) {
        let u = [...candidates];
        parsed.updates?.forEach(upd => { u = u.map(c => c.id === upd.id ? { ...c, status: upd.status ?? c.status, step: upd.step ?? c.step, priority: upd.priority ?? c.priority, lastUpdated: new Date().toISOString() } : c); });
        if (parsed.new_candidate) u = [...u, { id: u.length + 1, notes: "", checklist: {}, lastUpdated: new Date().toISOString(), ...parsed.new_candidate }];
        persist(u); setAiMsg(parsed.summary || "Updated!"); setInputText("");
      }
    } catch { setAiMsg("Error – try again."); }
    setAiLoading(false);
  };

  const filtered = candidates.filter(c => (filter === "all" || c.priority === filter) && (!search || `${c.name} ${c.org} ${c.status}`.toLowerCase().includes(search.toLowerCase())));
  const counts = { high: 0, medium: 0, low: 0, done: 0 };
  candidates.forEach(c => { if (counts[c.priority] !== undefined) counts[c.priority]++; });

  const BASE = { background: "#0c0e13", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e0e2ea", maxWidth: 480, margin: "0 auto" };
  const HDR = (x) => ({ background: "#111420", borderBottom: "1px solid #1e2235", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, ...x });
  const BOX = (x) => ({ background: "#111420", border: "1px solid #1e2235", borderRadius: 10, padding: "12px 14px", marginBottom: 10, ...x });
  const LBL = { fontSize: 10, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 };
  const INP = { width: "100%", background: "#161922", border: "1px solid #252a3a", borderRadius: 8, color: "#e0e2ea", fontSize: 14, padding: "11px 13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const BTN = (bg, col, x) => ({ width: "100%", padding: 13, borderRadius: 10, border: "none", background: bg || "#2a5298", color: col || "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, ...x });
  const BACK = { background: "none", border: "none", color: "#7eb3ff", fontSize: 22, cursor: "pointer", padding: 0 };

  // ── DETAIL VIEW ──────────────────────────────────────────
  if (view === "detail" && selected) {
    const c = candidates.find(x => x.id === selected.id) || selected;
    const pc = P[c.priority] || P.medium;
    const checklist = STEP_CHECKLIST[c.step] || [];
    const doneCount = checklist.filter((_, i) => c.checklist[`${c.step}_${i}`]).length;

    return (
      <div style={BASE}>
        <div style={HDR({ justifyContent: "space-between" })}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => { setView("list"); setEditing(false); setDraft(""); }} style={BACK}>←</button>
            <span style={{ fontWeight: 700, fontSize: 15, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>#{c.id} {c.name || c.org}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => editing ? setEditing(false) : openEdit(c)}
              style={{ background: editing ? "#2a1515" : "#1e3a6e", border: "none", borderRadius: 8, color: editing ? "#ff6b6b" : "#7eb3ff", fontWeight: 700, fontSize: 13, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}>
              {editing ? "✕" : "✏️"}
            </button>
            <button
              onClick={() => { if (window.confirm("Delete " + (c.name || c.org || "this candidate") + "? Cannot be undone.")) { deleteCandidate(c.id); } }}
              style={{ background: "#2a1515", border: "1px solid #6b2020", borderRadius: 8, color: "#ff6b6b", fontWeight: 700, fontSize: 13, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}>
              🗑️
            </button>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          {/* Header */}
          <div style={{ background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{c.name || c.org || `Candidate #${c.id}`}</div>
            {c.name && c.org && <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{c.org}</div>}
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>{pc.emoji} {pc.label}</span>
          </div>

          {editing ? (
            <>
              <div style={BOX()}>
                <div style={LBL}>Contact Name</div>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  style={INP} placeholder="e.g. Jia Wei" />
              </div>
              <div style={BOX()}>
                <div style={LBL}>Organisation</div>
                <input value={editOrg} onChange={e => setEditOrg(e.target.value)}
                  style={INP} placeholder="e.g. H&H" />
              </div>
              {Number(editStep) === 0 && (
                <div style={BOX()}>
                  <div style={LBL}>📅 Appointment Date</div>
                  <input type="date" value={editApptDate} onChange={e => setEditApptDate(e.target.value)}
                    style={{ ...INP, colorScheme: "dark" }} />
                </div>
              )}
              {Number(editStep) === 5 && (
                <div style={BOX()}>
                  <div style={LBL}>Title Development Status</div>
                  <select value={editTitleStatus} onChange={e => setEditTitleStatus(e.target.value)}
                    style={{ ...INP, cursor: "pointer" }}>
                    <option value="">-- Select status --</option>
                    <option value="proposed">📋 Proposed titles sent</option>
                    <option value="waiting">⏳ Waiting for client feedback</option>
                    <option value="followup">🔔 Need to follow up</option>
                    <option value="confirmed">✅ Titles confirmed</option>
                  </select>
                </div>
              )}
              {(Number(editStep) === 0 || Number(editStep) === 1) && (
                <div style={BOX()}>
                  <div style={LBL}>📅 Appointment / Meeting Date</div>
                  <input type="date" value={editApptDate} onChange={e => setEditApptDate(e.target.value)}
                    style={{ ...INP, colorScheme: "dark" }} />
                  {editApptDate && <div style={{ fontSize: 12, color: "#7eb3ff", marginTop: 6 }}>
                    {new Date(editApptDate).toLocaleDateString("en-MY", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>}
                </div>
              )}
              {STEP_SUBSTATUS[Number(editStep)] && (
                <div style={BOX()}>
                  <div style={LBL}>📊 Step Status</div>
                  <select value={editTitleSub} onChange={e => setEditTitleSub(e.target.value)}
                    style={{ ...INP, cursor: "pointer" }}>
                    <option value="">— Select current status —</option>
                    {STEP_SUBSTATUS[Number(editStep)].map(opt => (
                      <option key={opt.value} value={opt.value} style={{ background: "#161922", color: "#e0e2ea" }}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div style={BOX()}>
                <div style={LBL}>Status / Next Action</div>
                <textarea value={editStatus} onChange={e => setEditStatus(e.target.value)} rows={3}
                  style={{ ...INP, resize: "none" }} placeholder="What needs to happen next?" />
              </div>
              <div style={BOX()}>
                <div style={LBL}>Current Step</div>
                <select value={editStep} onChange={e => setEditStep(Number(e.target.value))}
                  style={{ ...INP, marginBottom: 10, cursor: "pointer" }}>
                  {Object.entries(STEP_NAMES).map(([n, name]) => (
                    <option key={n} value={n} style={{ background: "#161922", color: "#e0e2ea" }}>Step {n} – {name}</option>
                  ))}
                </select>
                <div style={{ background: "#1e2235", borderRadius: 3, height: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((Number(editStep) / 18) * 100)}%`, height: "100%", background: "linear-gradient(90deg,#2a5298,#7eb3ff)", borderRadius: 3 }} />
                </div>
              </div>
              <div style={BOX()}>
                <div style={LBL}>📝 Notes (private)</div>
                <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={4}
                  style={{ ...INP, resize: "none" }} placeholder="Context, reminders, details..." />
              </div>
              <button style={BTN("#2a5298")} onClick={() => saveEdits(c.id)}>💾 Save Changes</button>
            </>
          ) : (
            <>
              <div style={BOX()}>
                <div style={LBL}>Status / Next Action</div>
                <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>{c.status}</div>
              </div>
              {c.apptDate && (
                <div style={BOX({ background: "#0e1a2e", borderColor: "#1e3a6e" })}>
                  <div style={{ ...LBL, color: "#4a6fa5" }}>📅 Appointment Date</div>
                  <div style={{ fontSize: 15, color: "#7eb3ff", fontWeight: 600 }}>
                    {new Date(c.apptDate).toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              )}
              {c.step === 5 && c.titleStatus && (
                <div style={BOX({ background: "#1a1500", borderColor: "#4a3a00" })}>
                  <div style={{ ...LBL, color: "#ffd166" }}>📝 Title Dev Status</div>
                  <div style={{ fontSize: 14, color: "#ffd166", fontWeight: 600 }}>
                    {{ proposed: "📋 Proposed titles sent", waiting: "⏳ Waiting for client feedback", followup: "🔔 Need to follow up", confirmed: "✅ Titles confirmed" }[c.titleStatus] || c.titleStatus}
                  </div>
                </div>
              )}

              {/* Step + Checklist */}
              <div style={BOX()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={LBL}>Step {c.step} · {STEP_NAMES[c.step]}</div>
                  {checklist.length > 0 && (
                    <span style={{ fontSize: 11, color: doneCount === checklist.length ? "#6bffb8" : "#ffd166", fontWeight: 700 }}>
                      {doneCount}/{checklist.length}
                    </span>
                  )}
                </div>
                <div style={{ background: "#1e2235", borderRadius: 3, height: 4, overflow: "hidden", marginBottom: checklist.length > 0 ? 12 : 0 }}>
                  <div style={{ width: `${Math.round((c.step / 18) * 100)}%`, height: "100%", background: "linear-gradient(90deg,#2a5298,#7eb3ff)", borderRadius: 3 }} />
                </div>
                {checklist.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {checklist.map((item, i) => {
                      const checked = !!c.checklist[`${c.step}_${i}`];
                      return (
                        <div key={i} onClick={() => toggleCheckItem(c.id, c.step, i)}
                          style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "6px 8px", borderRadius: 8, background: checked ? "rgba(107,255,184,0.05)" : "transparent" }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? "#6bffb8" : "#333"}`,
                            background: checked ? "#6bffb8" : "transparent", flexShrink: 0, marginTop: 1,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            {checked && <span style={{ fontSize: 11, color: "#0c0e13", fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 13, color: checked ? "#555" : "#bbb", textDecoration: checked ? "line-through" : "none", lineHeight: 1.4 }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notes */}
              {c.notes
                ? <div style={BOX({ background: "#0e1a2e", borderColor: "#1e3a6e" })}>
                    <div style={{ ...LBL, color: "#4a6fa5" }}>📝 Notes</div>
                    <div style={{ fontSize: 14, color: "#9bb8e8", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.notes}</div>
                  </div>
                : <div style={{ ...BOX(), borderStyle: "dashed", cursor: "pointer", textAlign: "center" }} onClick={() => openEdit(c)}>
                    <span style={{ fontSize: 13, color: "#333" }}>+ Tap to add notes</span>
                  </div>
              }

              {/* WhatsApp Draft */}
              <div style={BOX({ background: "#0b1a12", borderColor: "#1a4a2a" })}>
                <div style={{ ...LBL, color: "#25d366" }}>💬 Draft WhatsApp Message</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[["en","English"],["zh","中文"],["my","BM"]].map(([k,l]) => (
                    <button key={k} onClick={() => setDraftLang(k)} style={{
                      padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 12, fontWeight: 700, border: "1px solid",
                      background: draftLang === k ? "#1a4a2a" : "#0c0e13",
                      color: draftLang === k ? "#25d366" : "#444",
                      borderColor: draftLang === k ? "#25d366" : "#1e2235"
                    }}>{l}</button>
                  ))}
                </div>
                <button onClick={() => generateDraft(c, draftLang)} disabled={draftLoading}
                  style={BTN("#1a4a2a", "#25d366", { border: "1px solid #25d366", marginBottom: draft ? 10 : 0, opacity: draftLoading ? 0.6 : 1 })}>
                  {draftLoading ? "⏳ Generating..." : "✨ Generate Draft"}
                </button>
                {draft && (
                  <>
                    <div style={{ background: "#0c1a10", border: "1px solid #1a4a2a", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ fontSize: 14, color: "#c8f0d0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{draft}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={copyDraft} style={{ flex: 1, padding: 11, borderRadius: 9, border: "1px solid #25d366", background: copied ? "#1a4a2a" : "transparent", color: "#25d366", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        {copied ? "✓ Copied!" : "📋 Copy"}
                      </button>
                      <button onClick={() => generateDraft(c, draftLang)} style={{ flex: 1, padding: 11, borderRadius: 9, border: "1px solid #1e2235", background: "transparent", color: "#666", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        🔄 Retry
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div style={BOX()}>
                <div style={LBL}>Last Updated</div>
                <div style={{ fontSize: 13, color: "#555" }}>{new Date(c.lastUpdated).toLocaleString("en-MY")}</div>
              </div>
            </>
          )}

          {/* Priority */}
          {!editing && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ ...LBL, marginBottom: 8 }}>Change Priority</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(P).map(([key, val]) => (
                  <button key={key} onClick={() => changePriority(c.id, key)} style={{
                    padding: "10px 8px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                    border: `1px solid ${c.priority === key ? val.border : "#252a3a"}`,
                    background: c.priority === key ? val.bg : "#161922",
                    color: c.priority === key ? val.text : "#555",
                    fontSize: 12, fontWeight: 700
                  }}>{val.emoji} {val.label}</button>
                ))}
              </div>
            </div>
          )}
          {!editing && (
            <div style={{ marginBottom: 10 }}>
              {!merging ? (
                <button onClick={() => setMerging(true)}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1px solid #2a3a5a", background: "transparent", color: "#4a6fa5", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
                  🔀 Merge with another candidate
                </button>
              ) : (
                <div style={{ background: "#0e1a2e", border: "1px solid #1e3a6e", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ ...LBL, color: "#4a6fa5", marginBottom: 10 }}>Select candidate to merge INTO this one (the other will be deleted):</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                    {candidates.filter(x => x.id !== c.id).map(x => (
                      <div key={x.id} onClick={() => setMergeTargetId(mergeTargetId === x.id ? null : x.id)}
                        style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", border: "1px solid",
                          borderColor: mergeTargetId === x.id ? "#4a6fa5" : "#1e2235",
                          background: mergeTargetId === x.id ? "#1e3a6e" : "#111420" }}>
                        <span style={{ fontSize: 12, color: mergeTargetId === x.id ? "#7eb3ff" : "#888" }}>
                          #{x.id} {x.name ? x.name + " · " : ""}{x.org || ""}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => { setMerging(false); setMergeTargetId(null); }}
                      style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #1e2235", background: "transparent", color: "#555", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                      Cancel
                    </button>
                    <button disabled={!mergeTargetId}
                      onClick={() => { if (window.confirm("Merge #" + mergeTargetId + " into this record? #" + mergeTargetId + " will be deleted.")) mergeInto(c.id, mergeTargetId); }}
                      style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: mergeTargetId ? "#2a5298" : "#1a2030", color: mergeTargetId ? "#fff" : "#333", fontWeight: 700, fontSize: 13, cursor: mergeTargetId ? "pointer" : "default", fontFamily: "inherit" }}>
                      Merge ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button style={BTN("#1e2235", "#888")} onClick={() => { setView("list"); setEditing(false); setDraft(""); setMerging(false); }}>← Back</button>
        </div>
      </div>
    );
  }

  // ── ADD NEW CANDIDATE VIEW ──────────────────────────────
  if (view === "addnew") {
    return (
      <div style={BASE}>
        <div style={HDR()}>
          <button onClick={() => { setView("list"); setAddingNew(false); }} style={BACK}>←</button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>➕ Add New Candidate</span>
        </div>
        <div style={{ padding: 16, paddingBottom: 80 }}>
          <div style={BOX()}>
            <div style={LBL}>Contact Name</div>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              style={INP} placeholder="e.g. Sarah Tan" />
          </div>
          <div style={BOX()}>
            <div style={LBL}>Organisation</div>
            <input value={newOrg} onChange={e => setNewOrg(e.target.value)}
              style={INP} placeholder="e.g. CEO Kids International" />
          </div>
          <div style={BOX()}>
            <div style={LBL}>Starting Step</div>
            <select value={newStep} onChange={e => setNewStep(Number(e.target.value))}
              style={{ ...INP, cursor: "pointer" }}>
              {Object.entries(STEP_NAMES).map(([n, name]) => (
                <option key={n} value={n} style={{ background: "#161922", color: "#e0e2ea" }}>Step {n} – {name}</option>
              ))}
            </select>
          </div>
          {STEP_SUBSTATUS[Number(newStep)] && (
            <div style={BOX()}>
              <div style={LBL}>📊 Step Status</div>
              <select value={newTitleSub} onChange={e => setNewTitleSub(e.target.value)}
                style={{ ...INP, cursor: "pointer" }}>
                <option value="">— Select current status —</option>
                {STEP_SUBSTATUS[Number(newStep)].map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: "#161922", color: "#e0e2ea" }}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          <div style={BOX()}>
            <div style={LBL}>Priority</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(P).map(([key, val]) => (
                <button key={key} onClick={() => setNewPriority(key)} style={{
                  padding: "10px 8px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                  border: `1px solid ${newPriority === key ? val.border : "#252a3a"}`,
                  background: newPriority === key ? val.bg : "#161922",
                  color: newPriority === key ? val.text : "#555",
                  fontSize: 12, fontWeight: 700
                }}>{val.emoji} {val.label}</button>
              ))}
            </div>
          </div>
          <div style={BOX()}>
            <div style={LBL}>Status / Next Action <span style={{ color: "#444", textTransform: "none", fontSize: 10 }}>(optional)</span></div>
            <textarea value={newStatus} onChange={e => setNewStatus(e.target.value)} rows={2}
              style={{ ...INP, resize: "none" }} placeholder="Leave blank to auto-fill based on step" />
          </div>
          <div style={BOX()}>
            <div style={LBL}>Notes <span style={{ color: "#444", textTransform: "none", fontSize: 10 }}>(optional)</span></div>
            <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} rows={3}
              style={{ ...INP, resize: "none" }} placeholder="Any context or background..." />
          </div>
          <button style={BTN("#2a5298")} onClick={saveNewCandidate}
            disabled={!newName.trim() && !newOrg.trim()}>
            ➕ Add Candidate
          </button>
          <button style={BTN("#1e2235", "#888")} onClick={() => setView("list")}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── AI UPDATE VIEW ───────────────────────────────────────
  if (view === "update") {
    return (
      <div style={BASE}>
        <div style={HDR()}>
          <button onClick={() => setView("list")} style={BACK}>←</button>
          <span style={{ fontWeight: 700, fontSize: 16 }}>AI Update</span>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 14, lineHeight: 1.6 }}>Paste any碎片 — WhatsApp snippet, voice note, quick update. AI finds the right candidate and updates automatically.</div>
          <textarea style={{ ...INP, resize: "none", marginBottom: 12 }} rows={6}
            placeholder={"Examples:\n• Janahan sent all docs\n• H&H approved certificate mock\n• New client Sarah from XYZ, first meeting done\n• Transtar India Gate approved mock"}
            value={inputText} onChange={e => setInputText(e.target.value)} />
          <button style={BTN(aiLoading || !inputText.trim() ? "#1a2030" : "#2a5298")} onClick={sendAiUpdate} disabled={aiLoading || !inputText.trim()}>
            {aiLoading ? "⏳ Processing..." : "Update Tracker →"}
          </button>
          {aiMsg && (
            <div style={{ background: "#0e2218", border: "1px solid #1a5c38", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "#6bffb8", fontWeight: 700, marginBottom: 4 }}>✓ UPDATED</div>
              <div style={{ fontSize: 14, color: "#ccc" }}>{aiMsg}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────
  return (
    <div style={BASE}>
      <div style={{ background: "#111420", borderBottom: "1px solid #1e2235", padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "#4a6fa5", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>ASEAN / ASIA RECORDS</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Candidate Tracker</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#7eb3ff", lineHeight: 1 }}>{candidates.length}</div>
            <div style={{ fontSize: 10, color: "#444" }}>files</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[["all",`All ${candidates.length}`],["high",`🔴 ${counts.high}`],["medium",`🟡 ${counts.medium}`],["low",`🟢 ${counts.low}`],["done",`✅ ${counts.done}`]].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit",
              background: filter === k ? "#1e3a6e" : "#161922", color: filter === k ? "#7eb3ff" : "#555",
              border: `1px solid ${filter === k ? "#2a5298" : "#252a3a"}`
            }}>{l}</button>
          ))}
        </div>
        <input placeholder="🔍 Search name, org, status..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...INP, padding: "9px 13px" }} />
      </div>

      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        <button onClick={() => { setView("addnew"); }} style={{ ...BTN("#1a4a2a", "#6bffb8"), flex: 1, marginBottom: 0, border: "1px solid #1a5c38" }}>➕ Add New</button>
        <button onClick={() => { setView("update"); setAiMsg(""); }} style={{ ...BTN("#1a2e52"), flex: 2, marginBottom: 0 }}>✏️ Paste AI Update</button>
      </div>
      <div style={{ height: 12 }} />

      <div style={{ padding: "4px 16px 80px" }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 14 }}>No candidates match.</div>}
        {filtered.map(c => {
          const pc = P[c.priority] || P.medium;
          const name = c.name && c.org ? `${c.name} · ${c.org}` : c.name || c.org || `Candidate #${c.id}`;
          const cl = STEP_CHECKLIST[c.step] || [];
          const done = cl.filter((_, i) => c.checklist[`${c.step}_${i}`]).length;
          return (
            <div key={c.id} onClick={() => { setSelected(c); setEditing(false); setDraft(""); setView("detail"); }}
              style={{ background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace", marginRight: 6 }}>#{c.id}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#dde" }}>{name}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`, whiteSpace: "nowrap" }}>{pc.emoji} {pc.label}</span>
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 5, lineHeight: 1.4 }}>{c.status}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#444" }}>Step {c.step} · {STEP_NAMES[c.step]}</div>
                {cl.length > 0 && <div style={{ fontSize: 11, color: done === cl.length ? "#6bffb8" : "#555" }}>{done}/{cl.length} ✓</div>}
              </div>
              {c.titleSubStatus && STEP_SUBSTATUS[c.step] && (() => {
                const match = STEP_SUBSTATUS[c.step].find(o => o.value === c.titleSubStatus);
                return match ? <div style={{ fontSize: 11, color: "#ffd166", marginTop: 4 }}>{match.label}</div> : null;
              })()}
              {c.notes && <div style={{ fontSize: 11, color: "#4a6fa5", marginTop: 4 }}>📝 Notes</div>}
              <div style={{ background: "#0c0e13", borderRadius: 3, height: 3, marginTop: 7, overflow: "hidden" }}>
                <div style={{ width: `${Math.round((c.step / 18) * 100)}%`, height: "100%", background: pc.text, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
