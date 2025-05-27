import { useState } from "react";
import './Sampler.css'

const audioCtx = new AudioContext();

export const Sampler = () => {
    const [attack, setAttack] = useState<number>(0.2)
    const [release, setRelease] = useState<number>(0.5)
    const [sustain, setSustain] = useState<number>(1)

    const [modulationFrequency, setModulationFrequency] = useState<number>(10)
    const [modulationDepth,  setModulationDepth] = useState<number>(200)
    const playSweep = (frequency: number) => {
        var carrierFrequencyOffset = new ConstantSourceNode(audioCtx, {offset: frequency} )
        const carrier = new OscillatorNode(audioCtx,{
            type: 'sine',
            frequency: 0,
        })

        var modulatorOsc = new OscillatorNode(audioCtx, {frequency: modulationFrequency})
        var modulator = new GainNode(audioCtx, {gain: modulationDepth})

        // Start
        modulatorOsc.start()
        carrierFrequencyOffset.start()

        modulatorOsc.connect(modulator)

        modulator.connect(carrier.frequency)
        carrierFrequencyOffset.connect(carrier.frequency)


        
        const time = audioCtx.currentTime
        const sweepEnv = new GainNode(audioCtx);
        sweepEnv.gain.cancelScheduledValues(time)
        sweepEnv.gain.setValueAtTime(0, time)
        sweepEnv.gain.linearRampToValueAtTime(1, time + attack)
        sweepEnv.gain.setTargetAtTime(1, time + attack, sustain)
        sweepEnv.gain.linearRampToValueAtTime(0, time + sustain + release)
        
        carrier.connect(sweepEnv).connect(audioCtx.destination)
        carrier.start(time)
        carrier.stop(time + attack + sustain + release)
        
    }

    return <div>
        <div className="flex-col">
            <h4>FM</h4>
            <label>Modulation frequency: {modulationFrequency}</label>
            <input type="range" min="20" max="2000" value={modulationFrequency} onChange={e => setModulationFrequency(e.target.valueAsNumber)} />
            <label>Modulation depth: {modulationDepth}</label>
            <input type="range" min="0" max="1000" value={modulationDepth} onChange={e => setModulationDepth(e.target.valueAsNumber)} />
        </div>
        <div className="flex-col">
            <h4>ASR</h4>
            <label>Attack: {attack}</label>
            <input min={0.1} max={1} step={0.1} type="range" value={attack} onChange={e => setAttack(e.target.valueAsNumber)}/>
            <label>Sustain: {sustain}</label>
            <input min={0.1} max={2} step={0.1} type="range" value={sustain} onChange={e => setSustain(e.target.valueAsNumber)}/>
            <label>Release: {release}</label>
            <input min={0.1} max={1} step={0.1} type="range" value={release} onChange={e => setRelease(e.target.valueAsNumber)}/>
        </div>
        <div className="flex-row piano">
            <button onClick={() => playSweep(261)}>C</button>
            <button onClick={() => playSweep(293)}>D</button>
            <button onClick={() => playSweep(329)}>E</button>
            <button onClick={() => playSweep(349)}>F</button>
            <button onClick={() => playSweep(392)}>G</button>
            <button onClick={() => playSweep(Math.random()*1000)}>?</button>

        </div>
        </div>
}