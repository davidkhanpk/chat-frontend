import React, { useRef, useEffect, useState } from 'react'
import Peer from "simple-peer";
import { useSocketState } from "../../context/socket";
import { useAuthState } from "../../context/auth";
import { Modal, Button } from 'react-bootstrap';

function VideoCall({ history }) {
    const [show, setShow] = useState(false);
    const [stream, setStream] = useState();
    const [peerAccepted, setPeerAccepted] = useState(false);
    const { currentCaller, currentCalle, currentUser } = useAuthState();
    const [isCallAccepted, setIsCallAccepted] = useState(false);
    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket  = useSocketState()
    var searchParams = new URLSearchParams(window.location.search);
    let isIncmingCall = searchParams.has("isIncomingCall")
    let isOutgoingCall = searchParams.has("isOutgoingCall")
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      if(isOutgoingCall || isIncmingCall) {
        setShow(true)
      }
      if(isOutgoingCall && currentCalle && currentUser) {
        console.log(currentCalle)
        let data = {
          from: currentUser.username,
          to: currentCalle.username
        }
        console.log(data)
        socket.emit("callUser", data)
      }
    }, []);
    if(!currentCaller && !currentCalle) {
      history.push('/');
    }

    function callAccepted() {
      setIsCallAccepted(true)
      setShow(false)
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
  
          iceServers: [
              {
                  urls: "stun:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683"
              },
              {
                  urls: "turn:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683"
              }
          ]
      },
        stream: stream,
      });
      socket.on("peerData", (peerData) => {
        console.log(peerData)
        if(!peerAccepted) {
          setPeerAccepted(true)
          peer.signal(peerData.signal)
        }
      })
      peer.on("signal", data => {
        socket.emit("callAccepted", { signal: data, to: currentCaller, from: currentUser.username })
        // socket.emit("callUser", { userToCall: id, signalData: data, 
        //   // from: yourID
        // })
      })
  
      peer.on("stream", stream => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
        }
      });
    }
    // function acceptCall() {
    //   let data = 
    //   socket.emit("callAccept", )
    // }
    socket.on("callPerr", (data) => {
        setIsCallAccepted(true)
        onCallAccepted(data)
        setShow(false)
    })
    
    function onCallAccepted(data) {
      console.log(data);
      // console.log("call accepted")
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", peerData => {
        socket.emit("peerShare", { signal: peerData, to: data.from, from: currentUser.username })
      })
  
      peer.on("stream", stream => {
        if(partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
        }
      });
      peer.signal(data.signal);
    }
    let UserVideo = '';
  if (stream) {
    UserVideo = (
      <video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo = '';
  if (isCallAccepted) {
    PartnerVideo = (
      <video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall = '';
  if (isIncmingCall) {
    incomingCall = (
      <div className="call-text-div">
        <h1>{currentCaller.from} is calling you</h1>
        <div className="main-buttons-div">
                <div onClick={() => callAccepted()} style={{backgroundColor: "green"}} className="buttons-div">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="buttons-div">
                <i className="fas fa-phone-alt"></i>
                </div> 
              </div>
      </div>
    )
  }
  let outgoingCall = '';
  if (isOutgoingCall) {
    outgoingCall = (
      <div className="call-text-div">
        <h1>calling user {currentCalle.username}</h1>
        <div className="buttons-div">
          <i className="fas fa-phone-alt"></i>
        </div>
      </div>
    )
  }
  return (
        <div>
           <div>
            <div className="local-video-div">
              {UserVideo}
            </div>
            <div className="remote-video-div">
              {PartnerVideo}
            </div>
          </div>
        {/* {UserVideo}
        {PartnerVideo} */}
          <Modal show={show} >
          <Modal.Body>
            {incomingCall}
            {outgoingCall}
            {UserVideo}
          </Modal.Body>
        </Modal>
        </div>
  );
}

export default VideoCall;