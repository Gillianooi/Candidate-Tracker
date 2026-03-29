import { useState, useEffect } from "react";

const STEP_NAMES = {
  0:"Scheduling",1:"Initial Engagement",2:"Consultation & Direction",3:"Application & Case Opening",
  4:"Initial Materials Collection",5:"Record Title Development",6:"Verification Checklist & Docs",
  7:"Document Review & Confirmation",8:"Invoice & Payment",9:"Record Presentation Planning",
  10:"Branding Materials",11:"Certificate Content & Production",12:"Media & Event Coordination",
  13:"Event Preparation",14:"Pre-Event Checks",15:"Presentation Ceremony",
  16:"Post-Event Media & Publicity",17:"Financial Closure",18:"Record Holder Engagement"
};

const STEP_CHECKLIST = {
  0:["Identify contact channel (WhatsApp / referral / event)","Send initial message","Confirm appointment date & time","Attend appointment"],
  1:["Engage via WhatsApp / other channels","Introduce record opportunity","Share record information","Arrange meeting (F2F or online)","Follow up until meeting confirmed"],
  2:["Attend meeting","Present record platforms","Understand applicant achievement & background","Benchmark against ASEAN / Asia level","Determine: Direct Record Recognition OR Official Record Attempt","Advise on suitable approach","Propose record positioning","Share benefits, packages, media options","Ask about presentation ceremony plan"],
  3:["Send application form link","Issue acknowledgement after receiving form","Create WhatsApp group","Applicant: submitted form","Applicant: added team to WhatsApp group"],
  4:["Request corporate profile","Request product information","Request presentation deck","Received all materials from applicant"],
  5:["Review materials","Develop proposed record titles","Send titles to applicant","Discuss and refine with applicant","Chief Adjudicator reviewed & endorsed","Applicant confirmed final title"],
  6:["Prepare verification checklist based on title","Send checklist to applicant","Follow up document submission","Applicant uploaded docs to Google Drive","Received Google Drive link"],
  7:["Review all submitted documents","Follow up any missing items","Compile verification summary","Chief Adjudicator approved documents","Official record recognition confirmed"],
  8:["Issue invoice","Payment received from applicant"],
  9:["Ask for preferred presentation date","Request event form (recipient, GOH, event info)","Issue confirmation letter","Applicant confirmed event date","Applicant confirmed event plan","Applicant submitted event form"],
  10:["Request logo in AI format (black version preferred)","Received logo from applicant"],
  11:["Prepare certificate content draft","Send draft for applicant approval","Submit to supplier after confirmation","Receive mock-up from supplier","Send mock-up for final approval","Applicant approved mock-up","Proceed production","(If attempt) Produce provisional certificate"],
  12:["Confirm media coverage option","Follow up press release from applicant","Follow up ceremony flow from applicant","Follow up event details from applicant","Arrange media attendance","Share event details with media","Prepare interview questions","Send interview questions to applicant","Request event poster from applicant","Applicant provided press release","Applicant provided ceremony flow","Applicant provided event poster"],
  13:["Send event preparation note (screen flow, emcee script, marketing)","Update WhatsApp group description","Prepare certificate frame, floor stand, table stand, merchandise box","Prepare official presentation items (frame, plaques)","Arrange internal staff and presenter","Confirm backdrop size (6x2 / 8x8 / 8x10 / 8x16)","Collect frame and plaques from supplier","Applicant: screen setup ready","Applicant: emcee arranged"],
  14:["Screen ready confirmed","Emcee ready confirmed","Frame and plaques placement correct","Media attendance confirmed"],
  15:["Chief Adjudicator officiated","Record presented officially","Certificate Frame presented","Wall Plaque presented","Record Holder Plaque presented","Media interviews arranged","Video (reels) and photos taken","Photo link shared to media and group","Group description updated with title, materials, digital cert"],
  16:["Track media coverage","Collect news links","Send for record holder approval","Publish after approval","Share final links"],
  17:["Full payment received","Case closed"],
  18:["Maintain relationship","Send Gather of Achievers invitation","Share RSVP link"],
};

