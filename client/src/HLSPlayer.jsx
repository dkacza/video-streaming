import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const HLSPlayer = () => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null); // Store HLS instance
    const hlsSrc = "http://localhost:3000/data/master.m3u8"; // Your HLS URL

    const [levels, setLevels] = useState([]); // Quality levels
    const [selectedQuality, setSelectedQuality] = useState("auto"); // "auto" or specific index
    const [isAuto, setIsAuto] = useState(true); // Auto bitrate control
    const [currentQuality, setCurrentQuality] = useState("Auto"); // Displayed quality

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(hlsSrc);
            hls.attachMedia(videoRef.current);
            hlsRef.current = hls; // Store HLS instance
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current.play();
                setLevels(hls.levels.map((level, index) => ({
                    index, height: level.height
                })));
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
    }, []);

    // Change video quality
    const handleQualityChange = (event) => {
        const value = event.target.value;
        setSelectedQuality(value);
        
        if (hlsRef.current) {
            if (value === "auto") {
                setIsAuto(true);
                hlsRef.current.currentLevel = -1; // Enable automatic quality
                setCurrentQuality("Auto");
            } else {
                setIsAuto(false);
                const levelIndex = parseInt(value, 10);
                hlsRef.current.currentLevel = levelIndex; // Set specific quality
                setCurrentQuality(`${hlsRef.current.levels[levelIndex].height}p`);
            }
        }
    };

    return (
      <div>
        <video ref={videoRef} controls width="100%" />

        <div>
          <label>Select Quality:</label>
          <select value={selectedQuality} onChange={handleQualityChange}>
            <option value="auto">Automatic</option>
            {levels.map(({ index, height }) => (
              <option key={index} value={index}>{height}p</option>
            ))}
          </select>
        </div>

        <div>🎥 Current Quality: {currentQuality}</div>
      </div>
    );
};

export default HLSPlayer;
