import { useEffect, useRef } from 'react';
import { useAppContext } from './app-context';
import { VideoStreamConstraints } from '../common/constants';

import './main.scss';

const Main = () => {
  const viedoRef = useRef<HTMLVideoElement>(null);
  const { state } = useAppContext();

  useEffect(() => {
    navigator.mediaDevices
    .getUserMedia(VideoStreamConstraints)
    .then((stream) => {
      const videoEle = viedoRef.current;
      videoEle.srcObject = stream;
      videoEle.addEventListener("loadedmetadata", () => {
        videoEle.play();
      });
    })
    .catch((err) => {
      console.log('error occured when trying to get an access to camera', err);
    });
  }, []);
  return <div id='main-container'>
    <header>Welcome, {state.name}</header>
    <div id='video_container'>
      <video id='video' muted autoPlay ref={viedoRef}></video>
    </div>
  </div>

};

export default Main;
