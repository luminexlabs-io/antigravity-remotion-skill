import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, Spark, WordReveal } from "../components/Motion";

export const TitleScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame / 30) * 3; // idle breathing
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 48, // px, never em, next to big type
          transform: `translateY(${float}px)`,
        }}
      >
        <Spark size={180} delay={0} />
        <WordReveal
          text="Your headline goes here."
          heroWord="here."
          delay={Math.round(fps * 0.3)}
          per={4}
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 120,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: theme.colors.text,
            maxWidth: 1500,
          }}
        />
      </AbsoluteFill>
    </SceneExit>
  );
};
