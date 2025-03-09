"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pageStart = performance.now();
    const app = new PIXI.Application();

    let cancelled = false;

    const init = async () => {
      await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
      });

      if (cancelled) return;

      container.innerHTML = "";
      container.appendChild(app.canvas);

      // 측정 목적이면 reset 유지(캐시 영향 제거)
      PIXI.Assets.reset();
      PIXI.Assets.add({
        alias: "spineJson",
        src: "/spineboy/spineboy-pro.json",
      });
      PIXI.Assets.add({
        alias: "spineAtlas",
        src: "/spineboy/spineboy-pro.atlas",
      });

      // A) 에셋 준비(다운로드 + 파싱/디코딩 등 포함)
      const assetStart = performance.now();
      await PIXI.Assets.load(["spineJson", "spineAtlas"]);
      const assetEnd = performance.now();

      // bytes(전송량)는 여기서 못 뽑아. ResourceTiming이 Spine 로더에서 안 잡힐 때가 많아서.
      // 일단 Lottie랑 같은 로그 포맷은 맞추고, bytes는 null 처리.
      console.log(
        "[Spine] Asset ready time:",
        (assetEnd - assetStart).toFixed(1),
        "ms",
        { bytes: null as number | null }
      );

      if (cancelled) return;

      // B) 런타임 인스턴스 생성 비용(Spine.from)
      const buildStart = performance.now();
      const spineboy = Spine.from({
        skeleton: "spineJson",
        atlas: "spineAtlas",
        scale: 1,
      });
      const buildEnd = performance.now();

      console.log(
        "[Spine] Runtime build time:",
        (buildEnd - buildStart).toFixed(1),
        "ms"
      );

      spineboy.position.set(app.screen.width / 2, app.screen.height / 2 + 200);
      spineboy.state.setAnimation(0, "run", true);
      app.stage.addChild(spineboy);

      // C) 첫 렌더(체감)
      requestAnimationFrame(() => {
        if (cancelled) return;
        console.log(
          "[Spine] First render painted:",
          (performance.now() - pageStart).toFixed(1),
          "ms"
        );
      });
    };

    void init();

    return () => {
      cancelled = true;
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Spine v8</h1>
      <div
        ref={containerRef}
        style={{ width: 800, height: 600, margin: "0 auto" }}
      />
    </div>
  );
}
