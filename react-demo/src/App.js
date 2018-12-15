import React, { Component } from 'react'
import ViktorNV1 from './components/ViktorNV1'
import './App.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Viktor NV-1 React Demo</p>
                    <ViktorNV1 />
                </header>
            </div>
        )
    }
}

export default App
