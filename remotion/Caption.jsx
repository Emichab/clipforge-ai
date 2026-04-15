import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

const FONTS = [
  { id: "montserrat", name: "Montserrat Black", family: "Montserrat", weight: 900 },
  { id: "bebas", name: "Bebas Neue", family: "Bebas Neue", weight: 400 },
  { id: "oswald", name: "Oswald Bold", family: "Oswald", weight: 700 },
  { id: "poppins", name: "Poppins Black", family: "Poppins", weight: 900 },
  { id: "righteous", name: "Righteous", family: "Righteous", weight: 400 },
  { id: "bangers", name: "Bangers", family: "Bangers", weight: 400 },
  { id: "marker", name: "Permanent Marker", family: "Permanent Marker", weight: 400 },
  { id: "anton", name: "Anton", family: "Anton", weight: 400 },
  { id: "russo", name: "Russo One", family: "Russo One", weight: 400 },
  { id: "blackops", name: "Black Ops One", family: "Black Ops One", weight: 400 },
  { id: "bungee", name: "Bungee", family: "Bungee", weight: 400 },
  { id: "passion", name: "Passion One", family: "Passion One", weight: 900 },
  { id: "archivo", name: "Archivo Black", family: "Archivo Black", weight: 400 },
  { id: "lilita", name: "Lilita One", family: "Lilita One", weight: 400 },
];

export const STYLES = [
  { id: "bold-behind", name: "Bold Text Behind", bg: false, size: 64, up: true, stroke: true, sCol: "#000", sW: 4, shadow: "0 6px 30px rgba(0,0,0,.8)", hl: true, hlCol: "#FFE135", pos: "center", anim: "scaleIn" },
  { id: "gradient-center", name: "Gradient Center", bg: false, size: 48, up: true, stroke: true, sCol: "#000", sW: 3, shadow: "0 4px 20px rgba(0,0,0,.6)", hl: false, grad: ["#FFE135", "#FF6B35"], pos: "center", anim: "slideUp" },
  { id: "multi-pos", name: "Multi Position", bg: false, size: 42, up: true, stroke: true, sCol: "#000", sW: 3, shadow: "0 4px 20px rgba(0,0,0,.6)", hl: true, hlCol: "#00F5FF", pos: "center", anim: "pop" },
  { id: "minimal-box", name: "Minimal Box", bg: true, bgCol: "rgba(0,0,0,.75)", size: 28, up: false, stroke: false, sW: 0, shadow: "none", hl: true, hlCol: "#FFE135", pos: "bottom", anim: "fadeIn", rad: 8 },
  { id: "neon-glow", name: "Neon Glow", bg: false, size: 44, up: true, stroke: false, sW: 0, shadow: "0 0 20px #0ff,0 0 40px #0ff50", hl: true, hlCol: "#FF00E5", glow: "#00F5FF", pos: "center", anim: "glow" },
  { id: "karaoke", name: "Karaoke Wave", bg: true, bgCol: "rgba(0,0,0,.8)", size: 32, up: false, stroke: false, sW: 0, shadow: "none", hl: false, dimCol: "rgba(255,255,255,.25)", actCol: "#fff", pos: "bottom", anim: "wipe", rad: 10 },
  { id: "retro-vhs", name: "Retro VHS", bg: false, size: 40, up: true, stroke: true, sCol: "#000", sW: 2, shadow: "2px 2px 0 #FF3366,-2px -2px 0 #00FF88", hl: true, hlCol: "#FF3366", pos: "center", anim: "glitch" },
  { id: "magazine", name: "Magazine", bg: true, bgCol: "rgba(10,10,10,.9)", size: 26, up: true, stroke: false, sW: 0, shadow: "none", hl: true, hlCol: "#E8E073", pos: "bottom", anim: "slideUp", ls: 6, rad: 0 },
  { id: "fire-bold", name: "Fire Bold", bg: false, size: 56, up: true, stroke: true, sCol: "#000", sW: 4, shadow: "0 4px 30px rgba(255,107,53,.5)", hl: true, hlCol: "#FFD700", grad: ["#FF6B35", "#FF3366"], pos: "center", anim: "bounce" },
  { id: "takeone", name: "TakeOne Pro", bg: true, bgCol: "rgba(0,0,0,.65)", size: 30, up: false, stroke: false, sW: 0, shadow: "0 2px 10px rgba(0,0,0,.5)", hl: true, hlCol: "#6C5CE7", pos: "bottom", anim: "fadeIn", rad: 12 },
];

export function CaptionOverlay({ caption, time, styleId, fontId, color, width, height }) {
  if (!caption) return null;

  const st = STYLES.find((s) => s.id === styleId) || STYLES[0];
  const f = FONTS.find((x) => x.id === fontId) || FONTS[0];

  const words = caption.text.split(" ");
  const dur = caption.end - caption.start;
  const wDur = dur / Math.max(words.length, 1);
  const elapsed = time - caption.start;

  const fontSize = st.size * (width / 1080) * 0.42;

  const posStyle = {
    position: "absolute",
    left: "50%",
    transform: st.pos === "center"
      ? "translate(-50%, -50%)"
      : "translateX(-50%)",
    ...(st.pos === "bottom" && { bottom: Math.round(height * 0.05) }),
    ...(st.pos === "top" && { top: Math.round(height * 0.05) }),
    ...(st.pos === "center" && { top: "50%" }),
    maxWidth: "90%",
    textAlign: "center",
    zIndex: 10,
    padding: st.bg ? "12px 20px" : "4px",
    background: st.bg ? (st.bgCol || "rgba(0,0,0,.7)") : "transparent",
    borderRadius: st.rad || 0,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0 6px",
  };

  return (
    <div style={posStyle}>
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

        const wordStyle = {
          display: "inline-block",
          fontSize,
          fontFamily: `'${f.family}', sans-serif`,
          fontWeight: f.weight,
          color: c,
          textTransform: st.up ? "uppercase" : "none",
          letterSpacing: st.ls || 1,
          textShadow: ts,
          WebkitTextStroke: st.stroke ? `${st.sW * (width / 1080) * 0.4}px ${st.sCol}` : "none",
          paintOrder: st.stroke ? "stroke fill" : "normal",
          ...(current && st.anim === "scaleIn" && { transform: "scale(1.2)" }),
          ...(current && st.anim === "pop" && { transform: "scale(1.18) translateY(-2px)" }),
          ...(current && st.anim === "bounce" && { transform: "translateY(-4px) scale(1.12)" }),
          ...(!active && st.anim === "fadeIn" && { opacity: 0.3 }),
          ...(current && st.anim === "glow" && { filter: "brightness(1.4)" }),
        };

        let gradStyle = {};
        if (st.grad && !current && active) {
          gradStyle = {
            background: `linear-gradient(135deg,${st.grad[0]},${st.grad[1]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          };
        }

        return (
          <span key={wi} style={{ ...wordStyle, ...gradStyle }}>
            {word}
          </span>
        );
      })}
    </div>
  );
}
