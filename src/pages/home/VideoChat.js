import React, { Component } from 'react';
import LioWebRTC from 'liowebrtc';
import Speech  from './Speech';
import Draggable from 'react-draggable';

class Party extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: "room-name-abc",
      roomID: `party-abcd`,
      muted: false,
      camPaused: false,
      peers: [],
      audio: true,
      video: true,
      extraClass: '',
      extraLocalClass: '',
      showText: true,
      incomingSpeech: []
    };
    this.remoteVideos = {};
  }

  componentDidMount() {
    this.webrtc = new LioWebRTC({
      // The url for your signaling server. Use your own in production!
      url: 'https://sm1.lio.app:443/',
      // The local video ref set within your render function
      localVideoEl: this.localVid,
      // Immediately request camera access
      autoRequestMedia: true,
      // Optional: nickname
      nick: this.state.nick,
      debug: false
    });

    this.webrtc.on('peerStreamAdded', this.addVideo);
    this.webrtc.on('removedPeer', this.removeVideo);
    this.webrtc.on('ready', this.readyToJoin);
    this.webrtc.on('iceFailed', this.handleConnectionError);
    this.webrtc.on('connectivityError', this.handleConnectionError);
    this.webrtc.on('mute', this.handleRemoteMute);
    this.webrtc.on('unmute', this.handleRemoteUnMute); 
    this.webrtc.on('receivedPeerData', this.handlePeerData);
  }

  addVideo = (stream, peer) => {
    this.setState({ peers: [...this.state.peers, peer], showText: false }, () => {
      this.webrtc.attachStream(stream, this.remoteVideos[peer.id]);
    });
  }

  removeVideo = (peer) => {
    this.setState({
      peers: this.state.peers.filter(p => !p.closed)
    }, () => {
      this.webrtc.getClients((err, clients) => {
        if(Object.keys(clients).length < 2) {
          this.setState({
            showText: true
          })
        }
        
      })
    });
  }

  handleRemoteMute = (data) => {
      if(data.name == "video") {
        this.setState({
          extraClass: 'no-video-remote'
        })
      }
  }
  handleRemoteUnMute = (data) => {
    // console.log(data) 
    if(data.name == "video") {
      this.setState({
        extraClass: ''
      })
    }
  }

  handleConnectionError = (peer) => {
    const pc = peer.pc;
    console.log('had local relay candidate', pc.hadLocalRelayCandidate);
    console.log('had remote relay candidate', pc.hadRemoteRelayCandidate);
  }

  readyToJoin = () => {
    // Starts the process of joining a room.
    this.webrtc.joinRoom(this.state.roomID, (err, desc) => {
    });
  }

  // Show fellow peers in the room
  generateRemotes = () => this.state.peers.map((p) => (
      <div key={p.id} className={`other-video-container ${this.state.extraClass}`} id={/* The video container needs a special id */ `${this.webrtc.getContainerId(p)}`}>
        <video
          // Important: The video element needs both an id and ref
          id={this.webrtc.getDomId(p)}
          ref={(v) => this.remoteVideos[p.id] = v}
          />
      </div>
        
  ));

  disconnect = () => {
    this.webrtc.quit();
  }
  handlePeerData = (type, payload) => {
    if(type == "speech") {
      if(this.state.incomingSpeech.length > 3) {
          this.setState({ incomingSpeech: [] }, () => {
            this.setState({ incomingSpeech: [...this.state.incomingSpeech, payload] })
          })
      }
    }
  }

  componentWillUnmount() {
    this.disconnect()
  }
  handleChangeAudio = () => {
    if(!this.state.audio) {
      this.webrtc.unmute();
      this.setState({
        audio: true
      })
    } else {
      this.webrtc.mute();
      this.setState({
        audio: false
      })
    }
  }
  handleChangeVideo = () => {
    if(!this.state.video) {
      this.webrtc.resumeVideo()
      this.setState({
        video: true,
        extraLocalClass: ''
      })
    } else {
      this.webrtc.pauseVideo();
      this.setState({
        video: false,
        extraLocalClass: 'extra-local-class'
      })
    }
  }
  handleDisconnect = () => {
    this.props.history.push('/')
  }

  render() {
    let { audio, video, extraLocalClass, showText, peers } = this.state
    return (
      <div className="main-container">
        <p style={{display: `${showText ? "block" : "none"}`}} className="no-parti-text">No Participants</p>
        <Draggable
          bounds="parent"
          // bounds = {{left: 0, top: 0, right: 0, bottom: 0}}
        >
          <div className={`local-video-container ${extraLocalClass}`}>
                  <video
                    // Important: The local video element needs to have a ref
                    ref={(vid) => { this.localVid = vid; }}
                  />
              {/* <p>{this.state.nick}</p> */}
          </div>
        </Draggable>
        {this.generateRemotes()}
        <div className="buttons-parent-div">
            <div style={{ backgroundColor: `${audio ? "green" : "red"}`}} onClick={this.handleChangeAudio} className="buttons-div">
              <i className="fas fa-microphone"></i>
            </div>
            <div style={{ backgroundColor: `${video ? "green" : "red"}`, margin: "0 30px"}} onClick={this.handleChangeVideo} className="buttons-div">
              <i className="fas fa-video"></i>
            </div>
            <div onClick={this.handleDisconnect} className="buttons-div">
              <i className="fas fa-phone-alt"></i>
            </div>
        </div>
        <Speech peers={peers} webrtc={this.webrtc} audio={audio}></Speech>
      </div>
    );
  }
}

export default Party;