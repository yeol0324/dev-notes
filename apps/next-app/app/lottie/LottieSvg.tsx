import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

type LottieSvgProps = {
  animationData: unknown;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
};

export const LottieSvg = ({
  animationData,
  autoplay = true,
  loop = true,
  className,
  style,
  speed = 1,
}: LottieSvgProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    animationRef.current?.destroy();
    animationRef.current = null;

    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop,
      autoplay,
      animationData,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: "xMidYMid meet",
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
