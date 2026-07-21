export class AudioEngine{
  constructor(){
    this.ctx = null;
    this.master = null;
    this.delay = null;
    this.bpm = 120;
    this.isPlaying = false;
    this.startTime = 0;
    this.loopLength = 1; // bars
    this.stepsPerBar = 16;
    this.scheduleAhead = 0.1;
    this.lookahead = 25;
    this.nextNoteTime = 0;
    this.currentStep = 0;
    this.schedulerTimer = null;
    // instruments state
    this.kit = { kick:[], snare:[], hat:[] };
    this.synthNotes = [];
    this.createContext();
    this.createInstruments();
    // default patterns
    this.pattern = {
      kick: new Array(16).fill(false),
      snare: new Array(16).fill(false),
      hat: new Array(16).fill(false)
    };
    this.pattern.kick[0]=this.pattern.kick[8]=true;
    this.pattern.snare[4]=this.pattern.snare[12]=true;
    for(let i=0;i<16;i+=2) this.pattern.hat[i]=true;
  }
  async createContext(){
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.delay = this.ctx.createDelay(1.0);
    this.delay.delayTime.value = 0.25;
    const feedback = this.ctx.createGain(); feedback.gain.value = 0.3;
    this.delay.connect(feedback); feedback.connect(this.delay);
    this.delay.connect(this.master);
    this.master.connect(this.ctx.destination);
  }
  async resume(){
    if(!this.ctx) await this.createContext();
    if(this.ctx.state === 'suspended') await this.ctx.resume();
  }
  createInstruments(){
    // simple synth voice factory
    this.voices = [];
  }
  setBPM(b){ this.bpm=b; }
  secondsPerBeat(){ return 60/this.bpm; }
  schedule(){
    if(!this.isPlaying) return;
    while(this.nextNoteTime < this.ctx.currentTime + this.scheduleAhead){
      const step = this.currentStep % this.stepsPerBar;
      const stepTime = this.nextNoteTime;
      // schedule drums
      if(this.pattern.kick[step]) this.triggerKick(stepTime);
      if(this.pattern.snare[step]) this.triggerSnare(stepTime);
      if(this.pattern.hat[step]) this.triggerHat(stepTime);
      this.nextNoteTime += (60/this.bpm) / (this.stepsPerBar/4); // step = 16 per bar -> 4 beats
      this.currentStep++;
      if(step+1 >= this.stepsPerBar && (this.currentStep%this.stepsPerBar)===0){
        // loop
      }
    }
  }
  start(){
    if(this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.schedulerTimer = setInterval(()=>this.schedule(), this.lookahead);
  }
  stop(reset=false){
    this.isPlaying=false;
    if(this.schedulerTimer) clearInterval(this.schedulerTimer);
    if(reset) { this.currentStep=0; }
  }
  triggerKick(time){
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(150, time);
    o.frequency.exponentialRampToValueAtTime(40, time+0.2);
    g.gain.setValueAtTime(1, time);
    g.gain.exponentialRampToValueAtTime(0.001, time+0.5);
    o.connect(g); g.connect(this.delay);
    o.start(time); o.stop(time+0.5);
  }
  triggerSnare(time){
    const noise = this._createNoise();
    const b = this.ctx.createBiquadFilter(); b.type='highpass'; b.frequency.value=1000;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(1, time); g.gain.exponentialRampToValueAtTime(0.01, time+0.3);
    noise.connect(b); b.connect(g); g.connect(this.delay);
    noise.start(time); noise.stop(time+0.3);
    // body
    const o = this.ctx.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(180, time);
    const og = this.ctx.createGain(); og.gain.setValueAtTime(0.8,time); og.gain.exponentialRampToValueAtTime(0.001,time+0.15);
    o.connect(og); og.connect(this.delay);
    o.start(time); o.stop(time+0.2);
  }
  triggerHat(time){
    const n = this._createNoise();
    const hp = this.ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=6000;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.5,time); g.gain.exponentialRampToValueAtTime(0.001,time+0.08);
    n.connect(hp); hp.connect(g); g.connect(this.delay);
    n.start(time); n.stop(time+0.1);
  }
  _createNoise(){
    const bufferSize = this.ctx.sampleRate * 1;
    const buf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i] = Math.random()*2-1;
    const source = this.ctx.createBufferSource(); source.buffer = buf;
    return source;
  }
  // simple poly synth play (note in Hz) with ADSR
  triggerSynth(noteHz, time, duration=0.5, type='saw'){
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(noteHz, time);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    // ADSR simple
    const a=0.01,d=0.1,s=0.7;
    g.gain.linearRampToValueAtTime(1.0, time+a);
    g.gain.exponentialRampToValueAtTime(s, time+a+d);
    g.gain.setValueAtTime(s, time+duration - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, time+duration);
    o.connect(g); g.connect(this.delay);
    o.start(time); o.stop(time+duration+0.1);
  }
  toggleStep(track, index){
    this.pattern[track][index] = !this.pattern[track][index];
  }
  dispose(){
    if(this.ctx) this.ctx.close();
  }
}
