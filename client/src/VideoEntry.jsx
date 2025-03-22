import { Box, Typography, Button } from "@mui/joy";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import VideoContext from "./VideoProvider";

const VideoEntry = function({videoData, orderingNumber}) {
  const navigate = useNavigate();
  const {setSelectedVideo} = useContext(VideoContext);

  const minutes = Math.floor(videoData.durationSec / 60);
  const seconds = Math.floor(videoData.durationSec - minutes * 60);
  const durationString = `${minutes}:${seconds}`


  return (
    <Box>
      <Box sx={{display: 'flex', gap: 4}}>
        <Typography level="h2" color="primary" sx={{width: 16}}>{orderingNumber}.</Typography>
        <Box>
          <Typography 
            level="h2" 
            color="primary" 
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => {
              setSelectedVideo(videoData);
              navigate(`/video/${videoData.id}`)
            }
            }
            >{videoData.title}</Typography>
          <Typography>Duration: {durationString}</Typography>
        </Box>
        {/* <Button variant="outlined" size="lg" sx={{maxHeight: '32px', mt: 1.25, ml: 4}} startDecorator={<PlayCircleIcon/>} >Watch</Button> */}
      </Box>
    </Box>
  )
}
export default VideoEntry;