const STEP_SUBSTATUS = {
  0:[{v:"to_contact",l:"📲 Yet to contact"},{v:"msg_sent",l:"📤 Message sent, awaiting reply"},{v:"chatting",l:"💬 In conversation"},{v:"appt_set",l:"📅 Appointment set"},{v:"appt_done",l:"✅ Appointment done"}],
  1:[{v:"to_engage",l:"📲 Yet to engage"},{v:"introduced",l:"📤 Record opportunity introduced"},{v:"info_shared",l:"📋 Info shared"},{v:"meeting_arranging",l:"🗓️ Arranging meeting"},{v:"meeting_confirmed",l:"✅ Meeting confirmed"}],
  2:[{v:"meeting_pending",l:"⏳ Meeting not yet done"},{v:"meeting_done",l:"✅ Meeting done"},{v:"direction_set",l:"🎯 Record direction confirmed"},{v:"direct_record",l:"📌 Direct Record Recognition"},{v:"attempt_record",l:"🏁 Official Record Attempt"}],
  3:[{v:"form_not_sent",l:"📋 Application form not sent yet"},{v:"form_sent",l:"📤 Form sent, awaiting submission"},{v:"form_received",l:"✅ Form received"},{v:"ack_sent",l:"📨 Acknowledgement issued"},{v:"wa_group_created",l:"💬 WhatsApp group created"}],
  4:[{v:"pending_request",l:"⏳ Materials not yet requested"},{v:"requested",l:"📤 Materials requested"},{v:"partial",l:"📂 Partial materials received"},{v:"all_received",l:"✅ All materials received"}],
  5:[{v:"drafting",l:"📝 Drafting proposed titles"},{v:"sent",l:"📤 Titles sent to client"},{v:"waiting",l:"⏳ Waiting for client feedback"},{v:"followup",l:"🔔 Need to follow up client"},{v:"refining",l:"🔄 Refining based on feedback"},{v:"endorsed",l:"🏅 Chief Adjudicator endorsed"},{v:"confirmed",l:"🎉 Client confirmed final title"}],
  6:[{v:"checklist_prep",l:"📝 Preparing checklist"},{v:"checklist_sent",l:"📤 Checklist sent to client"},{v:"waiting_docs",l:"⏳ Waiting for documents"},{v:"followup_docs",l:"🔔 Following up documents"},{v:"partial_docs",l:"📂 Partial docs received"},{v:"all_docs_received",l:"✅ All documents received"}],
  7:[{v:"reviewing",l:"🔍 Reviewing documents"},{v:"missing_items",l:"⚠️ Missing items – following up"},{v:"panel_review",l:"📋 Adjudication panel reviewing"},{v:"approved",l:"✅ Chief Adjudicator approved"},{v:"record_confirmed",l:"🏆 Record recognition confirmed"}],
  8:[{v:"invoice_pending",l:"📄 Invoice not yet issued"},{v:"invoice_sent",l:"📤 Invoice sent"},{v:"payment_partial",l:"💰 Partial payment received"},{v:"payment_done",l:"✅ Full payment received"}],
  9:[{v:"date_pending",l:"📅 Event date not confirmed"},{v:"date_confirmed",l:"✅ Event date confirmed"},{v:"form_pending",l:"📋 Event form not submitted"},{v:"form_received",l:"📨 Event form received"},{v:"conf_letter_sent",l:"📤 Confirmation letter issued"}],
  10:[{v:"logo_pending",l:"⏳ Logo not yet requested"},{v:"logo_requested",l:"📤 Logo requested"},{v:"logo_received",l:"✅ Logo received (AI format)"}],
  11:[{v:"cert_drafting",l:"📝 Drafting certificate content"},{v:"cert_sent",l:"📤 Content sent for approval"},{v:"cert_approved",l:"✅ Content approved by client"},{v:"submitted_supplier",l:"🏭 Submitted to supplier"},{v:"mock_received",l:"📬 Mock-up received"},{v:"mock_sent",l:"📤 Mock-up sent for approval"},{v:"mock_approved",l:"✅ Mock-up approved"},{v:"in_production",l:"⚙️ In production"},{v:"cert_ready",l:"🎉 Certificate ready"}],
  12:[{v:"media_confirming",l:"📰 Confirming media option"},{v:"pr_requested",l:"📤 Press release requested"},{v:"pr_received",l:"✅ Press release received"},{v:"flow_requested",l:"📤 Ceremony flow requested"},{v:"flow_received",l:"✅ Ceremony flow received"},{v:"poster_requested",l:"📤 Event poster requested"},{v:"poster_received",l:"✅ Event poster received"},{v:"iq_sent",l:"📤 Interview questions sent"},{v:"media_booked",l:"📸 Media arranged & confirmed"},{v:"details_shared",l:"✅ All details shared with media"}],
  13:[{v:"prep_note_sent",l:"📤 Event prep note sent"},{v:"wa_desc_updated",l:"💬 WhatsApp group description updated"},{v:"items_preparing",l:"📦 Preparing frame, plaques, merchandise"},{v:"backdrop_confirmed",l:"🖼️ Backdrop size confirmed"},{v:"items_collected",l:"✅ Frame & plaques collected from supplier"},{v:"all_prep_done",l:"🎉 All event prep completed"}],
  14:[{v:"screen_pending",l:"🖥️ Screen not yet confirmed"},{v:"screen_ready",l:"✅ Screen confirmed ready"},{v:"emcee_pending",l:"🎤 Emcee not yet confirmed"},{v:"emcee_ready",l:"✅ Emcee confirmed ready"},{v:"placement_ok",l:"✅ Frame & plaques placement confirmed"},{v:"media_confirmed",l:"✅ Media attendance confirmed"},{v:"all_checks_done",l:"🟢 All pre-event checks done"}],
  15:[{v:"event_pending",l:"📅 Event not yet happened"},{v:"event_done",l:"✅ Event completed"},{v:"cert_presented",l:"🏆 Certificate presented"},{v:"media_done",l:"📸 Media interviews done"},{v:"photos_shared",l:"📤 Photos shared to group & media"},{v:"group_updated",l:"💬 Group description updated"}],
  16:[{v:"tracking",l:"🔍 Tracking media coverage"},{v:"links_collected",l:"📰 News links collected"},{v:"sent_for_approval",l:"📤 Sent for record holder approval"},{v:"approved",l:"✅ Approved by record holder"},{v:"published",l:"🌐 Published & links shared"}],
  17:[{v:"payment_pending",l:"💰 Awaiting final payment"},{v:"payment_received",l:"✅ Full payment received"},{v:"case_closed",l:"🔒 Case closed"}],
  18:[{v:"active",l:"🤝 Maintaining relationship"},{v:"invite_sent",l:"📤 Gather of Achievers invite sent"},{v:"rsvp_received",l:"✅ RSVP received"}],
};

const STEP_NEXT = {
  0:"Schedule a consultation meeting",1:"Set up and confirm an initial consultation meeting",
  2:"Complete consultation and confirm record direction",3:"Submit application form and set up WhatsApp group",
  4:"Submit corporate profile, product info, and presentation deck",5:"Review and confirm the proposed record titles",
  6:"Upload verification documents to Google Drive and share link",7:"Complete any missing documents for review",
  8:"Complete payment",9:"Confirm presentation event date, plan, and submit event form",
  10:"Provide logo in AI format (black version preferred)",11:"Review and approve certificate content and mock-up",
  12:"Provide press release, ceremony flow, event poster, and event details",
  13:"Complete event preparation: screen, emcee, backdrop, items",14:"Confirm all pre-event items: screen, emcee, frame, media",
  15:"Attend and complete the record presentation ceremony",16:"Approve media coverage links for publishing",
  17:"Ensure full payment and close the case",18:"Maintain relationship and RSVP for Gather of Achievers",
};

