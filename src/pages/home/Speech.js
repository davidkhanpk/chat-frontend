import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { gql, useLazyQuery } from "@apollo/client";
import { useAuthState } from "../../context/auth";
import { useMessageState } from "../../context/message";

const GET_TRANSLATION = gql`
  query getTranslation($to: String!, $from: String!, $string: String!) {
    getTranslation(to: $to, from: $from, string: $string) {
      to
      from
      string
    }
  }
`;

const Speech = ({ audio, onShout, incomingSpeech }) => {
  const { currentUser } = useAuthState();
  const { selectedUser } = useMessageState();
  // let [speechData, setSpeechData] = useState(null);
  const { finalTranscript, resetTranscript } = useSpeechRecognition();
  const [getTranslation, { loading }] = useLazyQuery(GET_TRANSLATION, {
    // onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted(data) {
      console.log(data);
      onShout(data.String);
      resetTranscript();
      // webrtc.shout("speech", data.string);
    },
  });

  // useEffect(() => {
  //   if (speechData) {
  //     console.log(speechData);
  //     if (webrtc) {
  //       webrtc.shout("speech", speechData);
  //     }
  //   }
  // }, speechData);

  useEffect(() => {
    if (audio) {
      console.log("listening");
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    } else {
      console.log("listening stoped");
      SpeechRecognition.stopListening();
    }
  }, [audio]);

  useEffect(() => {
    if (finalTranscript) {
      if (currentUser.language != selectedUser.language) {
        getTranslation({
          variables: {
            to: selectedUser.language,
            from: currentUser.language,
            string: finalTranscript,
          },
        });
      } else {
        onShout(finalTranscript);
        // if (webrtc) {
        //   webrtc.shout("speech", finalTranscript);
        // }
      }
    }
    console.log(finalTranscript);
  }, [finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }
  let inComingSpeechMarkup = "";
  if (incomingSpeech && incomingSpeech.length) {
    inComingSpeechMarkup = incomingSpeech.map((text) => {
      return <p>{text}</p>;
    });
  }
  return (
    <div className="speech-text">
      <p>{inComingSpeechMarkup}</p>
    </div>
  );
};
export default Speech;
