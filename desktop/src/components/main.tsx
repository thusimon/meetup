import { useEffect, useRef, useState } from 'react';
import { useAppContext } from './app-context';
import { VideoStreamConstraints } from '../common/constants';

import './main.scss';

const Main = () => {
  const viedoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>(null);
  const [streamLoading, setStreamLoading] = useState(false);
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
    setStreamLoading(false);
  }

  const connectLocalVideoStream = async () => {
    try {
      setStreamLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia(VideoStreamConstraints);
      setStream(stream);
      const videoEle = viedoRef.current;
      videoEle.srcObject = stream;
      // videoEle.addEventListener('loadedmetadata', () => {
      //   videoMetadataLoadHandler();
      //   setStreamLoading(false);
      // });
      //setStreamLoading(false);
    } catch (err) {
      console.log('error occured when trying to get an access to camera', err);
    };
  }

  useEffect(() => {
  }, []);

  return <div id='main-container'>
    <header>Welcome, {state.name}</header>
    <div id='video_container' className={setStreamLoading ? 'video-loading' : ''}>
      <video id='video' muted autoPlay ref={viedoRef}></video>
    </div>
    <div id='button-group'>
      <button id='connect' onClick={connectLocalVideoStream}>Connect</button>
      <button id='disconnect' onClick={disconnectLocalVideoStream}>Disconnect</button>
    </div>
  </div>

};

export default Main;
