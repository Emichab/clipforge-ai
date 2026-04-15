"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONFIG DATA ───────────────────────────────────────────
const FONTS = [
  { id:"montserrat", name:"Montserrat Black", family:"Montserrat", weight:900 },
  { id:"bebas", name:"Bebas Neue", family:"Bebas Neue", weight:400 },
  { id:"oswald", name:"Oswald Bold", family:"Oswald", weight:700 },
  { id:"poppins", name:"Poppins Black", family:"Poppins", weight:900 },
  { id:"righteous", name:"Righteous", family:"Righteous", weight:400 },
  { id:"bangers", name:"Bangers", family:"Bangers", weight:400 },
  { id:"marker", name:"Permanent Marker", family:"Permanent Marker", weight:400 },
  { id:"anton", name:"Anton", family:"Anton", weight:400 },
  { id:"russo", name:"Russo One", family:"Russo One", weight:400 },
  { id:"blackops", name:"Black Ops One", family:"Black Ops One", weight:400 },
  { id:"bungee", name:"Bungee", family:"Bungee", weight:400 },
  { id:"passion", name:"Passion One", family:"Passion One", weight:900 },
  { id:"archivo", name:"Archivo Black", family:"Archivo Black", weight:400 },
  { id:"lilita", name:"Lilita One", family:"Lilita One", weight:400 },
];

const STYLES = [
  { id:"bold-behind", name:"Bold Text Behind", desc:"Texto grande viral", bg:false, size:64, up:true, stroke:true, sCol:"#000", sW:4, shadow:"0 6px 30px rgba(0,0,0,.8)", hl:true, hlCol:"#FFE135", pos:"center", anim:"scaleIn" },
  { id:"gradient-center", name:"Gradient Center", desc:"Gradiente centrado", bg:false, size:48, up:true, stroke:true, sCol:"#000", sW:3, shadow:"0 4px 20px rgba(0,0,0,.6)", hl:false, grad:["#FFE135","#FF6B35"], pos:"center", anim:"slideUp" },
  { id:"multi-pos", name:"Multi Position", desc:"Posiciones dinámicas", bg:false, size:42, up:true, stroke:true, sCol:"#000", sW:3, shadow:"0 4px 20px rgba(0,0,0,.6)", hl:true, hlCol:"#00F5FF", pos:"center", anim:"pop" },
  { id:"minimal-box", name:"Minimal Box", desc:"Caja con fondo", bg:true, bgCol:"rgba(0,0,0,.75)", size:28, up:false, stroke:false, sW:0, shadow:"none", hl:true, hlCol:"#FFE135", pos:"bottom", anim:"fadeIn", rad:8 },
  { id:"neon-glow", name:"Neon Glow", desc:"Efecto neón", bg:false, size:44, up:true, stroke:false, sW:0, shadow:"0 0 20px #0ff,0 0 40px #0ff50", hl:true, hlCol:"#FF00E5", glow:"#00F5FF", pos:"center", anim:"glow" },
  { id:"karaoke", name:"Karaoke Wave", desc:"Iluminación progresiva", bg:true, bgCol:"rgba(0,0,0,.8)", size:32, up:false, stroke:false, sW:0, shadow:"none", hl:false, dimCol:"rgba(255,255,255,.25)", actCol:"#fff", pos:"bottom", anim:"wipe", rad:10 },
  { id:"retro-vhs", name:"Retro VHS", desc:"Estilo glitch retro", bg:false, size:40, up:true, stroke:true, sCol:"#000", sW:2, shadow:"2px 2px 0 #FF3366,-2px -2px 0 #00FF88", hl:true, hlCol:"#FF3366", pos:"center", anim:"glitch" },
  { id:"magazine", name:"Magazine", desc:"Editorial elegante", bg:true, bgCol:"rgba(10,10,10,.9)", size:26, up:true, stroke:false, sW:0, shadow:"none", hl:true, hlCol:"#E8E073", pos:"bottom", anim:"slideUp", ls:6, rad:0 },
  { id:"fire-bold", name:"Fire Bold", desc:"Texto en fuego", bg:false, size:56, up:true, stroke:true, sCol:"#000", sW:4, shadow:"0 4px 30px rgba(255,107,53,.5)", hl:true, hlCol:"#FFD700", grad:["#FF6B35","#FF3366"], pos:"center", anim:"bounce" },
  { id:"takeone", name:"TakeOne Pro", desc:"Profesional limpio", bg:true, bgCol:"rgba(0,0,0,.65)", size:30, up:false, stroke:false, sW:0, shadow:"0 2px 10px rgba(0,0,0,.5)", hl:true, hlCol:"#6C5CE7", pos:"bottom", anim:"fadeIn", rad:12 },
];

const PLATFORMS = [
  { id:"tiktok", name:"TikTok", icon:"🎵", w:1080, h:1920, ratio:"9:16", safeTop:150, safeBot:280 },
  { id:"instagram", name:"Instagram Reels", icon:"📸", w:1080, h:1920, ratio:"9:16", safeTop:120, safeBot:340 },
  { id:"youtube", name:"YouTube Shorts", icon:"▶️", w:1080, h:1920, ratio:"9:16", safeTop:100, safeBot:200 },
  { id:"twitter", name:"X / Twitter", icon:"𝕏", w:1920, h:1080, ratio:"16:9", safeTop:60, safeBot:100 },
  { id:"landscape", name:"YouTube 16:9", icon:"📺", w:1920, h:1080, ratio:"16:9", safeTop:50, safeBot:80 },
];

