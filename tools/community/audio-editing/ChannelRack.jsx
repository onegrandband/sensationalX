import React, { useState, useEffect } from "react";

const tracks = ['kick','snare','hat'];

export default function ChannelRack({engine}){
  const [,setTick] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setTick(t=>t+1), 200);
    return ()=>clearInterval(t);
  },[]);
  if(!engine) return <div className="channel-rack">Loading engine...</div>;
  return (
    <div className="channel-rack">
      {tracks.map(track => (
        <div className="channel" key={track}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <strong>{track}</strong>
            <input type="range" min="0.1" max="2" step="0.01" defaultValue="1" onChange={(e)=>{/* placeholder for pitch/decay */}}/>
          </div>
          <div className="step-grid">
            {engine.pattern[track].map((on, i)=>(
              <div key={i} className={`step ${on?'on':''}`} onClick={()=>{engine.toggleStep(track,i);}}>
                {i+1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
