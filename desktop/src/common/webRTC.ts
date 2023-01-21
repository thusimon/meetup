export const configuration = {
  iceServers: [
    {
      urls: 'stun:stun2.l.google.com:19302'
    }
  ]
}

class WebRTCConnection {
  peerConnection: RTCPeerConnection;
  constructor(configuration: RTCConfiguration) {
    this.peerConnection = new RTCPeerConnection(configuration);
  }
}

export default WebRTCConnection;
