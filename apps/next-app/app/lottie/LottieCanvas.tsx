import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

type LottieCanvasProps = {
  animationData: unknown;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
};

export const LottieCanvas = ({
  animationData,
  autoplay = true,
  loop = true,
  className,
  style,
  speed = 1,
}: LottieCanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    animationRef.current?.destroy();

    const animation = lottie.loadAnimation({
      container, // ✅ div
      renderer: "canvas",
      loop,
      autoplay,
      animationData,
      rendererSettings: {
        clearCanvas: true,
        progressiveLoad: true,
      },
    });

    animation.setSpeed(speed);
    animationRef.current = animation;

    return () => {
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [animationData, autoplay, loop, speed]);

  return <div ref={containerRef} className={className} style={style} />;
};
