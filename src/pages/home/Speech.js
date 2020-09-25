import React, {useEffect} from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


const Speech = ({ audio, webrtc }) => {
  const { finalTranscript, resetTranscript } = useSpeechRecognition()
  useEffect(() => {
      if(audio) {
          console.log("listening")
        SpeechRecognition.startListening({ continuous: true, language: "en-US" })
      } else {
        console.log("listening stoped")
        SpeechRecognition.stopListening()
      }
  },[audio]);
  useEffect(() => {
    if(webrtc) {
      
      // webrtc.shout("speech", finalTranscript)
    }
    console.log(finalTranscript)
  },[finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <div className="speech-text">
      <p>{finalTranscript}</p>
    </div>
  )
}
export default Speech