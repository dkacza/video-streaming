import ViewTemplate from "./ViewTemplate";
import { Table, Box } from "@mui/joy";
import VideoEntry from "./VideoEntry";
import { useContext } from "react";
import VideoContext from "./VideoProvider";

const VideoGalleryView = function() {
  const {videos} = useContext(VideoContext);

  return (
    <ViewTemplate>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 4, padding: 4}}>
        {videos.map((video, key) => <VideoEntry key={key} videoData={video} orderingNumber={key + 1}/> )}
      </Box>
    </ViewTemplate>
  )
}
export default VideoGalleryView;