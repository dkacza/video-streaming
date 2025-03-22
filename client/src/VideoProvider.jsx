import { createContext, useEffect, useState } from "react"; 

export const BACKEND_URL = 'http://localhost:3000'

const VideoContext = createContext(null);
export function VideoProvider(props) {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null)

  const fetchVideoList = async function() {
    try {
      const response = await fetch(BACKEND_URL);
      const body = await response.json();
      setVideos(body);
    } catch (e) {
      console.error(e);
    }
  }
  

  useEffect(() => {
    fetchVideoList();
  }, [])

  const videoContexValues = {
    videos,
    selectedVideo,
    setSelectedVideo
  };
  return <VideoContext.Provider value={videoContexValues}>{props.children}</VideoContext.Provider>
}
export default VideoContext;