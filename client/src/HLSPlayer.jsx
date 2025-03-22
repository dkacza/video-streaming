import React, { useContext, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import VideoContext, { BACKEND_URL } from "./VideoProvider";
import { useLocation } from "react-router-dom";
import { Box, Card, Typography, Select, Option } from "@mui/joy";

const HLSPlayer = () => {
    const { videos } = useContext(VideoContext);
    const location = useLocation();
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    let selectedVideo = null;
    if (location.pathname.startsWith("/video/")) {
        const selectedVideoId = location.pathname.split("/")[2];
        selectedVideo = videos.find((video) => video.id == selectedVideoId);
    }

    const hlsSrc = selectedVideo ? `${BACKEND_URL}/${selectedVideo.hlsMasterPath}` : "";
    
    const [levels, setLevels] = useState([]);
    const [selectedQuality, setSelectedQuality] = useState("auto");
    const [currentQuality, setCurrentQuality] = useState("Auto");

    useEffect(() => {
        if (!selectedVideo) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(hlsSrc);
            hls.attachMedia(videoRef.current);
            hlsRef.current = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current.play();
                setLevels(hls.levels.map((level, index) => ({ index, height: level.height })));
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                if (hls.levels[data.level]) {
                    setCurrentQuality(`${hls.levels[data.level].height}p`);
                }
            });

            return () => {
                hls.destroy();
            };
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = hlsSrc;
        }
    }, [videos]);

    // Update current quality dynamically when "auto" mode is enabled
    useEffect(() => {
        if (hlsRef.current && selectedQuality === "auto") {
            const interval = setInterval(() => {
                if (hlsRef.current && hlsRef.current.currentLevel !== -1) {
                    setCurrentQuality(`${hlsRef.current.levels[hlsRef.current.currentLevel].height}p`);
                }
            }, 1000); // Check every second

            return () => clearInterval(interval);
        }
    }, [selectedQuality]);

    // Change video quality
    const handleQualityChange = (_, value) => {
        setSelectedQuality(value);
        if (hlsRef.current) {
            if (value === "auto") {
                hlsRef.current.currentLevel = -1; // Auto quality
            } else {
                const levelIndex = parseInt(value, 10);
                hlsRef.current.currentLevel = levelIndex;
                setCurrentQuality(`${hlsRef.current.levels[levelIndex].height}p`);
            }
        }
    };

    return (
        <Box sx={{ padding: 4, maxWidth: "75%", margin: "auto" }}>
            <Card variant="outlined" sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <video ref={videoRef} controls width="100%" />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography level="body1">Select Quality:</Typography>
                    <Select value={selectedQuality} onChange={handleQualityChange} sx={{ minWidth: 120 }}>
                        <Option value="auto">Automatic</Option>
                        {levels.map(({ index, height }) => (
                            <Option key={index} value={index}>{height}p</Option>
                        ))}
                    </Select>
                </Box>

                <Typography level="body2">Current Quality: <b>{currentQuality}</b></Typography>
            </Card>
        </Box>
    );
};

export default HLSPlayer;
