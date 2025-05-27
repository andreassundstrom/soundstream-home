import { useEffect, useRef, useState } from "react"
import './Sequencer.css'
const audioCtx = new AudioContext()

const kickLength = 0.120
const kickInitialFrequency = 300;
const kickEndFrequency = 60;
const frequencyDecay = 0.030
const playKick = () => {
    const osc = new OscillatorNode(audioCtx, {
        frequency: kickInitialFrequency,
        type: 'sine'
    })

    const gain = new GainNode(audioCtx,{})
    gain.gain.setValueAtTime(1, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + kickLength)
    osc.connect(gain).connect(audioCtx.destination);
    osc.frequency.linearRampToValueAtTime(kickEndFrequency, audioCtx.currentTime + frequencyDecay)
    osc.start()
    osc.stop(audioCtx.currentTime + kickLength)
}

const playclick = () => {
    const osc = new OscillatorNode(audioCtx,{
        frequency: 1400,
        type: 'triangle'
    })
    const gain = new GainNode(audioCtx)
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.100)
    osc.connect(gain).connect(audioCtx.destination)
}

const bpm = 128

export const Sequencer = () => {
    const [kick, setKick] = useState<boolean[]>(Array(16).fill(false))
    const [click, setClick] = useState<boolean[]>(Array(16).fill(false))

    const [tick, setTick] = useState<number>(0)
    const [playing, setPlaying] = useState<boolean>(false)

    const tickRef =  useRef<number>(null)

    useEffect(() => {
        if(tickRef.current){
            clearInterval(tickRef.current)
        }

        if(playing){
            tickRef.current = setInterval(() => {
                const newTick = tick >= 15 ? 0 : tick + 1;
                if(kick[newTick]){
                    playKick()
                }

                if(click[newTick]){
                    playclick();
                }
                setTick(prev => prev >= 15 ? 0 : prev +1)
            }, (60 / bpm / 4 ) * 1000)
        }

        return () => {
            if(tickRef.current){
                clearInterval(tickRef.current)
            }
        }

    },[tick,playing])

    const toggleKick = (i: number) => {
        setKick(prev => {
            const n = [...prev]
            n[i] = !prev[i]
            return n;
        })
    }

    const toggleClick = (i : number) => {
        setClick(prev => {
            const n = [...prev]
            n[i] = !prev[i]
            return n
        })
    }

    return <>
        <h1>Sequencer</h1>
        <button onClick={() => setPlaying(!playing)}>{playing ? 'Stop' : 'Play'}</button>
        <div className="sequencer">
        <div>
            <button>Kick,: </button>
        {kick.map((play, index) => <button 
            key={index}
            className={`${index == tick ? 'active' : ''}`}
            onClick={() => toggleKick(index)}>{play ? '🔳' : '🔲'}</button>)
        }
        </div>
        <div>
            <button>Click:</button>
        {click.map((play, index) => <button 
            key={index}
            className={`${index == tick ? 'active' : ''}`}
            onClick={() => toggleClick(index)}>{play ? '🔳' : '🔲'}</button>)
        }
        </div>
        </div>
    </>
}