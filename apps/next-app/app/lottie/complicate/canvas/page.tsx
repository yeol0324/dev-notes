"use client";

import education from "../../education.json";
import Link from "next/link";
import { LottieCanvas } from "../../LottieCanvas";

export default function Page() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>canvas render</h1>

      <LottieCanvas
        animationData={education}
        loop
        autoplay
        style={{ width: "665px", height: "374px" }}
      />
      <LottieCanvas
        animationData={education}
        loop
        autoplay
        style={{ width: "665px", height: "374px" }}
      />
      <LottieCanvas
        animationData={education}
        loop
        autoplay
        style={{ width: "665px", height: "374px" }}
      />
      <LottieCanvas
        animationData={education}
        loop
        autoplay
        style={{ width: "665px", height: "374px" }}
      />
      <LottieCanvas
        animationData={education}
        loop
        autoplay
        style={{ width: "665px", height: "374px" }}
      />
      <Link href="/lottie/svg" style={{ border: "1px solid #ddd" }}>
        svg renderer
      </Link>
    </div>
  );
}
