"use client";

import education from "../../education.json";
import Link from "next/link";
import { LottieSvg } from "../../LottieSvg";

export default function Page() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>svg render</h1>
      <LottieSvg
        animationData={education}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
      <LottieSvg
        animationData={education}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
      <LottieSvg
        animationData={education}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
      <LottieSvg
        animationData={education}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
      <LottieSvg
        animationData={education}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
      <Link href="/lottie/canvas" style={{ border: "1px solid #ddd" }}>
        canvas renderer
      </Link>
    </div>
  );
}
