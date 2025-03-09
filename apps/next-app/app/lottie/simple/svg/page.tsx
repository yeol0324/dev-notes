"use client";

import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

type FetchJsonResultType<T> = {
  data: T;
  bytes: number;
};

const fetchJson = async <T,>(url: string): Promise<FetchJsonResultType<T>> => {
  const res = await fetch(url, { cache: "no-store" });
  const buf = await res.arrayBuffer();

  const text = new TextDecoder().decode(buf);
  const data = JSON.parse(text) as T;

  return { data, bytes: buf.byteLength };
};

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pageStart = performance.now();
    let cancelled = false;

    const prepareAsset = async () => {
      const url = "/lottie/totoro-walk.json";

      const assetStart = performance.now();
      const { data, bytes } = await fetchJson<unknown>(url);
      const assetEnd = performance.now();

      console.log(
        "[Lottie SVG] Asset ready time:",
        (assetEnd - assetStart).toFixed(1),
        "ms",
        { bytes }
      );

      return data;
    };

    const buildRuntime = (animationData: unknown) => {
      const buildStart = performance.now();

      animationRef.current?.destroy();
      animationRef.current = null;

      const anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
          progressiveLoad: true,
          preserveAspectRatio: "xMidYMid meet",
        },
      });

      const buildEnd = performance.now();

      console.log(
        "[Lottie SVG] Runtime build time:",
        (buildEnd - buildStart).toFixed(1),
        "ms"
      );

      animationRef.current = anim;
      return anim;
    };

    const markFirstRender = () => {
      requestAnimationFrame(() => {
        console.log(
          "[Lottie SVG] First render painted:",
          (performance.now() - pageStart).toFixed(1),
          "ms"
        );
      });
    };

    (async () => {
      const animationData = await prepareAsset();
      if (cancelled) return;

      const anim = buildRuntime(animationData);
      if (cancelled) return;

      const onDomLoaded = () => {
        anim.removeEventListener("DOMLoaded", onDomLoaded);
        if (cancelled) return;
        markFirstRender();
      };

      anim.addEventListener("DOMLoaded", onDomLoaded);
    })();

    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Lottie SVG</h1>
      <div
        ref={containerRef}
        style={{ width: 665, height: 374, margin: "0 auto" }}
      />
    </div>
  );
}
