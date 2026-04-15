import React from "react";
import { Composition, registerRoot } from "remotion";
import { CaptionedClip } from "./CaptionedClip";

const PLATFORMS = [
  { id: "tiktok", w: 1080, h: 1920 },
  { id: "instagram", w: 1080, h: 1920 },
  { id: "youtube", w: 1080, h: 1920 },
  { id: "twitter", w: 1920, h: 1080 },
  { id: "landscape", w: 1920, h: 1080 },
];

const defaultProps = {
  videoSrc: "",
  captions: [],
  clipStart: 0,
  clipEnd: 10,
  style: "bold-behind",
  font: "montserrat",
  color: "#FFFFFF",
  platform: "tiktok",
  filter: "none",
};

function RemotionRoot() {
  return (
    <Composition
      id="CaptionedClip"
      component={CaptionedClip}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={async ({ props }) => {
        const pl = PLATFORMS.find((p) => p.id === props.platform) || PLATFORMS[0];
        const fps = 30;
        const clipDuration = (props.clipEnd || 10) - (props.clipStart || 0);
        return {
          durationInFrames: Math.max(1, Math.ceil(clipDuration * fps)),
          fps,
          width: pl.w,
          height: pl.h,
        };
      }}
    />
  );
}

registerRoot(RemotionRoot);
