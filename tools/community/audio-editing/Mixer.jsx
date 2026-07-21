import React from "react";
export default function Mixer({engine}){
  return (
    <div className="mixer">
      <div style={{display:'flex',gap:12,alignItems:'end',width:'100%'}}>
        <div className="fader">
          <div className="small">Master</div>
          <input type="range" min="0" max="1" defaultValue="0.8" step="0.01" onChange={e=>{
            if(engine && engine.master) engine.master.gain.value = Number(e.target.value);
          }}/>
        </div>
        <div className="fader">
          <div className="small">Delay</div>
          <input type="range" min="0" max="0.9" defaultValue="0.25" step="0.01" onChange={e=>{
            if(engine && engine.delay) engine.delay.delayTime.value = Number(e.target.value);
          }}/>
        </div>
      </div>
    </div>
  );
}
