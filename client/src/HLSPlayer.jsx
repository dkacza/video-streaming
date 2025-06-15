import React, { useContext, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import VideoContext, { BACKEND_URL } from "./VideoProvider";
import { useLocation } from "react-router-dom";
// import { Box, Card, Typography, Select, Option, Slider } from "@mui/joy";
import { Accordion, AccordionSummary, AccordionDetails, Box, Grid, Typography, Card, Select, Option, Slider } from "@mui/joy";


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

    const handleChangeAbrBandWidthFactor = (event, newValue) => {
        hlsRef.current.config.abrBandWidthFactor = newValue;
    };
    const handleChangeAbrBandWidthUpFactor = (event, newValue) => {
        hlsRef.current.config.abrBandWidthUpFactor = newValue;
    };
    const handleChangeAbrEwmaFastLive = (event, newValue) => {
        hlsRef.current.config.abrEwmaFastLive = newValue;
    };
    const handleChangeAbrEwmaSlowLive = (event, newValue) => {
        hlsRef.current.config.abrEwmaSlowLive = newValue;
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


                <Accordion>
                    <AccordionSummary>Abr Settings</AccordionSummary>
                    <AccordionDetails>

                        <Grid container alignItems="center" sx={{ mb: 2, mt: 2 }}>
                            {/* https://www.webkitx.com/doc/light/WebKitXCEF3Lib~HLSSettings~abrBandWidthFactor.html */}
                            <Grid xs={3.3}><Typography level="title-sm">AbrBandWidthFactor</Typography></Grid>
                            <Grid xs={2.7}><Typography level="body-sm">Percentage of avg throughput</Typography></Grid>
                            <Grid xs={5.5}><Slider min={0.1} max={1.0} step={0.05} defaultValue={0.95} valueLabelDisplay="on" onChange={handleChangeAbrBandWidthFactor}></Slider></Grid>
                        </Grid>

                        <Grid container alignItems="center" sx={{ mb: 2 }}>
                            {/* https://www.webkitx.com/doc/light/WebKitXCEF3Lib~HLSSettings~abrBandWidthUpFactor.html */}
                            <Grid xs={3.3}><Typography level="title-sm">AbrBandWidthUpFactor</Typography></Grid>
                            <Grid xs={2.7}><Typography level="body-sm">Percentage of avg throughput when increasing quality</Typography></Grid>
                            <Grid xs={5.5}><Slider min={0.1} max={1.0} step={0.05} defaultValue={0.7} valueLabelDisplay="on" onChange={handleChangeAbrBandWidthUpFactor}></Slider></Grid>
                        </Grid>

                        <Grid container alignItems="center" sx={{ mb: 2 }}>
                            {/* https://www.webkitx.com/doc/light/WebKitXCEF3Lib~HLSSettings~abrEwmaFastLive.html */}
                            <Grid xs={3.3}><Typography level="title-sm">AbrEwmaFastLive</Typography></Grid>
                            <Grid xs={2.7}><Typography level="body-sm">Reaction speed to<br/>quality decrease<br/>(lower = faster)</Typography></Grid>
                            <Grid xs={5.5}><Slider min={0.5} max={15.0} step={0.5} defaultValue={3.0} valueLabelDisplay="on" onChange={handleChangeAbrEwmaFastLive}></Slider></Grid>
                        </Grid>

                        <Grid container alignItems="center" sx={{ mb: 2 }}>
                            {/* https://www.webkitx.com/doc/light/WebKitXCEF3Lib~HLSSettings~abrEwmaSlowLive.html */}
                            <Grid xs={3.3}><Typography level="title-sm">AbrEwmaSlowLive</Typography></Grid>
                            <Grid xs={2.7}><Typography level="body-sm">Reaction speed to<br/>quality increase<br/>(higher = slower)</Typography></Grid>
                            <Grid xs={5.5}><Slider min={0.5} max={15.0} step={0.5} defaultValue={9.0} valueLabelDisplay="on" onChange={handleChangeAbrEwmaSlowLive}></Slider></Grid>
                        </Grid>

                    </AccordionDetails>
                </Accordion>

            </Card>
        </Box>
    );
};

export default HLSPlayer;
