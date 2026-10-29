import React from "react";
import { AbsoluteFill, Composition, Sequence, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { TitleScene } from "./scenes/TitleScene";
import { ClosingScene } from "./scenes/ClosingScene";

loadDisplay();
loadBody();

// Edit these: all timing is in seconds, converted with fps.
const FPS = 30;
const SCENES = { title: 3, closing: 2.5 };
const TOTAL_S = SCENES.title + SCENES.closing;

const Main: React.FC = () => {
  const { fps } = useVideoConfig();
  const titleF = Math.round(fps * SCENES.title);
  const closingF = Math.round(fps * SCENES.closing);
  return (
    <AbsoluteFill>
      {/* layer 1: background mesh */}
      <BgMesh />
      {/* layers 2-3: assets + type, one Sequence per scene */}
      <Sequence durationInFrames={titleF}>
        <TitleScene duration={titleF} />
      </Sequence>
      <Sequence from={titleF} durationInFrames={closingF}>
        <ClosingScene duration={closingF} />
      </Sequence>
      {/* layer 4: grade; layer 5: grain + vignette on top */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={Math.round(FPS * TOTAL_S)}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
