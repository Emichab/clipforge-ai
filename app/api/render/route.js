import { NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import os from "os";

export const runtime = "nodejs";
export const maxDuration = 300;

// Cache the bundle URL after first compilation — subsequent renders skip the webpack step
let bundleCache = null;

async function getBundle() {
  if (!bundleCache) {
    const entryPoint = path.join(process.cwd(), "remotion", "index.jsx");
    bundleCache = await bundle({ entryPoint });
  }
  return bundleCache;
}

export async function POST(req) {
  let publicVideoPath = null;
  let outputPath = null;

  try {
    const formData = await req.formData();
    const videoFile = formData.get("video");
    const paramsStr = formData.get("params");

    if (!videoFile || !paramsStr) {
      return NextResponse.json({ error: "Missing video or params" }, { status: 400 });
    }

    const params = JSON.parse(paramsStr);
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

    // Save the uploaded video to public/tmp-videos/ so Remotion's Chromium can fetch it
    const videoId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const rawName = videoFile.name || "upload.mp4";
    const ext = rawName.split(".").pop().toLowerCase() || "mp4";
    const publicDir = path.join(process.cwd(), "public", "tmp-videos");
    await mkdir(publicDir, { recursive: true });
    publicVideoPath = path.join(publicDir, `${videoId}.${ext}`);
    await writeFile(publicVideoPath, videoBuffer);

    // Build the HTTP URL for the video (accessible to Remotion's headless browser)
    const reqUrl = new URL(req.url);
    const videoUrl = `${reqUrl.origin}/tmp-videos/${videoId}.${ext}`;

    // Build Remotion input props
    const inputProps = {
      videoSrc: videoUrl,
      captions: params.captions || [],
      clipStart: typeof params.clipStart === "number" ? params.clipStart : 0,
      clipEnd: typeof params.clipEnd === "number" ? params.clipEnd : 10,
      style: params.style || "bold-behind",
      font: params.font || "montserrat",
      color: params.color || "#FFFFFF",
      platform: params.platform || "tiktok",
      filter: params.filter || "none",
    };

    // Get (or compile) the Remotion bundle
    const serveUrl = await getBundle();

    // Resolve the composition (this also triggers calculateMetadata for dimensions/duration)
    const composition = await selectComposition({
      serveUrl,
      id: "CaptionedClip",
      inputProps,
    });

    // Output to OS temp directory
    outputPath = path.join(os.tmpdir(), `clipforge-${videoId}.mp4`);

    // Render to MP4
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
    });

    // Stream the rendered file back to the client
    const renderedBuffer = await readFile(outputPath);

    return new Response(renderedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="clip_${videoId}.mp4"`,
        "Content-Length": String(renderedBuffer.length),
      },
    });
  } catch (error) {
    console.error("[/api/render] Error:", error);
    // Invalidate bundle cache on error so next attempt recompiles
    bundleCache = null;
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Clean up temp files (fire-and-forget)
    if (publicVideoPath) unlink(publicVideoPath).catch(() => {});
    if (outputPath) unlink(outputPath).catch(() => {});
  }
}
