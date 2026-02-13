import { Composition, Folder } from "remotion";
import { BarLineChart } from "./compositions/BarLineChart";
import { ArticleHighlight } from "./compositions/ArticleHighlight";

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
      <Composition
        id="ArticleHighlight"
        component={ArticleHighlight}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
