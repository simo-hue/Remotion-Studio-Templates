import { Composition, Folder } from "remotion";
import { BarLineChart } from "./compositions/BarLineChart";
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
    </>
  );
};
