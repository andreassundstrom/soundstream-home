import { useEffect, useRef, useState } from 'react'
import './App.css'

class AudioPlayer {
  audioContext: AudioContext;
  osc: OscillatorNode;
  playing: boolean;
  frequency: number;
  constructor() {
    console.log("Creating")

    this.audioContext = new AudioContext();
    this.playing = false
    this.frequency = 440;
    this.osc = new OscillatorNode(this.audioContext, {
      frequency: this.frequency,
      type: "sine"
    })

    this.osc.start()
    this.playing = false
    this.playSound = this.playSound.bind(this)
    this.pauseSound = this.pauseSound.bind(this)
    this.setFrequency = this.setFrequency.bind(this)
  }
  playSound(){  
      this.osc.connect(this.audioContext.destination);
      this.playing = true;
  }

  pauseSound(){
      this.osc?.disconnect(this.audioContext.destination);
      this.playing = false;
  }

  setFrequency(frequency: number){
    this.osc.frequency.setTargetAtTime(frequency,0,0)
  }

}

function App() {
  const [playingSound, setPlayingSound] = useState(false)
  const [created, setCreated] = useState(false)
  const [frequency, setFrequency] = useState<number>(440)
  const audioRef = useRef<AudioPlayer>(null)
  useEffect(() => {
  },[])
  const togglePlayState = () => {
    if(playingSound){
      audioRef.current?.pauseSound()
    }
    else{
      audioRef.current?.playSound()
    }
    setPlayingSound(prev => !prev)
  }
  const changeFrequency = (frequency : number) => {
    audioRef.current?.setFrequency(frequency)
    setFrequency(frequency)
  }
  const create = () => {
    setCreated(true)
    audioRef.current = new AudioPlayer();
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
    {!created && <button onClick={() => create()}>Create</button>}
    {created && <>
    <button onClick={() => togglePlayState()}>{playingSound ? "Pause" : "Play"}</button>
    <label>{frequency}
      <input type="range" min={80} max={1000} value={frequency} onChange={(e) => changeFrequency(e.target.valueAsNumber)} />
    </label>
    </>}
    </div>

  )
}

export default App
