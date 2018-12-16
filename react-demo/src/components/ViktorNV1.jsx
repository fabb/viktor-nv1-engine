import React, { Component } from 'react'
import NV1Engine from 'viktor-nv1-engine'

const midiNoteOn = 144
const midiNoteOff = 128
const note = 64
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
            selectedPatchName: '',
        }
    }

    componentDidMount() {
        const AudioContext = global.AudioContext || global.webkitAudioContext
        const { dawEngine, patchLibrary } = NV1Engine.create(AudioContext, this.state.store)

        const patchNames = patchLibrary.getDefaultNames()
        patchLibrary.selectPatch(patchNames[2])
        const patch = patchLibrary.getSelected().patch
        dawEngine.loadPatch(patch)

        this.setState({
            dawEngine: dawEngine,
            patchLibrary: patchLibrary,
            selectedPatchName: patchLibrary.getSelected().name,
        })
    }

    componentWillUnmount() {
        this.state.dawEngine.audioContext.close()
    }

    onPatchChange = ({ newPatchName }) => {
        const patchLibrary = this.state.patchLibrary
        patchLibrary.selectPatch(newPatchName)
        const patch = patchLibrary.getSelected().patch
        this.state.dawEngine.loadPatch(patch)
        this.setState({
            selectedPatchName: patchLibrary.getSelected().name,
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
        const patchLibrary = this.state.patchLibrary
        const patchNames = patchLibrary && patchLibrary.getDefaultNames && patchLibrary.getDefaultNames()
        return (
            <div>
                <PatchSelect patchNames={patchNames} selectedPatchName={this.state.selectedPatchName} onPatchChange={this.onPatchChange} />
                <button onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                    Play Note
                </button>
            </div>
        )
    }
}

class PatchSelect extends Component {
    handleChange = event => {
        const newPatchName = event.target.value
        this.props.onPatchChange({ newPatchName })
    }

    render() {
        const patchNames = this.props.patchNames
        return (
            <div>
                <label htmlFor="patch">Patch: </label>
                <select id="patch" value={this.props.selectedPatchName} onChange={this.handleChange}>
                    {patchNames
                        ? this.props.patchNames.map(patchName => {
                              return (
                                  <option key={patchName} value={patchName}>
                                      {patchName}
                                  </option>
                              )
                          })
                        : 'loading...'}
                </select>
            </div>
        )
    }
}

export default ViktorNV1
