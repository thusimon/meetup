// TODO: use my own stun server
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302	'
    }
  ]
}

class WebRTCConnection {
  peerConnection: RTCPeerConnection;
  remoteStream: MediaStream;
  constructor() {
    this.remoteStream = new MediaStream();
    this.peerConnection = new RTCPeerConnection();
    this.peerConnection.onicecandidate = (evt) => {
      console.log('getting ice candidate from stun server', evt);
      if(evt.candidate) {
        // send candidate to another peer
      }
    }
    this.peerConnection.onconnectionstatechange = (evt) => {
      if(this.peerConnection.connectionState === 'connected') {
        console.log('successfully connected with another peer');
      }
    }
    this.peerConnection.onsignalingstatechange = (e) => {
      console.log('onsignalingstatechange', this.peerConnection.signalingState);
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

  async createOffer() {
    const webRTCOffer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(webRTCOffer);
    const offer = {
      sdp: webRTCOffer.sdp,
      type: webRTCOffer.type
    };
    return offer;
  }

  async createAnswer() {
    const webRTCAnswer = await this.peerConnection.createAnswer();
    const answer = {
      sdp: webRTCAnswer.sdp,
      type: webRTCAnswer.type
    }
  }
}

export default WebRTCConnection;
