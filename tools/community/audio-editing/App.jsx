import React, { useEffect, useState, useRef } from "react";
import { AudioEngine } from "./audio/engine.js";
import Toolbar from "./components/Toolbar.jsx";
import Browser from "./components/Browser.jsx";
import ChannelRack from "./components/ChannelRack.jsx";
import PianoRoll from "./components/PianoRoll.jsx";
import Mixer from "./components/Mixer.jsx";

export default function App(){
  const engineRef = useRef(null);
  const [bpm,setBpm] = useState(120);
  const [isPlaying,setPlaying] = useState(false);
  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.setBPM(bpm);
    return () => engineRef.current.dispose();
  }, []);
  useEffect(()=>{ if(engineRef.current) engineRef.current.setBPM(bpm); },[bpm]);

  return (
    <div id="app">
      <Toolbar bpm={bpm} setBpm={setBpm} isPlaying={isPlaying} setPlaying={async val=>{
        if(val){ await engineRef.current.resume(); engineRef.current.start(); }
        else engineRef.current.stop();
        setPlaying(val);
      }} stop={()=>{
        engineRef.current.stop(true); setPlaying(false);
      }}/>
      <div className="main">
        <div className="sidebar">
          <Browser />
        </div>
        <div className="center">
          <ChannelRack engine={engineRef.current}/>
          <div style={{flex:1,display:'flex',minHeight:0}}>
            <PianoRoll engine={engineRef.current}/>
          </div>
          <Mixer engine={engineRef.current}/>
        </div>
      </div>
    </div>
  );
}
