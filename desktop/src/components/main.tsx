import { useEffect, useRef, useState } from 'react';
import { useAppContext } from './app-context';
import { VideoStreamConstraints } from '../common/constants';

import './main.scss';

const Main = () => {
  const viedoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>(null);
  const [videoState, setVideoState] = useState(0);
  const { state } = useAppContext();

  const videoMetadataLoadHandler = function() {
    this.play();
  }

  const disconnectLocalVideoStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const videoEle = viedoRef.current;
    videoEle.pause();
    videoEle.currentTime = 0;
    videoEle.removeEventListener('loadedmetadata', videoMetadataLoadHandler);
    videoEle.srcObject = null;
    setStream(null);
    setVideoState(0);
  }

  const connectLocalVideoStream = async () => {
    try {
      setVideoState(1);
      const stream = await navigator.mediaDevices.getUserMedia(VideoStreamConstraints);
      setStream(stream);
      const videoEle = viedoRef.current;
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

  useEffect(() => {
  }, []);

  return <div id='main-container'>
    <div id='room-container'></div>
    <div id='meeting-container'>
      <div id='video_container' className={getVideoClass()}>
        <video id='video' muted autoPlay ref={viedoRef}></video>
      </div>
      <div id='button-group'>
        <button id='connect' onClick={connectLocalVideoStream}>Connect</button>
        <button id='disconnect' onClick={disconnectLocalVideoStream}>Disconnect</button>
      </div>
    </div>
    <div id='chat-container'></div>
  </div>

};

export default Main;
