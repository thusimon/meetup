import { useEffect } from 'react';
import { useAppContext } from './app-context';
import Room from './room';
import Meeting from './meeting';

import './main.scss';

const Main = () => {
  const { state } = useAppContext();

  useEffect(() => {
  }, []);

  return <div id='main-container'>
    <Room />
    <Meeting />
    <div id='chat-container'></div>
  </div>

};

export default Main;
