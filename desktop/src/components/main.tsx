import { useEffect } from 'react';
import { useAppContext } from './app-context';
import Room from './room';
import Meeting from './meeting';

import './main.scss';
import AppContextMessager from './app-context-messager';

const Main = () => {
  useEffect(() => {
  }, []);

  return <div id='main-container'>
    <AppContextMessager />
    <Room />
    <Meeting />
    <div id='chat-container'></div>
  </div>

};

export default Main;
