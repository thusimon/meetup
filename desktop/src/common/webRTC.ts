// TODO: use my own stun server
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun2.l.google.com:19302'
    }
  ]
}

class WebRTCConnection {
  peerConnection: RTCPeerConnection;
  remoteStream: MediaStream;
  constructor() {
    this.remoteStream = new MediaStream();
    this.peerConnection = new RTCPeerConnection(configuration);
    this.peerConnection.onicecandidate = (evt) => {
      console.log('getting ice candidate from stun server');
      if(evt.candidate) {
        // send candidate to another peer
      }
    }
    this.peerConnection.onconnectionstatechange = (evt) => {
      if(this.peerConnection.connectionState === 'connected') {
        console.log('successfully connected with another peer');
      }
    }
    this.peerConnection.ontrack = (evt) => {
      this.remoteStream.addTrack(evt.track);
    }
  }

  addTrack(stream: MediaStream) {
    for (const track of stream.getTracks()) {
      this.peerConnection.addTrack(track);
    }
  }
}

export default WebRTCConnection;
