import React, { useEffect, useRef, useState } from "react";

const NOTES = ['C5','B4','A4','G4','F4','E4','D4','C4','B3','A3'];
function noteToHz(n){
  const map = {C5:523.25,B4:493.88,A4:440,G4:392,F4:349.23,E4:329.63,D4:293.66,C4:261.63,B3:246.94,A3:220};
  return map[n]||440;
}

export default function PianoRoll({engine}){
  const [notes,setNotes] = useState([]);
  const gridRef = useRef();
  useEffect(()=>{ if(!engine) return; },[engine]);
  const onGridClick = (e, rowIdx) => {
    if(!engine || !engine.ctx) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colWidth = 48;
    const col = Math.floor(x/colWidth);
    const step = col % 16;
    const time = engine.nextNoteTime > engine.ctx.currentTime ? engine.nextNoteTime : engine.ctx.currentTime + 0.05;
    const hz = noteToHz(NOTES[rowIdx]);
    setNotes(n=>[...n, {row:rowIdx,col, hz, step, time, len:1}]);
    engine.triggerSynth(hz, time, 0.5, 'saw');
  };

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <div style={{display:'flex',flex:1,minHeight:0}} className="piano-roll">
        <div className="piano-keys">
          {NOTES.map(n=> <div key={n} style={{height:28,display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid #161718'}}>{n}</div>)}
        </div>
        <div style={{flex:1,position:'relative',overflow:'auto'}} className="roll-grid" ref={gridRef}>
          <div style={{position:'relative',minWidth:16*48}}>
            {NOTES.map((n,rowIdx)=>(
              <div key={n} style={{height:28,display:'flex',alignItems:'center',borderBottom:'1px solid #161718'}} onClick={(e)=>onGridClick(e,rowIdx)}>
                <div style={{display:'grid',gridTemplateColumns:`repeat(${16},48px)`,gap:4,width:16*48}}>
                  {Array.from({length:16}).map((_,i)=>(<div key={i} style={{height:24}}></div>))}
                </div>
              </div>
            ))}
            {notes.map((note,idx)=>(
              <div key={idx} className="note" style={{left:note.col*48+8, top:note.row*28+4, width:48*note.len-8}} title="note"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