const INITIAL_CANDIDATES = [
  {id:1,name:"Jesslyn",org:"Apple Travel",step:1,status:"Follow up to confirm meeting",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:2,name:"Janahan",org:"ASEAN Records (individual)",step:6,status:"Pending doc submission – share Google Drive link",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:3,name:"",org:"Ringgit Plus & Alliance Bank",step:4,status:"Missing corporate profile or titles confirmation",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:4,name:"Annie Wong",org:"JCI Penang",step:3,status:"Remind to complete application form",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:5,name:"Mita Lim",org:"ICE Holidays Group",step:5,status:"Confirm/refine proposed titles with client",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:6,name:"",org:"H&H",step:12,status:"Waiting for press release, ceremony flow, event poster",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:7,name:"Jia Wei",org:"H&H Event Prep",step:13,status:"Check event prep status",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:8,name:"",org:"H&H Media",step:12,status:"Confirm media plans, send event details",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:9,name:"Jia Wei",org:"Melix Lab (Asia Records)",step:13,status:"Follow up mock approval & event prep",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:10,name:"",org:"H&H Logistics",step:13,status:"Confirm event flow, venue, time",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:11,name:"",org:"Cooker Land",step:6,status:"Send checklist, follow up doc submission",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:12,name:"",org:"Dare to Dream",step:1,status:"Draft and send appropriate response",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:13,name:"Jia Wei & Eldrick",org:"",step:17,status:"Remind to prepare documents",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:14,name:"",org:"Transtar – Intact Water",step:11,status:"Mock approved – monitor production",priority:"low",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:15,name:"",org:"Transtar – India Gate",step:11,status:"Mock NOT approved – follow up urgently",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:16,name:"",org:"UKM Esport",step:6,status:"Confirm doc submission and presentation date",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:17,name:"",org:"Laundry Bar",step:5,status:"Do Laundry Bar titles",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:18,name:"Caren / Erika",org:"Mykori",step:1,status:"Text to initiate meeting arrangements",priority:"high",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:19,name:"Asher",org:"",step:0,status:"Follow up message pending",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:20,name:"",org:"HE Clinic",step:5,status:"Follow up on title review with HOD",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:21,name:"",org:"AR MY: TOYM",step:5,status:"Waiting for their reply",priority:"low",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:22,name:"Aliyah",org:"",step:11,status:"Cert draft sent – request review & comments",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
  {id:23,name:"",org:"Unspecified Team",step:11,status:"Cert draft sent – request review & comments",priority:"medium",notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString()},
];

const P = {
  high:{emoji:"🔴",label:"Urgent",bg:"#2a1515",border:"#6b2020",text:"#ff6b6b"},
  medium:{emoji:"🟡",label:"In Progress",bg:"#221e0e",border:"#6b5a10",text:"#ffd166"},
  low:{emoji:"🟢",label:"Monitoring",bg:"#0e2218",border:"#1a5c38",text:"#6bffb8"},
  done:{emoji:"✅",label:"Done",bg:"#161616",border:"#333",text:"#888"},
};

const STORAGE_KEY = "asean_tracker_permanent";

// ── Migration: add new fields to old candidates ──────────
const migrate = (arr) => arr.map(c => ({
  meetingDates: [],
  subStatus: {},
  ...c,
  checklist: c.checklist || {},
}));

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
  const [editOrg, setEditOrg] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftLang, setDraftLang] = useState("en");
  const [copied, setCopied] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newStep, setNewStep] = useState(1);
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newNotes, setNewNotes] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [addingMeetingDate, setAddingMeetingDate] = useState(false);
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingNote, setNewMeetingNote] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setCandidates(migrate(JSON.parse(r.value)));
      } catch {}
    })();
  }, []);

  const persist = async (data) => {
    setCandidates(data);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch {}
  };

  const saveNewCandidate = () => {
    if (!newName.trim() && !newOrg.trim()) return;
    const n = Number(newStep);
    const nc = { id: Date.now(), name: newName.trim(), org: newOrg.trim(), step: n,
      status: newStatus.trim() || STEP_NEXT[n] || "Follow up", priority: newPriority,
      notes: newNotes.trim(), checklist: {}, subStatus: {}, meetingDates: [], lastUpdated: new Date().toISOString() };
    persist([...candidates, nc]);
    setView("list");
    setNewName(""); setNewOrg(""); setNewStep(1); setNewStatus(""); setNewPriority("medium"); setNewNotes("");
  };

  const deleteCandidate = (id) => { persist(candidates.filter(c => c.id !== id)); setView("list"); setSelected(null); };

  const changePriority = (id, p) => {
    const u = candidates.map(c => c.id === id ? {...c, priority:p, lastUpdated:new Date().toISOString()} : c);
    persist(u); setSelected(u.find(c => c.id === id));
  };

  const toggleCheckItem = (id, step, idx) => {
    const u = candidates.map(c => {
      if (c.id !== id) return c;
      const key = `${step}_${idx}`;
      return {...c, checklist:{...c.checklist, [key]:!c.checklist[key]}, lastUpdated:new Date().toISOString()};
    });
    persist(u); setSelected(u.find(c => c.id === id));
  };

  // Multi-select sub-status toggle
  const toggleSubStatus = (id, step, val) => {
    const u = candidates.map(c => {
      if (c.id !== id) return c;
      const key = `step_${step}`;
      const current = c.subStatus[key] || [];
      const updated = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
      return {...c, subStatus:{...c.subStatus, [key]:updated}, lastUpdated:new Date().toISOString()};
    });
    persist(u); setSelected(u.find(c => c.id === id));
  };

  const addMeetingDate = (id) => {
    if (!newMeetingDate) return;
    const u = candidates.map(c => {
      if (c.id !== id) return c;
      const dates = [...(c.meetingDates||[]), {date: newMeetingDate, note: newMeetingNote.trim(), added: new Date().toISOString()}];
      return {...c, meetingDates: dates.sort((a,b) => new Date(b.date)-new Date(a.date)), lastUpdated:new Date().toISOString()};
    });
    persist(u); setSelected(u.find(c => c.id === id));
    setNewMeetingDate(""); setNewMeetingNote(""); setAddingMeetingDate(false);
  };

  const deleteMeetingDate = (id, idx) => {
    const u = candidates.map(c => {
      if (c.id !== id) return c;
      const dates = (c.meetingDates||[]).filter((_,i) => i !== idx);
      return {...c, meetingDates:dates, lastUpdated:new Date().toISOString()};
    });
    persist(u); setSelected(u.find(c => c.id === id));
  };

  const openEdit = (c) => {
    setEditStatus(c.status); setEditStep(c.step); setEditNote(c.notes||"");
    setEditName(c.name||""); setEditOrg(c.org||""); setEditing(true); setDraft("");
  };

  const saveEdits = (id) => {
    const n = Number(editStep);
    const u = candidates.map(c => c.id === id ? {...c, name:editName, org:editOrg, status:editStatus,
      step:n, notes:editNote, lastUpdated:new Date().toISOString()} : c);
    persist(u); setSelected(u.find(c => c.id === id)); setEditing(false);
  };

  const generateDraft = async (c, lang) => {
    setDraftLoading(true); setDraft(""); setCopied(false);
    const contactName = c.name || (c.org ? `the team at ${c.org}` : "there");
    const checklist = STEP_CHECKLIST[c.step] || [];
    const pending = checklist.filter((_,i) => !c.checklist[`${c.step}_${i}`]);
    const subKey = `step_${c.step}`;
    const activeSubs = (c.subStatus[subKey]||[]).map(v => STEP_SUBSTATUS[c.step]?.find(o=>o.v===v)?.l).filter(Boolean);
    const langInstruction = lang==="zh" ? "Write in conversational Mandarin Chinese (简体中文), friendly WhatsApp tone."
      : lang==="my" ? "Write in Bahasa Malaysia, friendly WhatsApp tone."
      : "Write in English, friendly WhatsApp tone.";
    const prompt = `You are Gillian, Managing Director of ASEAN Records / Asia Records.
Write a short WhatsApp follow-up message to ${contactName}${c.org?` from ${c.org}`:""}.
Step ${c.step} – ${STEP_NAMES[c.step]||""}. Status: ${c.status}.
Current progress: ${activeSubs.length ? activeSubs.join(", ") : "following up"}
Outstanding: ${pending.length ? pending.slice(0,3).join(", ") : "follow up on progress"}
Notes: ${c.notes||"none"}
${langInstruction}
Rules: Warm, friendly, 3-5 lines, state what you need, end with open invitation. No "Dear". Output ONLY the message.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,messages:[{role:"user",content:prompt}]})});
      const data = await res.json();
      setDraft(data.content?.find(b=>b.type==="text")?.text?.trim()||"");
    } catch { setDraft("Error – try again."); }
    setDraftLoading(false);
  };

  const copyText = (text) => {
    try { navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}); }
    catch { const el=document.createElement("textarea");el.value=text;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);setCopied(true);setTimeout(()=>setCopied(false),2000); }
  };

  const sendAiUpdate = async () => {
    if (!inputText.trim()) return;
    setAiLoading(true); setAiMsg("");
    const list = candidates.map(c=>`ID${c.id}: ${c.name||""} | ${c.org||""} | Step${c.step} ${STEP_NAMES[c.step]||""} | ${c.status} | ${c.priority}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Tracker for ASEAN Records.\nCandidates:\n${list}\nUpdate: "${inputText}"\nReturn ONLY JSON:\n{"updates":[{"id":<n>,"status":"...","step":<n>,"priority":"high|medium|low|done"}],"summary":"...","new_candidate":null}`}]})});
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text||"";
      let parsed; try{parsed=JSON.parse(text);}catch{const m=text.match(/\{[\s\S]*\}/);if(m)parsed=JSON.parse(m[0]);}
      if(parsed){
        let u=[...candidates];
        parsed.updates?.forEach(upd=>{u=u.map(c=>c.id===upd.id?{...c,status:upd.status??c.status,step:upd.step??c.step,priority:upd.priority??c.priority,lastUpdated:new Date().toISOString()}:c);});
        if(parsed.new_candidate)u=[...u,{id:Date.now(),notes:"",checklist:{},subStatus:{},meetingDates:[],lastUpdated:new Date().toISOString(),...parsed.new_candidate}];
        persist(u);setAiMsg(parsed.summary||"Updated!");setInputText("");
      }
    } catch{setAiMsg("Error – try again.");}
    setAiLoading(false);
  };

  // ── EXPORT ────────────────────────────────────────────────
  const generateExport = (fmt) => {
    const lines = candidates.map((c,i) => {
      const name = [c.name,c.org].filter(Boolean).join(" · ") || `Candidate #${c.id}`;
      const subKey = `step_${c.step}`;
      const activeSubs = (c.subStatus[subKey]||[]).map(v=>STEP_SUBSTATUS[c.step]?.find(o=>o.v===v)?.l).filter(Boolean);
      const meetings = (c.meetingDates||[]).map(m=>`${m.date}${m.note?` (${m.note})`:""}`).join(", ");
      if(fmt==="text") return `${i+1}. ${name}\n   Step: ${c.step} – ${STEP_NAMES[c.step]||""}\n   Status: ${c.status}\n   Priority: ${P[c.priority]?.label||c.priority}${activeSubs.length?`\n   Progress: ${activeSubs.join(" | ")}`:""}${meetings?`\n   Meetings: ${meetings}`:""}${c.notes?`\n   Notes: ${c.notes}`:""}`;
      if(fmt==="csv") return `"${i+1}","${name}","Step ${c.step} – ${STEP_NAMES[c.step]||""}","${c.status}","${P[c.priority]?.label||c.priority}","${activeSubs.join(" | ")}","${meetings}","${c.notes||""}"`;
      return null;
    });
    if(fmt==="text") return lines.join("\n\n");
    if(fmt==="csv") return `"#","Name / Org","Step","Status / Next Action","Priority","Progress","Meeting Dates","Notes"\n`+lines.join("\n");
    return "";
  };

  const downloadCSV = () => {
    const csv = generateExport("csv");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="candidate-tracker.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const filtered = candidates.filter(c=>(filter==="all"||c.priority===filter)&&(!search||`${c.name} ${c.org} ${c.status}`.toLowerCase().includes(search.toLowerCase())));
  const counts={high:0,medium:0,low:0,done:0};
  candidates.forEach(c=>{if(counts[c.priority]!==undefined)counts[c.priority]++;});

  const BASE={background:"#0c0e13",minHeight:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#e0e2ea",maxWidth:480,margin:"0 auto"};
  const HDR=(x)=>({background:"#111420",borderBottom:"1px solid #1e2235",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,...x});
  const BOX=(x)=>({background:"#111420",border:"1px solid #1e2235",borderRadius:10,padding:"12px 14px",marginBottom:10,...x});
  const LBL={fontSize:10,color:"#444",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6};
  const INP={width:"100%",background:"#161922",border:"1px solid #252a3a",borderRadius:8,color:"#e0e2ea",fontSize:14,padding:"11px 13px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const BTN=(bg,col,x)=>({width:"100%",padding:13,borderRadius:10,border:"none",background:bg||"#2a5298",color:col||"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginBottom:10,...x});
  const BACK={background:"none",border:"none",color:"#7eb3ff",fontSize:22,cursor:"pointer",padding:0};

  // ── EXPORT MODAL ─────────────────────────────────────────
  if(showExport) {
    const textExport = generateExport("text");
    return (
      <div style={BASE}>
        <div style={HDR()}>
          <button onClick={()=>setShowExport(false)} style={BACK}>←</button>
          <span style={{fontWeight:700,fontSize:16}}>📤 Export Master List</span>
        </div>
        <div style={{padding:16,paddingBottom:80}}>
          <div style={{fontSize:13,color:"#555",marginBottom:14}}>Choose your export format:</div>

          {/* Copy as Text */}
          <div style={BOX()}>
            <div style={LBL}>📋 Copy as Text (WhatsApp / Notes)</div>
            <div style={{fontSize:12,color:"#555",marginBottom:10,lineHeight:1.5}}>Full list with all details — paste into WhatsApp or any notes app</div>
            <button onClick={()=>copyText(textExport)} style={BTN("#1a2e52","#7eb3ff",{border:"1px solid #2a5298"})}>
              {copied?"✓ Copied!":"📋 Copy Full List"}
            </button>
          </div>

          {/* Download CSV */}
          <div style={BOX()}>
            <div style={LBL}>📊 Download as CSV (Excel)</div>
            <div style={{fontSize:12,color:"#555",marginBottom:10,lineHeight:1.5}}>Open in Excel or Google Sheets</div>
            <button onClick={downloadCSV} style={BTN("#0e2218","#6bffb8",{border:"1px solid #1a5c38"})}>
              📥 Download CSV
            </button>
          </div>

          {/* Preview */}
          <div style={BOX()}>
            <div style={LBL}>Preview</div>
            <div style={{fontSize:11,color:"#555",lineHeight:1.6,whiteSpace:"pre-wrap",maxHeight:300,overflowY:"auto",background:"#0c0e13",padding:10,borderRadius:8}}>
              {textExport.slice(0,600)}{textExport.length>600?"...":""}
            </div>
          </div>

          <button style={BTN("#1e2235","#888")} onClick={()=>setShowExport(false)}>← Back</button>
        </div>
      </div>
    );
  }

  // ── ADD NEW ───────────────────────────────────────────────
  if(view==="addnew") {
    return (
      <div style={BASE}>
        <div style={HDR()}>
          <button onClick={()=>setView("list")} style={BACK}>←</button>
          <span style={{fontWeight:700,fontSize:16}}>➕ Add New Candidate</span>
        </div>
        <div style={{padding:16,paddingBottom:80}}>
          <div style={BOX()}><div style={LBL}>Contact Name</div><input value={newName} onChange={e=>setNewName(e.target.value)} style={INP} placeholder="e.g. Sarah Tan"/></div>
          <div style={BOX()}><div style={LBL}>Organisation</div><input value={newOrg} onChange={e=>setNewOrg(e.target.value)} style={INP} placeholder="e.g. CEO Kids International"/></div>
          <div style={BOX()}>
            <div style={LBL}>Starting Step</div>
            <select value={newStep} onChange={e=>setNewStep(Number(e.target.value))} style={{...INP,cursor:"pointer"}}>
              {Object.entries(STEP_NAMES).map(([n,name])=><option key={n} value={n} style={{background:"#161922",color:"#e0e2ea"}}>Step {n} – {name}</option>)}
            </select>
          </div>
          <div style={BOX()}>
            <div style={LBL}>Priority</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(P).map(([key,val])=>(
                <button key={key} onClick={()=>setNewPriority(key)} style={{padding:"10px 8px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${newPriority===key?val.border:"#252a3a"}`,background:newPriority===key?val.bg:"#161922",color:newPriority===key?val.text:"#555",fontSize:12,fontWeight:700}}>{val.emoji} {val.label}</button>
              ))}
            </div>
          </div>
          <div style={BOX()}><div style={LBL}>Status / Next Action <span style={{color:"#444",textTransform:"none",fontSize:10}}>(optional)</span></div><textarea value={newStatus} onChange={e=>setNewStatus(e.target.value)} rows={2} style={{...INP,resize:"none"}} placeholder="Leave blank to auto-fill"/></div>
          <div style={BOX()}><div style={LBL}>Notes <span style={{color:"#444",textTransform:"none",fontSize:10}}>(optional)</span></div><textarea value={newNotes} onChange={e=>setNewNotes(e.target.value)} rows={3} style={{...INP,resize:"none"}} placeholder="Any context or background..."/></div>
          <button style={BTN("#2a5298")} onClick={saveNewCandidate} disabled={!newName.trim()&&!newOrg.trim()}>➕ Add Candidate</button>
          <button style={BTN("#1e2235","#888")} onClick={()=>setView("list")}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── AI UPDATE ─────────────────────────────────────────────
  if(view==="update") {
    return (
      <div style={BASE}>
        <div style={HDR()}><button onClick={()=>setView("list")} style={BACK}>←</button><span style={{fontWeight:700,fontSize:16}}>✏️ AI Update</span></div>
        <div style={{padding:16}}>
          <div style={{fontSize:13,color:"#555",marginBottom:14,lineHeight:1.6}}>Paste any碎片 — WhatsApp snippet, voice note, quick update. AI finds the right candidate and updates automatically.</div>
          <textarea style={{...INP,resize:"none",marginBottom:12}} rows={6} placeholder={"Examples:\n• Janahan sent all docs\n• H&H approved certificate mock\n• New client Sarah from XYZ, first meeting done"} value={inputText} onChange={e=>setInputText(e.target.value)}/>
          <button style={BTN(aiLoading||!inputText.trim()?"#1a2030":"#2a5298")} onClick={sendAiUpdate} disabled={aiLoading||!inputText.trim()}>
            {aiLoading?"⏳ Processing...":"Update Tracker →"}
          </button>
          {aiMsg&&<div style={{background:"#0e2218",border:"1px solid #1a5c38",borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:11,color:"#6bffb8",fontWeight:700,marginBottom:4}}>✓ UPDATED</div><div style={{fontSize:14,color:"#ccc"}}>{aiMsg}</div></div>}
        </div>
      </div>
    );
  }

  // ── DETAIL ────────────────────────────────────────────────
  if(view==="detail"&&selected) {
    const c = candidates.find(x=>x.id===selected.id)||selected;
    const pc = P[c.priority]||P.medium;
    const checklist = STEP_CHECKLIST[c.step]||[];
    const doneCount = checklist.filter((_,i)=>c.checklist[`${c.step}_${i}`]).length;
    const subKey = `step_${c.step}`;
    const activeSubs = c.subStatus[subKey]||[];

    return (
      <div style={BASE}>
        <div style={HDR({justifyContent:"space-between"})}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{setView("list");setEditing(false);setDraft("");}} style={BACK}>←</button>
            <span style={{fontWeight:700,fontSize:15,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>#{c.id} {c.name||c.org}</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>editing?setEditing(false):openEdit(c)} style={{background:editing?"#2a1515":"#1e3a6e",border:"none",borderRadius:8,color:editing?"#ff6b6b":"#7eb3ff",fontWeight:700,fontSize:13,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit"}}>
              {editing?"✕":"✏️"}
            </button>
            <button onClick={()=>{if(window.confirm(`Delete ${c.name||c.org||"this candidate"}?`))deleteCandidate(c.id);}} style={{background:"#2a1515",border:"1px solid #6b2020",borderRadius:8,color:"#ff6b6b",fontWeight:700,fontSize:13,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
          </div>
        </div>

        <div style={{padding:16,paddingBottom:80}}>
          <div style={{background:pc.bg,border:`1px solid ${pc.border}`,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>{c.name||c.org||`Candidate #${c.id}`}</div>
            {c.name&&c.org&&<div style={{fontSize:13,color:"#666",marginBottom:8}}>{c.org}</div>}
            <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:pc.bg,color:pc.text,border:`1px solid ${pc.border}`}}>{pc.emoji} {pc.label}</span>
          </div>

          {/* Meeting Dates — always visible */}
          <div style={BOX({background:"#0e1a2e",borderColor:"#1e3a6e"})}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{...LBL,color:"#4a6fa5",marginBottom:0}}>📅 Meeting / Appointment Dates</div>
              <button onClick={()=>setAddingMeetingDate(!addingMeetingDate)} style={{background:"#1e3a6e",border:"none",borderRadius:6,color:"#7eb3ff",fontSize:12,fontWeight:700,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>
                {addingMeetingDate?"Cancel":"+ Add"}
              </button>
            </div>
            {addingMeetingDate&&(
              <div style={{marginBottom:10}}>
                <input type="date" value={newMeetingDate} onChange={e=>setNewMeetingDate(e.target.value)} style={{...INP,marginBottom:8,colorScheme:"dark"}}/>
                <input value={newMeetingNote} onChange={e=>setNewMeetingNote(e.target.value)} style={{...INP,marginBottom:8}} placeholder="Note (e.g. Consultation, Follow-up)"/>
                <button onClick={()=>addMeetingDate(c.id)} style={{...BTN("#2a5298"),marginBottom:0,padding:10,fontSize:13}}>Save Date</button>
              </div>
            )}
            {(c.meetingDates||[]).length===0&&!addingMeetingDate&&<div style={{fontSize:12,color:"#333"}}>No meetings recorded yet</div>}
            {(c.meetingDates||[]).map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:i>0?"1px solid #1e2235":"none"}}>
                <div>
                  <div style={{fontSize:13,color:"#7eb3ff",fontWeight:600}}>{new Date(m.date).toLocaleDateString("en-MY",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div>
                  {m.note&&<div style={{fontSize:11,color:"#555"}}>{m.note}</div>}
                </div>
                <button onClick={()=>deleteMeetingDate(c.id,i)} style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:14}}>✕</button>
              </div>
            ))}
          </div>

          {editing?(
            <>
              <div style={BOX()}><div style={LBL}>Contact Name</div><input value={editName} onChange={e=>setEditName(e.target.value)} style={INP} placeholder="e.g. Jia Wei"/></div>
              <div style={BOX()}><div style={LBL}>Organisation</div><input value={editOrg} onChange={e=>setEditOrg(e.target.value)} style={INP} placeholder="e.g. H&H"/></div>
              <div style={BOX()}><div style={LBL}>Status / Next Action</div><textarea value={editStatus} onChange={e=>setEditStatus(e.target.value)} rows={3} style={{...INP,resize:"none"}} placeholder="What needs to happen next?"/></div>
              <div style={BOX()}>
                <div style={LBL}>Current Step</div>
                <select value={editStep} onChange={e=>setEditStep(Number(e.target.value))} style={{...INP,marginBottom:10,cursor:"pointer"}}>
                  {Object.entries(STEP_NAMES).map(([n,name])=><option key={n} value={n} style={{background:"#161922",color:"#e0e2ea"}}>Step {n} – {name}</option>)}
                </select>
                <div style={{background:"#1e2235",borderRadius:3,height:4,overflow:"hidden"}}>
                  <div style={{width:`${Math.round((Number(editStep)/18)*100)}%`,height:"100%",background:"linear-gradient(90deg,#2a5298,#7eb3ff)",borderRadius:3}}/>
                </div>
              </div>
              <div style={BOX()}><div style={LBL}>📝 Notes (private)</div><textarea value={editNote} onChange={e=>setEditNote(e.target.value)} rows={4} style={{...INP,resize:"none"}} placeholder="Context, reminders, details..."/></div>
              <button style={BTN("#2a5298")} onClick={()=>saveEdits(c.id)}>💾 Save Changes</button>
            </>
          ):(
            <>
              <div style={BOX()}><div style={LBL}>Status / Next Action</div><div style={{fontSize:14,color:"#ccc",lineHeight:1.6}}>{c.status}</div></div>

              {/* Step + Checklist */}
              <div style={BOX()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={LBL}>Step {c.step} · {STEP_NAMES[c.step]}</div>
                  {checklist.length>0&&<span style={{fontSize:11,color:doneCount===checklist.length?"#6bffb8":"#ffd166",fontWeight:700}}>{doneCount}/{checklist.length}</span>}
                </div>
                <div style={{background:"#1e2235",borderRadius:3,height:4,overflow:"hidden",marginBottom:checklist.length>0?12:0}}>
                  <div style={{width:`${Math.round((c.step/18)*100)}%`,height:"100%",background:"linear-gradient(90deg,#2a5298,#7eb3ff)",borderRadius:3}}/>
                </div>
                {checklist.length>0&&(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {checklist.map((item,i)=>{
                      const checked=!!c.checklist[`${c.step}_${i}`];
                      return(
                        <div key={i} onClick={()=>toggleCheckItem(c.id,c.step,i)} style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"6px 8px",borderRadius:8,background:checked?"rgba(107,255,184,0.05)":"transparent"}}>
                          <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${checked?"#6bffb8":"#333"}`,background:checked?"#6bffb8":"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {checked&&<span style={{fontSize:11,color:"#0c0e13",fontWeight:900}}>✓</span>}
                          </div>
                          <span style={{fontSize:13,color:checked?"#555":"#bbb",textDecoration:checked?"line-through":"none",lineHeight:1.4}}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Multi-select Sub-status */}
              {STEP_SUBSTATUS[c.step]&&(
                <div style={BOX({background:"#1a1a0e",borderColor:"#4a4a10"})}>
                  <div style={{...LBL,color:"#ffd166",marginBottom:8}}>📊 Step Progress <span style={{fontSize:9,color:"#666",textTransform:"none"}}>(tap to toggle)</span></div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {STEP_SUBSTATUS[c.step].map(opt=>{
                      const active=activeSubs.includes(opt.v);
                      return(
                        <div key={opt.v} onClick={()=>toggleSubStatus(c.id,c.step,opt.v)} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 10px",borderRadius:8,background:active?"rgba(255,209,102,0.08)":"transparent",border:`1px solid ${active?"#6b5a10":"transparent"}`}}>
                          <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${active?"#ffd166":"#333"}`,background:active?"#ffd166":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {active&&<span style={{fontSize:11,color:"#0c0e13",fontWeight:900}}>✓</span>}
                          </div>
                          <span style={{fontSize:13,color:active?"#ffd166":"#666",lineHeight:1.4}}>{opt.l}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {c.notes?<div style={BOX({background:"#0e1a2e",borderColor:"#1e3a6e"})}><div style={{...LBL,color:"#4a6fa5"}}>📝 Notes</div><div style={{fontSize:14,color:"#9bb8e8",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{c.notes}</div></div>
              :<div style={{...BOX(),borderStyle:"dashed",cursor:"pointer",textAlign:"center"}} onClick={()=>openEdit(c)}><span style={{fontSize:13,color:"#333"}}>+ Tap to add notes</span></div>}

              {/* WhatsApp Draft */}
              <div style={BOX({background:"#0b1a12",borderColor:"#1a4a2a"})}>
                <div style={{...LBL,color:"#25d366"}}>💬 Draft WhatsApp Message</div>
                <div style={{display:"flex",gap:6,marginBottom:12}}>
                  {[["en","English"],["zh","中文"],["my","BM"]].map(([k,l])=>(
                    <button key={k} onClick={()=>setDraftLang(k)} style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,border:"1px solid",background:draftLang===k?"#1a4a2a":"#0c0e13",color:draftLang===k?"#25d366":"#444",borderColor:draftLang===k?"#25d366":"#1e2235"}}>{l}</button>
                  ))}
                </div>
                <button onClick={()=>generateDraft(c,draftLang)} disabled={draftLoading} style={BTN("#1a4a2a","#25d366",{border:"1px solid #25d366",marginBottom:draft?10:0,opacity:draftLoading?0.6:1})}>
                  {draftLoading?"⏳ Generating...":"✨ Generate Draft"}
                </button>
                {draft&&(
                  <>
                    <div style={{background:"#0c1a10",border:"1px solid #1a4a2a",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                      <div style={{fontSize:14,color:"#c8f0d0",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{draft}</div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>copyText(draft)} style={{flex:1,padding:11,borderRadius:9,border:"1px solid #25d366",background:copied?"#1a4a2a":"transparent",color:"#25d366",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{copied?"✓ Copied!":"📋 Copy"}</button>
                      <button onClick={()=>generateDraft(c,draftLang)} style={{flex:1,padding:11,borderRadius:9,border:"1px solid #1e2235",background:"transparent",color:"#666",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>🔄 Retry</button>
                    </div>
                  </>
                )}
              </div>
              <div style={BOX()}><div style={LBL}>Last Updated</div><div style={{fontSize:13,color:"#555"}}>{new Date(c.lastUpdated).toLocaleString("en-MY")}</div></div>
            </>
          )}

          {!editing&&(
            <div style={{marginBottom:10}}>
              <div style={{...LBL,marginBottom:8}}>Change Priority</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {Object.entries(P).map(([key,val])=>(
                  <button key={key} onClick={()=>changePriority(c.id,key)} style={{padding:"10px 8px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${c.priority===key?val.border:"#252a3a"}`,background:c.priority===key?val.bg:"#161922",color:c.priority===key?val.text:"#555",fontSize:12,fontWeight:700}}>{val.emoji} {val.label}</button>
                ))}
              </div>
            </div>
          )}
          <button style={BTN("#1e2235","#888")} onClick={()=>{setView("list");setEditing(false);setDraft("");}}>← Back</button>
        </div>
      </div>
    );
  }

  // ── LIST ──────────────────────────────────────────────────
  return (
    <div style={BASE}>
      <div style={{background:"#111420",borderBottom:"1px solid #1e2235",padding:"14px 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <div style={{fontSize:10,color:"#4a6fa5",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:2}}>ASEAN / ASIA RECORDS</div>
            <div style={{fontSize:20,fontWeight:700}}>Candidate Tracker</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setShowExport(true)} style={{background:"#1a2e52",border:"1px solid #2a5298",borderRadius:8,color:"#7eb3ff",fontWeight:700,fontSize:12,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit"}}>📤 Export</button>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:28,fontWeight:700,color:"#7eb3ff",lineHeight:1}}>{candidates.length}</div>
              <div style={{fontSize:10,color:"#444"}}>files</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
          {[["all",`All ${candidates.length}`],["high",`🔴 ${counts.high}`],["medium",`🟡 ${counts.medium}`],["low",`🟢 ${counts.low}`],["done",`✅ ${counts.done}`]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",background:filter===k?"#1e3a6e":"#161922",color:filter===k?"#7eb3ff":"#555",border:`1px solid ${filter===k?"#2a5298":"#252a3a"}`}}>{l}</button>
          ))}
        </div>
        <input placeholder="🔍 Search name, org, status..." value={search} onChange={e=>setSearch(e.target.value)} style={{...INP,padding:"9px 13px"}}/>
      </div>

      <div style={{padding:"12px 16px 0",display:"flex",gap:8}}>
        <button onClick={()=>setView("addnew")} style={{...BTN("#1a4a2a","#6bffb8",{flex:1,marginBottom:0,border:"1px solid #1a5c38"})}}>➕ Add New</button>
        <button onClick={()=>{setView("update");setAiMsg("");}} style={{...BTN("#1a2e52",undefined,{flex:2,marginBottom:0})}}>✏️ Paste AI Update</button>
      </div>
      <div style={{height:12}}/>

      <div style={{padding:"4px 16px 80px"}}>
        {filtered.length===0&&<div style={{textAlign:"center",color:"#444",padding:"40px 0",fontSize:14}}>No candidates match.</div>}
        {filtered.map(c=>{
          const pc=P[c.priority]||P.medium;
          const name=c.name&&c.org?`${c.name} · ${c.org}`:c.name||c.org||`Candidate #${c.id}`;
          const cl=STEP_CHECKLIST[c.step]||[];
          const done=cl.filter((_,i)=>c.checklist[`${c.step}_${i}`]).length;
          const subKey=`step_${c.step}`;
          const activeSubs=c.subStatus[subKey]||[];
          const lastMeeting=(c.meetingDates||[])[0];
          return(
            <div key={c.id} onClick={()=>{setSelected(c);setEditing(false);setDraft("");setAddingMeetingDate(false);setView("detail");}}
              style={{background:pc.bg,border:`1px solid ${pc.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <div style={{flex:1,marginRight:8}}>
                  <span style={{fontSize:10,color:"#444",fontFamily:"monospace",marginRight:6}}>#{c.id}</span>
                  <span style={{fontSize:15,fontWeight:700,color:"#dde"}}>{name}</span>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:20,background:pc.bg,color:pc.text,border:`1px solid ${pc.border}`,whiteSpace:"nowrap"}}>{pc.emoji} {pc.label}</span>
              </div>
              <div style={{fontSize:12,color:"#666",marginBottom:5,lineHeight:1.4}}>{c.status}</div>
              {activeSubs.length>0&&<div style={{fontSize:11,color:"#ffd166",marginBottom:4}}>{STEP_SUBSTATUS[c.step]?.find(o=>o.v===activeSubs[activeSubs.length-1])?.l}{activeSubs.length>1?` +${activeSubs.length-1} more`:""}</div>}
              {lastMeeting&&<div style={{fontSize:11,color:"#4a6fa5",marginBottom:4}}>📅 {new Date(lastMeeting.date).toLocaleDateString("en-MY",{day:"numeric",month:"short",year:"numeric"})}{lastMeeting.note?` · ${lastMeeting.note}`:""}</div>}
              {c.notes&&<div style={{fontSize:11,color:"#4a6fa5",marginBottom:4}}>📝 Notes</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,color:"#444"}}>Step {c.step} · {STEP_NAMES[c.step]}</div>
                {cl.length>0&&<div style={{fontSize:11,color:done===cl.length?"#6bffb8":"#555"}}>{done}/{cl.length} ✓</div>}
              </div>
              <div style={{background:"#0c0e13",borderRadius:3,height:3,marginTop:7,overflow:"hidden"}}>
                <div style={{width:`${Math.round((c.step/18)*100)}%`,height:"100%",background:pc.text,borderRadius:3}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
