import React, { Component } from 'react'
import NV1Engine from 'viktor-nv1-engine'

const midiNoteOn = 144
const midiNoteOff = 128
const note = 100
const velocityOn = 100
const velocityOff = 0

class ViktorNV1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            store: {
                get: function(name) {},
                set: function(name, data) {},
                remove: function(name) {},
            },
            dawEngine: {},
            patchLibrary: {},
        }
    }

    componentDidMount() {
        const AudioContext = global.AudioContext || global.webkitAudioContext
        const { dawEngine, patchLibrary } = NV1Engine.create(AudioContext, this.state.store)

        this.setState({
            dawEngine: dawEngine,
            patchLibrary: patchLibrary,
        })
    }

    onMouseDown = () => {
        // audiocontext initially is in suspended state for most browsers, needs to be started on first user interaction
        const audioContext = this.state.dawEngine.audioContext
        if (audioContext.state !== 'running') {
            audioContext.resume().then(() => {
                console.log('Playback resumed successfully')
            })
        }

        this.state.dawEngine.externalMidiMessage({
            data: [midiNoteOn, note, velocityOn],
        })
    }

    onMouseUp = () => {
        this.state.dawEngine.externalMidiMessage({
            data: [midiNoteOff, note, velocityOff],
        })
    }

    render() {
        return (
            <button onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                Play Note
            </button>
        )
    }
}

export default ViktorNV1
