import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    recognition: null,
    transcript: ''
  }
  canUseVoiceToText = () => {
    return ('webkitSpeechRecognition' in window)
  }

  generateSpeechSynthesis = (text) => {
    let msg = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    msg.voice = voices[10]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 2; //0 to 2
    msg.lang = 'en-US';
    msg.text = text
    speechSynthesis.speak(msg);
  }
  generateRecognitionObject = () => {
    let recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false; // default state set so that it stops when the user stops talking
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let interim_transcript = '';
  
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      let final_transcript = interim_transcript
      this.setState({transcript: final_transcript})
      this.generateSpeechSynthesis(final_transcript)
    };

    return recognition
  }


  componentDidMount = () => {
    if(this.canUseVoiceToText()){
      const recognition = this.generateRecognitionObject()
      const speechSynthesis = this.generateSpeechSynthesis()
      console.log(recognition)
      this.setState({
        recognition,
        speechSynthesis
      })

    }
  }

  startButton = () => {
    const { recognition } = this.state
    console.log(recognition)
    if(this.canUseVoiceToText()){
      recognition.start();
    }
  }

  render() {
    const { transcript } = this.state 
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {
            !this.canUseVoiceToText() ?
            <p>Unfortunately, we cannot use Voice To Text In Your Browser</p> :
            <button onClick={() => this.startButton()}>Click me</button>
          }
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
