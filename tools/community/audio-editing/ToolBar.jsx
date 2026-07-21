import React from "react";
export default function Toolbar({bpm,setBpm,isPlaying,setPlaying,stop}){
  return (
    <div className="toolbar">
      <button onClick={()=>setPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={()=>{ stop(); }}>Stop</button>
      <div className="bpm small">
        <label className="small">BPM</label>
        <input type="number" value={bpm} onChange={e=>setBpm(Number(e.target.value||120))} style={{width:80,background:'#0e0f12',color:'#fff',border:'1px solid #222',padding:'6px',borderRadius:6}}/>
      </div>
    </div>
  );
}