const COLORS = ["#FFFFFF","#FFE135","#FF6B35","#FF3366","#00F5FF","#6C5CE7","#00FF88","#FF00E5","#FFA502","#1E90FF","#000000"];
const FILTERS = [
  { id:"none", name:"Normal", css:"none" },
  { id:"cinematic", name:"Cinematic", css:"contrast(1.15) saturate(1.2) brightness(.95)" },
  { id:"warm", name:"Warm", css:"sepia(.2) saturate(1.3) brightness(1.05)" },
  { id:"cold", name:"Cold", css:"saturate(.8) brightness(1.05) hue-rotate(10deg)" },
  { id:"vintage", name:"Vintage", css:"sepia(.35) contrast(1.1) brightness(.9)" },
  { id:"bw", name:"B&W", css:"grayscale(1) contrast(1.2)" },
  { id:"vibrant", name:"Vibrant", css:"saturate(1.8) contrast(1.1)" },
];
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const fmt = s => { if(!s&&s!==0)return"0:00"; return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`; };
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,5);

// ─── AI HELPER ──────────────────────────────────────────────
async function callAI(messages, maxTokens = 1024) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, max_tokens: maxTokens }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.content?.map(c => c.text || "").join("") || "";
}

// ─── CAPTION OVERLAY ────────────────────────────────────────
function Caption({ caption, time, style: st, font: fId, color, platform: plId }) {
  if (!caption) return null;
  const words = caption.text.split(" ");
  const dur = caption.end - caption.start;
  const wDur = dur / Math.max(words.length, 1);
  const elapsed = time - caption.start;
  const f = FONTS.find(x => x.id === fId) || FONTS[0];
  const pl = PLATFORMS.find(p => p.id === plId) || PLATFORMS[0];

  const pos = {
    position: "absolute", left: "50%", maxWidth: "90%", textAlign: "center", zIndex: 10,
    pointerEvents: "none", animation: "captionIn .25s ease-out",
    padding: st.bg ? "12px 20px" : "4px",
    background: st.bg ? (st.bgCol || "rgba(0,0,0,.7)") : "transparent",
    borderRadius: st.rad || 0,
    ...(st.pos === "bottom" ? { bottom: 48, transform: "translateX(-50%)" } :
      st.pos === "top" ? { top: 40, transform: "translateX(-50%)" } :
      { top: "50%", transform: "translate(-50%,-50%)" }),
  };

  return (
    <div style={pos}>
      {words.map((word, wi) => {
        const ws = wi * wDur;
        const active = elapsed >= ws;
        const current = elapsed >= ws && elapsed < ws + wDur;

        let c = color;
        if (st.id === "karaoke") c = active ? (st.actCol || "#fff") : (st.dimCol || "rgba(255,255,255,.25)");
        else if (st.grad && current) c = st.grad[1];
        else if (st.hl && current) c = st.hlCol;

        let ts = st.shadow || "none";
        if (st.glow && current) ts = `0 0 20px ${st.glow},0 0 40px ${st.glow}60`;

        const s = {
          display: "inline-block", marginRight: 6, fontSize: st.size * 0.42,
          fontFamily: `'${f.family}',sans-serif`, fontWeight: f.weight,
          color: c, textTransform: st.up ? "uppercase" : "none",
          letterSpacing: st.ls || 1, transition: "all .12s ease-out", textShadow: ts,
          WebkitTextStroke: st.stroke ? `${st.sW * 0.4}px ${st.sCol}` : "none",
          paintOrder: st.stroke ? "stroke fill" : "normal",
          ...(current && st.anim === "scaleIn" && { transform: "scale(1.2)" }),
          ...(current && st.anim === "pop" && { transform: "scale(1.18) translateY(-2px)" }),
          ...(current && st.anim === "bounce" && { transform: "translateY(-4px) scale(1.12)" }),
          ...(!active && st.anim === "fadeIn" && { opacity: 0.3 }),
          ...(current && st.anim === "glow" && { filter: "brightness(1.4)" }),
        };

        if (st.grad && !current && active) {
          s.background = `linear-gradient(135deg,${st.grad[0]},${st.grad[1]})`;
          s.WebkitBackgroundClip = "text"; s.WebkitTextFillColor = "transparent";
        }

        return <span key={wi} style={s}>{word} </span>;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function ClipForgeApp() {
  const [screen, setScreen] = useState("upload");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [ct, setCt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [procMsg, setProcMsg] = useState("");
  const [procPct, setProcPct] = useState(0);
  const [captions, setCaptions] = useState([]);
  const [clips, setClips] = useState([]);
  const [selClip, setSelClip] = useState(null);
  const [style, setStyle] = useState("bold-behind");
  const [font, setFont] = useState("montserrat");
  const [color, setColor] = useState("#FFFFFF");
  const [platform, setPlatform] = useState("tiktok");
  const [safeZone, setSafeZone] = useState(true);
  const [filter, setFilter] = useState("none");
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState("style");
  const [editCap, setEditCap] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatIn, setChatIn] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatLoad, setChatLoad] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportPct, setExportPct] = useState(0);
  const [exported, setExported] = useState([]);
  const [remotionRendering, setRemotionRendering] = useState(false);
  const [toast, setToast] = useState(null);

  const vidRef = useRef(null);
  const fileRef = useRef(null);
  const chatEndRef = useRef(null);

  // ─── TOAST ─────
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  // ─── VIDEO LOAD ─────
  const loadVideo = (f) => {
    if (!f) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(f); setVideoReady(false); setVideoError(null);
    try { setVideoUrl(URL.createObjectURL(f)); }
    catch { const r = new FileReader(); r.onload = e => setVideoUrl(e.target.result); r.readAsDataURL(f); }
  };

  const handleFile = e => { const f = e.target.files?.[0]; if (f) loadVideo(f); };
  const handleDrop = e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer?.files?.[0]; if (f) loadVideo(f); };

  const onMeta = e => { setDuration(e.target.duration); setVideoReady(true); setVideoError(null); e.target.currentTime = 0.1; };
  const onVidErr = () => setVideoError("⚠️ No se puede reproducir. Prueba con Chrome o convierte a MP4 H.264.");
  const onCanPlay = () => { setVideoReady(true); setVideoError(null); };

  const togglePlay = () => {
    const v = vidRef.current;
    if (!v || !videoReady) return;
    if (playing) { v.pause(); setPlaying(false); return; }
    if (selClip) v.currentTime = selClip.start;
    v.muted = false;
    const p = v.play();
    if (p) p.then(() => setPlaying(true)).catch(() => { v.muted = true; v.play().then(() => setPlaying(true)).catch(() => {}); });
    else setPlaying(true);
  };

  const seekTo = t => { if (vidRef.current) { vidRef.current.currentTime = t; setCt(t); } };

  useEffect(() => { if (vidRef.current) vidRef.current.playbackRate = speed; }, [speed]);

  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    let id;
    const tick = () => {
      if (v.paused || v.ended) { setPlaying(false); return; }
      setCt(v.currentTime);
      if (selClip && v.currentTime >= selClip.end) { v.pause(); setPlaying(false); v.currentTime = selClip.start; return; }
      id = requestAnimationFrame(tick);
    };
    if (playing) id = requestAnimationFrame(tick);
    return () => { if (id) cancelAnimationFrame(id); };
  }, [playing, selClip]);

  const curCap = captions.find(c => ct >= c.start && ct < c.end);
  const curStyle = STYLES.find(s => s.id === style) || STYLES[0];
  const curPlat = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
  const curFilter = FILTERS.find(f => f.id === filter) || FILTERS[0];

  // ─── PROCESS ─────
  const process = async () => {
    setScreen("processing"); setProcMsg("Analizando video..."); setProcPct(10);
    await new Promise(r => setTimeout(r, 500)); setProcPct(25); setProcMsg("Transcribiendo con IA...");
    try {
      const d = duration || 60, n = videoFile?.name || "video";
      const t1 = await callAI([{ role: "user", content: `Simulate a realistic transcription for a ${Math.round(d)}s video "${n}". Generate ${Math.max(8, Math.floor(d / 4))} caption segments. Each 1.5-4s, natural spoken content. Include some filler words.\nRESPOND ONLY JSON array: [{"start":number,"end":number,"text":"string"}]\nNo markdown.` }]);
      setProcPct(55); setProcMsg("Generando subtítulos...");
      const caps = JSON.parse(t1.replace(/```json|```/g, "").trim()).map((c, i) => ({ ...c, id: uid(), index: i }));
      setCaptions(caps); setProcPct(70); setProcMsg("Detectando clips virales...");

      const transcript = caps.map(c => `[${fmt(c.start)}-${fmt(c.end)}] ${c.text}`).join("\n");
      const t2 = await callAI([{ role: "user", content: `Analyze this ${Math.round(d)}s video transcript. Find 3-5 best viral clips for TikTok/Reels.\nTRANSCRIPT:\n${transcript}\nFor each: start/end (15-60s), title, score 1-100, reason, suggestedCaption, tags[]\nRESPOND ONLY JSON array. No markdown.` }]);
      setProcPct(90);
      const cl = JSON.parse(t2.replace(/```json|```/g, "").trim()).map(c => ({ ...c, id: uid() })).sort((a, b) => b.score - a.score);
      setClips(cl); setProcPct(100); setProcMsg("¡Listo!");
      await new Promise(r => setTimeout(r, 400));
      if (cl.length > 0) setSelClip(cl[0]);
      setScreen("editor");
    } catch (e) { console.error(e); setToast("❌ Error: " + e.message); setScreen("upload"); }
  };

  // ─── EXPORT ─────
  const exportClip = async (clip) => {
    if (!videoUrl || !clip) return;
    setExporting(true); setExportPct(0); setTab("export");

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const pl = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
      const sc = 0.5;
      canvas.width = pl.w * sc; canvas.height = pl.h * sc;

      const vid = document.createElement("video");
      vid.src = videoUrl; vid.playsInline = true; vid.muted = true; vid.preload = "auto";

      await new Promise((res, rej) => { vid.onloadedmetadata = () => { vid.currentTime = clip.start; }; vid.onseeked = res; vid.onerror = rej; });

      const stream = canvas.captureStream(30);
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm",
        videoBitsPerSecond: 4000000,
      });
      const chunks = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const done = new Promise(res => { mr.onstop = () => res(new Blob(chunks, { type: "video/webm" })); });
      mr.start(); vid.play();

      const ft = FONTS.find(x => x.id === font) || FONTS[0];
      const st = STYLES.find(x => x.id === style) || STYLES[0];
      const fi = FILTERS.find(x => x.id === filter)?.css || "none";
      const clipDur = clip.end - clip.start;

      const draw = () => {
        if (vid.currentTime >= clip.end || vid.paused || vid.ended) { vid.pause(); mr.stop(); return; }
        setExportPct(Math.min(99, Math.round(((vid.currentTime - clip.start) / clipDur) * 100)));

        ctx.save();
        if (fi !== "none") ctx.filter = fi;
        const vr = vid.videoWidth / vid.videoHeight, cr = canvas.width / canvas.height;
        let sx = 0, sy = 0, sw = vid.videoWidth, sh = vid.videoHeight;
        if (vr > cr) { sw = vid.videoHeight * cr; sx = (vid.videoWidth - sw) / 2; }
        else { sh = vid.videoWidth / cr; sy = (vid.videoHeight - sh) / 2; }
        ctx.drawImage(vid, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const cap = captions.find(c => vid.currentTime >= c.start && vid.currentTime < c.end);
        if (cap) {
          const words = cap.text.split(" ");
          const cDur = cap.end - cap.start, wDur = cDur / words.length;
          const elapsed = vid.currentTime - cap.start;
          const fs = st.size * sc * 0.45;
          let yPos = st.pos === "bottom" ? canvas.height * 0.82 : st.pos === "top" ? canvas.height * 0.15 : canvas.height * 0.5;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.font = `${ft.weight} ${fs}px '${ft.family}'`;

          if (st.bg) {
            const m = ctx.measureText(st.up ? cap.text.toUpperCase() : cap.text);
            ctx.fillStyle = st.bgCol || "rgba(0,0,0,.7)";
            ctx.beginPath(); ctx.roundRect(canvas.width / 2 - m.width / 2 - 16, yPos - fs, m.width + 32, fs * 2, st.rad || 0); ctx.fill();
          }

          let xOff = canvas.width / 2 - (words.length * fs * 0.35);
          words.forEach((word, wi) => {
            const ws = wi * wDur, active = elapsed >= ws, cur = elapsed >= ws && elapsed < ws + wDur;
            let fc = color;
            if (st.id === "karaoke") fc = active ? "#fff" : "rgba(255,255,255,0.3)";
            else if (st.hl && cur) fc = st.hlCol;
            if (st.stroke) { ctx.strokeStyle = st.sCol || "#000"; ctx.lineWidth = st.sW * sc * 0.5; ctx.lineJoin = "round"; ctx.strokeText(st.up ? word.toUpperCase() : word, xOff, yPos); }
            ctx.fillStyle = fc;
            const txt = st.up ? word.toUpperCase() : word;
            ctx.fillText(txt, xOff, yPos);
            xOff += ctx.measureText(txt + " ").width;
          });
        }
        requestAnimationFrame(draw);
      };
      draw();

      const blob = await done;
      const url = URL.createObjectURL(blob);
      setExported(p => [{ id: uid(), clipId: clip.id, title: clip.title, url, blob, dur: clipDur, platform, style, font, time: new Date().toISOString() }, ...p]);
      setExportPct(100); setToast(`✅ "${clip.title}" exportado`);
    } catch (e) { console.error(e); setToast("❌ Error al exportar: " + e.message); }
    finally { setExporting(false); }
  };

  const downloadFile = (exp) => {
    const a = document.createElement("a");
    a.href = exp.url; a.download = `${exp.title.replace(/[^a-zA-Z0-9]/g, "_")}_${exp.platform}.webm`;
    a.click();
  };

  // ─── REMOTION EXPORT ─────
  const exportWithRemotion = async (clip) => {
    if (!videoFile || !clip) return;
    setRemotionRendering(true);
    setTab("export");
    try {
      const clipCaptions = captions.filter(c => c.start >= clip.start && c.end <= clip.end);
      const params = {
        clipStart: clip.start,
        clipEnd: clip.end,
        captions: clipCaptions,
        style,
        font,
        color,
        platform,
        filter,
      };
      const fd = new FormData();
      fd.append("video", videoFile, videoFile.name || "video.mp4");
      fd.append("params", JSON.stringify(params));

      setToast("🎬 Renderizando con Remotion...");
      const res = await fetch("/api/render", { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, "_")}_${platform}_remotion.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      setToast(`✅ "${clip.title}" exportado como MP4`);
    } catch (e) {
      console.error(e);
      setToast("❌ Remotion error: " + e.message);
    } finally {
      setRemotionRendering(false);
    }
  };

  // ─── AI CHAT ─────
  const sendChat = async () => {
    if (!chatIn.trim() || chatLoad) return;
    const msg = chatIn.trim(); setChatMsgs(p => [...p, { role: "user", text: msg }]); setChatIn(""); setChatLoad(true);
    try {
      const r = await callAI([{ role: "user", content: `You're a video editor AI. User says: "${msg}"\nCurrent: style=${style}, font=${font}, platform=${platform}, filter=${filter}\nStyles: ${STYLES.map(s => s.id).join(",")}\nFonts: ${FONTS.map(f => f.id).join(",")}\nFilters: ${FILTERS.map(f => f.id).join(",")}\nRespond JSON: {"message":"response","actions":[{"type":"changeStyle"|"changeFont"|"changeFilter"|"changeColor"|"changePlatform","value":"string"}]}\nOnly JSON.` }]);
      const p = JSON.parse(r.replace(/```json|```/g, "").trim());
      setChatMsgs(prev => [...prev, { role: "ai", text: p.message }]);
      (p.actions || []).forEach(a => {
        if (a.type === "changeStyle" && STYLES.find(s => s.id === a.value)) setStyle(a.value);
        if (a.type === "changeFont" && FONTS.find(f => f.id === a.value)) setFont(a.value);
        if (a.type === "changeFilter" && FILTERS.find(f => f.id === a.value)) setFilter(a.value);
        if (a.type === "changeColor") setColor(a.value);
        if (a.type === "changePlatform" && PLATFORMS.find(p => p.id === a.value)) setPlatform(a.value);
      });
    } catch { setChatMsgs(p => [...p, { role: "ai", text: "Error, intenta de nuevo." }]); }
    finally { setChatLoad(false); }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  const removeFillers = () => {
    const fl = ["um", "uh", "eh", "bueno", "o sea", "este", "pues", "like", "you know", "basically"];
    setCaptions(p => p.map(c => ({ ...c, text: c.text.split(" ").filter(w => !fl.includes(w.toLowerCase())).join(" ") || c.text })));
    setToast("✂️ Muletillas eliminadas");
  };

  const copy = t => { navigator.clipboard.writeText(t); setToast("📋 Copiado"); };

  // ═══════════════════════════════════════════════════════════
  // STYLES OBJECT
  // ═══════════════════════════════════════════════════════════
  const $ = {
    app: { minHeight: "100vh", background: "var(--bg)", color: "var(--txt)", fontFamily: "'Montserrat',sans-serif" },
    wrap: { maxWidth: 920, margin: "0 auto", padding: "0 16px 48px", position: "relative" },
    hdr: { padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--brd)", marginBottom: 16 },
    logo: { fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 1, cursor: "pointer", color: "#fff" },
    card: { background: "var(--s1)", border: "1px solid var(--brd)", borderRadius: 12 },
    sel: { borderColor: "rgba(255,225,53,.35)", background: "rgba(255,225,53,.04)" },
    label: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--dim)", margin: "16px 0 8px" },
    btnP: { background: "linear-gradient(135deg,var(--acc),var(--acc2))", color: "#06060f", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Montserrat'", boxShadow: "0 4px 16px rgba(255,225,53,.25)", transition: "all .2s" },
    btnS: { background: "rgba(255,255,255,.04)", border: "1px solid var(--brd)", color: "#bbb", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Montserrat'" },
    chip: (on) => ({ padding: "6px 12px", borderRadius: 18, fontSize: 11, fontWeight: 600, cursor: "pointer", border: on ? "1px solid rgba(255,225,53,.45)" : "1px solid var(--brd)", background: on ? "rgba(255,225,53,.08)" : "transparent", color: on ? "var(--acc)" : "var(--mid)", whiteSpace: "nowrap", transition: "all .15s" }),
    tabS: (on) => ({ padding: "7px 16px", borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: "pointer", color: on ? "var(--acc)" : "var(--dim)", background: on ? "rgba(255,225,53,.08)" : "transparent", border: on ? "1px solid rgba(255,225,53,.2)" : "1px solid transparent", whiteSpace: "nowrap" }),
  };

  // ═══════════════════════════════════════════════════════════
  // UPLOAD
  // ═══════════════════════════════════════════════════════════
  if (screen === "upload") return (
    <div style={$.app}><div style={$.wrap}>
      <div style={$.hdr}><div style={$.logo}>✂️ ClipForge<span style={{ color: "var(--acc)" }}>AI</span></div></div>

      <div style={{ textAlign: "center", padding: "40px 0 24px" }}>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 2, margin: 0, background: "linear-gradient(135deg,#fff 30%,var(--acc))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VIDEO → CLIPS VIRALES</h1>
        <p style={{ color: "var(--dim)", fontSize: 14, marginTop: 8 }}>Sube tu video → IA genera subtítulos + clips → edita → exporta</p>
      </div>

      <div onClick={() => fileRef.current?.click()} onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
        style={{ ...$.card, padding: "44px 20px", textAlign: "center", cursor: "pointer", borderStyle: "dashed", borderColor: dragging ? "var(--acc)" : videoFile ? "rgba(255,225,53,.35)" : undefined, background: dragging ? "rgba(255,225,53,.06)" : videoFile ? "rgba(255,225,53,.03)" : undefined, transition: "all .3s" }}>
        <input ref={fileRef} type="file" accept="video/*,.mp4,.mov,.webm,.m4v" style={{ display: "none" }} onChange={handleFile} />
        {videoFile ? (<>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--acc)" }}>{videoFile.name}</p>
          <p style={{ fontSize: 12, color: "var(--dim)" }}>{(videoFile.size / 1048576).toFixed(1)} MB{duration > 0 && ` • ${fmt(duration)}`}</p>
        </>) : (<>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{dragging ? "📥" : "📁"}</div>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{dragging ? "Suelta aquí" : "Arrastra o toca para subir video"}</p>
          <p style={{ fontSize: 12, color: "var(--dim)" }}>MP4, MOV, WebM</p>
        </>)}
      </div>

      {videoUrl && <div style={{ marginTop: 10, borderRadius: 12, overflow: "hidden", border: "1px solid var(--brd)", background: "#000" }}>
        <video ref={vidRef} src={videoUrl} playsInline preload="auto" onLoadedMetadata={onMeta} onError={onVidErr} onCanPlay={onCanPlay} style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} controls />
      </div>}

      {videoError && <p style={{ marginTop: 8, padding: "10px 16px", borderRadius: 10, background: "rgba(255,59,48,.08)", border: "1px solid rgba(255,59,48,.2)", color: "#FF3B30", fontSize: 12, textAlign: "center" }}>{videoError}</p>}
      {videoReady && !videoError && <p style={{ marginTop: 8, padding: "8px 16px", borderRadius: 10, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.15)", color: "#22c55e", fontSize: 12, textAlign: "center" }}>✅ Video listo — {fmt(duration)}</p>}

      <p style={$.label}>🎯 Plataforma</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{PLATFORMS.map(p => <div key={p.id} onClick={() => setPlatform(p.id)} style={$.chip(platform === p.id)}>{p.icon} {p.name} <span style={{ fontSize: 9, opacity: .5 }}>{p.ratio}</span></div>)}</div>

      <div style={{ textAlign: "center", marginTop: 28 }}><button style={{ ...$.btnP, opacity: videoReady ? 1 : .35, pointerEvents: videoReady ? "auto" : "none" }} onClick={process}>⚡ Procesar con IA</button></div>
    </div></div>
  );

  // ═══════════════════════════════════════════════════════════
  // PROCESSING
  // ═══════════════════════════════════════════════════════════
  if (screen === "processing") return (
    <div style={$.app}><div style={{ ...$.wrap, textAlign: "center", padding: "80px 16px" }}>
      <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite" }}>🧠</div>
      <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 1, margin: "0 0 6px" }}>{procMsg}</h2>
      <div style={{ maxWidth: 350, margin: "20px auto" }}>
        <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, width: `${procPct}%`, background: "linear-gradient(90deg,var(--acc),var(--acc2))", transition: "width .4s" }} />
        </div>
        <p style={{ fontSize: 12, color: "var(--acc)", marginTop: 6 }}>{procPct}%</p>
      </div>
    </div></div>
  );

  // ═══════════════════════════════════════════════════════════
  // EDITOR
  // ═══════════════════════════════════════════════════════════
  const viewS = selClip?.start || 0, viewE = selClip?.end || duration, viewD = viewE - viewS;
  const tlPct = viewD > 0 ? ((ct - viewS) / viewD) * 100 : 0;

  return (
    <div style={$.app}><div style={{ ...$.wrap, maxWidth: 1140 }}>
      <div style={$.hdr}>
        <div style={$.logo} onClick={() => setScreen("upload")}>✂️ ClipForge<span style={{ color: "var(--acc)" }}>AI</span></div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={$.chip(true)}>{curPlat.icon} {curPlat.name}</span>
          <span style={$.chip(false)}>{clips.length} clips</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14, alignItems: "start" }}>
        {/* LEFT */}
        <div>
          <div style={{ ...$.card, overflow: "hidden", position: "relative" }}>
            <div onClick={togglePlay} style={{ position: "relative", aspectRatio: "16/9", background: "#000", cursor: "pointer", overflow: "hidden" }}>
              {videoUrl && <video ref={vidRef} src={videoUrl} playsInline preload="auto" onLoadedMetadata={onMeta} onError={onVidErr} onCanPlay={onCanPlay} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} style={{ width: "100%", height: "100%", objectFit: "contain", filter: curFilter.css === "none" ? undefined : curFilter.css }} />}
              <Caption caption={curCap} time={ct} style={curStyle} font={font} color={color} platform={platform} />
              {safeZone && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", border: "2px dashed rgba(255,225,53,.15)" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: curPlat.safeTop * .05, background: "rgba(255,225,53,.05)", borderBottom: "1px dashed rgba(255,225,53,.2)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: curPlat.safeBot * .07, background: "rgba(255,225,53,.05)", borderTop: "1px dashed rgba(255,225,53,.2)" }} />
                <span style={{ position: "absolute", top: 3, right: 5, fontSize: 8, color: "rgba(255,225,53,.4)", fontWeight: 700 }}>{curPlat.name} Safe Zone</span>
              </div>}
              {!playing && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.2)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,225,53,.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(255,225,53,.4)" }}><span style={{ fontSize: 18, marginLeft: 2, color: "#06060f" }}>▶</span></div>
              </div>}
              <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,.7)", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, color: "var(--acc)" }}>{fmt(ct)}/{fmt(duration)}</span>
            </div>

            {/* Timeline */}
            <div style={{ padding: "8px 12px", borderTop: "1px solid var(--brd)" }}>
              <div onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seekTo(viewS + ((e.clientX - r.left) / r.width) * viewD); }} style={{ height: 36, borderRadius: 7, position: "relative", cursor: "crosshair", background: "rgba(255,255,255,.03)", overflow: "hidden" }}>
                {captions.filter(c => c.start >= viewS && c.end <= viewE).map(c => <div key={c.id} style={{ position: "absolute", bottom: 0, height: 6, left: `${((c.start - viewS) / viewD) * 100}%`, width: `${((c.end - c.start) / viewD) * 100}%`, background: curCap?.id === c.id ? "var(--acc)" : "rgba(255,255,255,.1)", borderRadius: 2 }} />)}
                <div style={{ position: "absolute", top: 0, bottom: 0, width: 2, left: `${Math.max(0, Math.min(100, tlPct))}%`, background: "var(--acc)", boxShadow: "0 0 6px rgba(255,225,53,.4)", zIndex: 5, pointerEvents: "none" }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--acc)", position: "absolute", top: -2, left: -3 }} /></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={$.btnS} onClick={togglePlay}>{playing ? "⏸" : "▶"}</button>
                  {selClip && <button style={$.btnS} onClick={() => seekTo(selClip.start)}>↩</button>}
                  <button style={{ ...$.btnS, color: safeZone ? "var(--acc)" : "var(--dim)" }} onClick={() => setSafeZone(!safeZone)}>📐</button>
                </div>
                <span style={{ fontSize: 10, color: "var(--dim)" }}>{captions.length} subs</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 12, overflowX: "auto" }}>
            {[["style", "🎨 Estilos"], ["font", "🔤 Fuente"], ["tools", "🛠 Herramientas"], ["clips", "💬 Subtítulos"], ["export", "📤 Exportar"]].map(([id, l]) =>
              <div key={id} style={$.tabS(tab === id)} onClick={() => setTab(id)}>{l}</div>
            )}
          </div>

          {/* Tab content */}
          {tab === "style" && <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginTop: 10 }}>
              {STYLES.map(s => <div key={s.id} onClick={() => setStyle(s.id)} style={{ ...$.card, ...(style === s.id ? $.sel : {}), padding: 10, textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: style === s.id ? "var(--acc)" : "#ccc", lineHeight: 1.2, marginBottom: 3 }}>{s.name.split(" ")[0]}</div>
                <div style={{ fontSize: 8, color: "var(--dim)" }}>{s.desc}</div>
              </div>)}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--dim)" }}>COLOR</span>
              {COLORS.map(c => <div key={c} onClick={() => setColor(c)} style={{ width: 22, height: 22, borderRadius: 6, background: c, cursor: "pointer", border: color === c ? "2px solid var(--acc)" : "2px solid transparent" }} />)}
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 22, height: 22, padding: 0, border: "none", borderRadius: 6, cursor: "pointer" }} />
            </div>
          </div>}

          {tab === "font" && <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 10, maxHeight: 250, overflow: "auto" }}>
            {FONTS.map(f => <div key={f.id} onClick={() => setFont(f.id)} style={{ ...$.card, ...(font === f.id ? $.sel : {}), padding: "10px 8px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontFamily: `'${f.family}'`, fontWeight: f.weight, fontSize: 16, color: font === f.id ? "var(--acc)" : "#ccc" }}>Abc</div>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>{f.name}</div>
            </div>)}
          </div>}

          {tab === "tools" && <div>
            <p style={$.label}>🎬 Filtros</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{FILTERS.map(f => <div key={f.id} onClick={() => setFilter(f.id)} style={$.chip(filter === f.id)}>{f.name}</div>)}</div>
            <p style={$.label}>⏩ Velocidad</p>
            <div style={{ display: "flex", gap: 6 }}>{SPEEDS.map(s => <div key={s} onClick={() => setSpeed(s)} style={$.chip(speed === s)}>{s}x</div>)}</div>
            <p style={$.label}>📱 Plataforma</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{PLATFORMS.map(p => <div key={p.id} onClick={() => setPlatform(p.id)} style={$.chip(platform === p.id)}>{p.icon} {p.name}</div>)}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              <button style={$.btnS} onClick={removeFillers}>✂️ Quitar muletillas</button>
              <button style={$.btnS} onClick={() => setSafeZone(!safeZone)}>📐 Safe Zone {safeZone ? "ON" : "OFF"}</button>
            </div>
          </div>}

          {tab === "clips" && <div style={{ ...$.card, maxHeight: 240, overflow: "auto", padding: 3, marginTop: 10 }}>
            {captions.filter(c => !selClip || (c.start >= selClip.start && c.end <= selClip.end)).map(c => (
              <div key={c.id} onClick={() => seekTo(c.start)} style={{ display: "flex", gap: 8, padding: "7px 9px", borderRadius: 7, cursor: "pointer", borderLeft: curCap?.id === c.id ? "3px solid var(--acc)" : "3px solid transparent", background: curCap?.id === c.id ? "rgba(255,225,53,.05)" : "transparent" }}>
                <span style={{ fontSize: 10, color: "var(--acc)", fontWeight: 600, whiteSpace: "nowrap", fontFamily: "monospace" }}>{fmt(c.start)}</span>
                {editCap === c.id ?
                  <input autoFocus defaultValue={c.text} onClick={e => e.stopPropagation()} onBlur={e => { setCaptions(p => p.map(x => x.id === c.id ? { ...x, text: e.target.value } : x)); setEditCap(null); }} onKeyDown={e => { if (e.key === "Enter") { setCaptions(p => p.map(x => x.id === c.id ? { ...x, text: e.target.value } : x)); setEditCap(null); } }} style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,225,53,.3)", borderRadius: 5, padding: "3px 7px", color: "#eee", fontSize: 12, fontFamily: "'Montserrat'", outline: "none" }} /> :
                  <span style={{ flex: 1, fontSize: 12, color: "#bbb", lineHeight: 1.4 }} onDoubleClick={e => { e.stopPropagation(); setEditCap(c.id); }}>{c.text}</span>
                }
              </div>
            ))}
          </div>}

          {tab === "export" && <div style={{ marginTop: 10 }}>
            <div style={{ ...$.card, padding: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>📤 Exportar Clips</p>
              <div style={{ padding: 10, borderRadius: 8, background: "rgba(255,225,53,.03)", border: "1px solid rgba(255,225,53,.08)", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "var(--mid)", margin: 0 }}>Estilo: <strong style={{ color: "#ddd" }}>{curStyle.name}</strong> • Fuente: <strong style={{ color: "#ddd" }}>{FONTS.find(f => f.id === font)?.name}</strong> • {curPlat.icon} {curPlat.name}</p>
              </div>

              {remotionRendering ? (
                <div style={{ textAlign: "center", padding: 16 }}>
                  <div style={{ fontSize: 28, marginBottom: 8, animation: "spin 1.5s linear infinite" }}>🎬</div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--acc)", margin: "0 0 4px" }}>Renderizando con Remotion...</p>
                  <p style={{ fontSize: 11, color: "var(--dim)", margin: 0 }}>Esto puede tardar 1-3 minutos la primera vez (compilación)</p>
                </div>
              ) : exporting ? (
                <div style={{ textAlign: "center", padding: 16 }}>
                  <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,.05)", overflow: "hidden", marginBottom: 8 }}><div style={{ height: "100%", borderRadius: 3, width: `${exportPct}%`, background: "linear-gradient(90deg,var(--acc),var(--acc2))", transition: "width .3s" }} /></div>
                  <p style={{ fontSize: 12, color: "var(--acc)" }}>Renderizando... {exportPct}%</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {clips.map((clip, i) => (
                    <div key={clip.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "10px 12px", borderRadius: 10, background: "var(--s1)", border: "1px solid var(--brd)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--acc)" }}>#{i + 1}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: clip.score >= 80 ? "#22c55e" : "var(--acc)" }}>🔥{clip.score}</span>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#ccc", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.title}</p>
                        <p style={{ fontSize: 10, color: "var(--dim)", margin: 0 }}>{fmt(clip.start)}→{fmt(clip.end)} • {Math.round(clip.end - clip.start)}s</p>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        <button style={{ ...$.btnS, padding: "7px 10px", fontSize: 11 }} onClick={() => exportClip(clip)}>⬇ WebM</button>
                        <button style={{ ...$.btnP, padding: "7px 10px", fontSize: 11 }} onClick={() => exportWithRemotion(clip)}>🎬 MP4</button>
                      </div>
                    </div>
                  ))}
                  {clips.length > 1 && <button style={{ ...$.btnP, width: "100%" }} onClick={async () => { for (const c of clips) await exportClip(c); }}>⚡ Exportar todos WebM ({clips.length})</button>}
                </div>
              )}
            </div>

            {exported.length > 0 && <div style={{ ...$.card, padding: 14, marginTop: 8 }}>
              <p style={$.label}>✅ Listos para descargar ({exported.length})</p>
              {exported.map(exp => (
                <div key={exp.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--brd)", background: "var(--s1)", marginBottom: 8 }}>
                  <video src={exp.url} playsInline controls style={{ width: "100%", maxHeight: 180, objectFit: "contain", display: "block", background: "#000" }} />
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#ddd", margin: "0 0 4px" }}>{exp.title}</p>
                    <p style={{ fontSize: 10, color: "var(--dim)", margin: "0 0 8px" }}>{Math.round(exp.dur)}s • {PLATFORMS.find(p => p.id === exp.platform)?.name}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...$.btnP, flex: 1, padding: 8, fontSize: 12 }} onClick={() => downloadFile(exp)}>⬇ Descargar .webm</button>
                      <button style={{ ...$.btnS, flex: 1 }} onClick={() => { const c = clips.find(x => x.id === exp.clipId); if (c) copy(c.suggestedCaption + "\n\n" + (c.tags || []).map(t => t.startsWith("#") ? t : `#${t}`).join(" ")); }}>📋 Caption</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>}
          </div>}
        </div>

        {/* RIGHT */}
        <div>
          <p style={{ ...$.label, marginTop: 0 }}>✂️ Clips Virales</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: chatOpen ? 220 : 420, overflow: "auto" }}>
            {clips.map((clip, i) => (
              <div key={clip.id} onClick={() => { setSelClip(clip); seekTo(clip.start); }} style={{ ...$.card, ...(selClip?.id === clip.id ? $.sel : {}), padding: 12, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--acc)" }}>#{i + 1}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: clip.score >= 80 ? "rgba(34,197,94,.08)" : "rgba(255,225,53,.08)", color: clip.score >= 80 ? "#22c55e" : "var(--acc)", border: `1px solid ${clip.score >= 80 ? "rgba(34,197,94,.2)" : "rgba(255,225,53,.2)"}` }}>🔥 {clip.score}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#ddd", margin: "0 0 3px" }}>{clip.title}</p>
                <p style={{ fontSize: 10, color: "var(--dim)", margin: 0 }}>⏱ {fmt(clip.start)}–{fmt(clip.end)} • {Math.round(clip.end - clip.start)}s</p>
                {selClip?.id === clip.id && <>
                  <p style={{ fontSize: 11, color: "var(--mid)", margin: "6px 0", fontStyle: "italic", lineHeight: 1.4 }}>{clip.reason}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                    {clip.tags?.map(t => <span key={t} style={{ fontSize: 9, color: "var(--acc)", background: "rgba(255,225,53,.06)", padding: "2px 7px", borderRadius: 8, fontWeight: 500 }}>{t.startsWith("#") ? t : `#${t}`}</span>)}
                  </div>
                  {clip.suggestedCaption && <div style={{ ...$.card, padding: 8, background: "rgba(255,255,255,.015)", marginBottom: 6 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "var(--dim)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>Caption</p>
                    <p style={{ fontSize: 11, color: "var(--mid)", margin: 0, lineHeight: 1.4 }}>{clip.suggestedCaption}</p>
                  </div>}
                  <button style={{ ...$.btnS, width: "100%", marginTop: 4 }} onClick={e => { e.stopPropagation(); copy(clip.suggestedCaption + "\n" + (clip.tags || []).join(" ")); }}>📋 Copiar todo</button>
                  <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
                    <button style={{ ...$.btnS, flex: 1, padding: 8, fontSize: 11 }} onClick={e => { e.stopPropagation(); exportClip(clip); }}>⬇ WebM</button>
                    <button style={{ ...$.btnP, flex: 1, padding: 8, fontSize: 11 }} onClick={e => { e.stopPropagation(); exportWithRemotion(clip); }}>🎬 MP4</button>
                  </div>
                </>}
              </div>
            ))}
          </div>

          {/* AI Chat */}
          <div style={{ marginTop: 10 }}>
            <div style={{ ...$.card, padding: "8px 12px", cursor: "pointer" }} onClick={() => setChatOpen(!chatOpen)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>💬 Editor IA</span>
                <span style={{ fontSize: 10, color: "var(--dim)" }}>{chatOpen ? "▲" : "▼"}</span>
              </div>
            </div>
            {chatOpen && <div style={{ ...$.card, borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 8 }}>
              <div style={{ maxHeight: 150, overflow: "auto", marginBottom: 6 }}>
                {chatMsgs.length === 0 && <p style={{ fontSize: 11, color: "var(--dim)", textAlign: "center", padding: 12 }}>Ej: &quot;Cambia a neon&quot;, &quot;Usa Bangers&quot;, &quot;Filtro cinematic&quot;</p>}
                {chatMsgs.map((m, i) => <div key={i} style={{ padding: "5px 8px", borderRadius: 7, marginBottom: 3, background: m.role === "user" ? "rgba(255,225,53,.06)" : "rgba(255,255,255,.02)", borderLeft: m.role === "user" ? "2px solid var(--acc)" : "2px solid rgba(107,53,255,.3)" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: m.role === "user" ? "var(--acc)" : "#a78bfa" }}>{m.role === "user" ? "Tú" : "IA"}</span>
                  <p style={{ fontSize: 11, margin: "2px 0 0", lineHeight: 1.4, color: "#bbb" }}>{m.text}</p>
                </div>)}
                <div ref={chatEndRef} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Escribe instrucción..." style={{ flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid var(--brd)", borderRadius: 7, padding: "7px 10px", color: "#eee", fontSize: 12, fontFamily: "'Montserrat'", outline: "none" }} />
                <button style={{ ...$.btnP, padding: "7px 14px", fontSize: 12 }} onClick={sendChat}>→</button>
              </div>
            </div>}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button style={$.btnS} onClick={() => { setScreen("upload"); setVideoFile(null); setVideoUrl(null); setCaptions([]); setClips([]); setSelClip(null); setExported([]); }}>← Nuevo video</button>
      </div>
    </div>

    {toast && <div onClick={() => setToast(null)} style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#16162a", color: "#eee", padding: "10px 22px", borderRadius: 11, fontSize: 12, fontWeight: 500, fontFamily: "'Montserrat'", boxShadow: "0 8px 28px rgba(0,0,0,.5)", border: "1px solid rgba(255,225,53,.12)", cursor: "pointer", animation: "slideUp .3s ease-out" }}>{toast}</div>}
    </div>
  );
}
