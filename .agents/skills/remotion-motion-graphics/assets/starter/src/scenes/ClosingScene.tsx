import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit } from "../components/Motion";

export const ClosingScene: React.FC<{ duration: number }> = ({ duration }) => {
  const { fps } = useVideoConfig();
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28 }}>
        <Entrance delay={0}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, color: theme.colors.text }}>
            Call to action
          </div>
        </Entrance>
        <Entrance delay={Math.round(fps * 0.25)}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 40, color: theme.colors.textDim }}>
            subtitle or handle
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};
