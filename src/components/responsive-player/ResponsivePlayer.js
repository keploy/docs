import React, {Suspense, lazy} from "react";

// Lazy-load react-player so it is NOT included in the initial JS bundle.
// react-player/lazy defers loading the actual player implementation until
// the component is rendered, reducing the first-page-load JS payload.
const ReactPlayer = lazy(() => import("react-player/lazy"));

function ResponsivePlayer({url, loop, playing}) {
  return (
    <div
      className="relative rounded-lg shadow-lg"
      style={{paddingTop: "56.25%"}}
    >
      {/* Player ratio: 100 / (1280 / 720) */}
      <Suspense
        fallback={
          <div
            className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
            aria-label="Loading video player"
          />
        }
      >
        <ReactPlayer
          className="absolute left-0 top-0"
          url={url}
          loop={loop}
          playing={playing}
          width="100%"
          height="100%"
          controls={true}
        />
      </Suspense>
    </div>
  );
}

export default ResponsivePlayer;
