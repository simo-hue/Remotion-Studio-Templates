import { Composition, Folder } from "remotion";
import { BarLineChart } from "./compositions/BarLineChart";
import { MyComposition } from "./compositions/HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Charts">
        <Composition
          id="BarLineChart"
          component={BarLineChart}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Demos">
        <Composition
          id="HelloWorld"
          component={MyComposition}
          durationInFrames={60}
          fps={30}
          width={1280}
          height={720}
        />
      </Folder>
    </>
  );
};
