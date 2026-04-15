import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionOverlay } from "./Caption";

const FILTERS = [
  { id: "none", css: "none" },
  { id: "cinematic", css: "contrast(1.15) saturate(1.2) brightness(.95)" },
  { id: "warm", css: "sepia(.2) saturate(1.3) brightness(1.05)" },
  { id: "cold", css: "saturate(.8) brightness(1.05) hue-rotate(10deg)" },
  { id: "vintage", css: "sepia(.35) contrast(1.1) brightness(.9)" },
  { id: "bw", css: "grayscale(1) contrast(1.2)" },
  { id: "vibrant", css: "saturate(1.8) contrast(1.1)" },
];

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;700;900&family=Righteous&family=Bangers&family=Permanent+Marker&family=Anton&family=Russo+One&family=Black+Ops+One&family=Bungee&family=Passion+One:wght@400;700;900&family=Archivo+Black&family=Lilita+One&display=swap";

export function CaptionedClip({
  videoSrc,
  captions,
  clipStart,
  clipEnd,
  style,
  font,
  color,
  platform,
  filter,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const time = clipStart + frame / fps;
  const curCap = (captions || []).find((c) => time >= c.start && time < c.end);
  const curFilter = FILTERS.find((f) => f.id === filter) || FILTERS[0];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Load Google Fonts */}
      <style>{`@import url('${GOOGLE_FONTS_URL}');`}</style>

      {/* Video — startFrom offsets into source video at clipStart */}
      <OffthreadVideo
        src={videoSrc}
        startFrom={Math.round(clipStart * fps)}
        endAt={Math.round(clipEnd * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: curFilter.css !== "none" ? curFilter.css : undefined,
        }}
      />

      {/* Caption overlay */}
      {curCap && (
        <CaptionOverlay
          caption={curCap}
          time={time}
          styleId={style}
          fontId={font}
          color={color}
          width={width}
          height={height}
        />
      )}
    </AbsoluteFill>
  );
}
