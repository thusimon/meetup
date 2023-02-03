import { useRef, useState, useEffect } from "react";
import { VideoStreamConstraints } from '../common/constants';
import { useAppContext } from './app-context';

import CameraOn from '../assets/camera-on.svg';
import CameraOff from '../assets/camera-off.svg';

import './meeting.scss';

const Meeting = () => {
  const mainViedoRef = useRef<HTMLVideoElement>(null);
  const smallViedoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>(null);
  const {state} = useAppContext();

  useEffect(() => {
    const iceCandidate = state.iceCandidate;
    if (iceCandidate && iceCandidate.candidate && state.webRTC) {
      const candidate = iceCandidate.candidate;
      const webRTC = state.webRTC;
      webRTC.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log(25, 'added candidate', candidate)
    }
  }, [state.iceCandidate]);

  const videoMetadataLoadHandler = function() {
    this.play();
  }

  const disconnectLocalVideoStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const videoEle = mainViedoRef.current;
    videoEle.pause();
    videoEle.currentTime = 0;
    videoEle.removeEventListener('loadedmetadata', videoMetadataLoadHandler);
    videoEle.srcObject = null;
    setLocalStream(null);
    setVideoState(0);
  }

  const connectLocalVideoStream = async () => {
    try {
      setVideoState(1);
      const stream = await navigator.mediaDevices.getUserMedia(VideoStreamConstraints);
      setLocalStream(stream);
      const videoEle = mainViedoRef.current;
      videoEle.srcObject = stream;
      setVideoState(2);
      // videoEle.addEventListener('loadedmetadata', () => {
      //   videoMetadataLoadHandler();
      //   setStreamLoading(false);
      // });
      //setStreamLoading(false);
    } catch (err) {
      console.log('error occured when trying to get an access to camera', err);
    };
  }

  const onCameraButtonClick = () => {
    switch (videoState) {
      case 0: {
        // idle
        connectLocalVideoStream();
        break;
      }
      case 1: {
        // in progress, do nothing
        break;
      }
      case 2: {
        // opened
        disconnectLocalVideoStream();
        break;
      }
      default:
        break;
    }
  }

  const getVideoClass = () => {
    switch (videoState) {
      case 0: {
        // static
        return 'video-static';
      }
      case 1: {
        // opening
        return 'video-opening';
      }
      case 2: {
        // streaming
        return 'video-streaming';
      }
      default: {
        return 'video-static';
      }
    }
  }

  return <div id='meeting-container'>
      <div id='video_container' className={getVideoClass()}>
        <video className='video' id='main-video' muted autoPlay ref={mainViedoRef}></video>
        <video className='video' id='small-video' muted autoPlay ref={smallViedoRef}></video>
      </div>
      <div id='button-group'>
        <button id='camera' className='btn' onClick={onCameraButtonClick} disabled={videoState === 1}
          title={ videoState < 2 ? 'Open camera' : 'Close camera' }>
          <img src={ videoState < 2 ? CameraOn : CameraOff }></img>
        </button>
      </div>
    </div>
};

export default Meeting;
