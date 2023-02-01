import { ElectronActions, SocketActions } from "./constants";

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
  dataChannel: RTCDataChannel;
  flow: any;
  constructor(flowData: any) {
    this.flow = flowData;
    this.remoteStream = new MediaStream();
    this.peerConnection = new RTCPeerConnection(configuration);
    this.dataChannel = this.peerConnection.createDataChannel('dataChannel');
    this.peerConnection.onicecandidate = (evt) => {
      if(evt.candidate) {
        const candidate = evt.candidate;
        console.log('getting ice candidate from stun server', candidate, candidate.toJSON());
        // send candidate to another peer
        const data = {
          ...this.flow,
          candidate: candidate.toJSON()
        };
        messager.sendMessage({
          action: ElectronActions.SendSocketMessage,
          data: {
            msg: SocketActions.SendICECandidate,
            data: data
          }
        });
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
}

export default WebRTCConnection;
