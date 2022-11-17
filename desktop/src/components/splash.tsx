import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './app-context';
import { Actions } from '../common/constants';

import SplashLoading from '../assets/splash-loading.svg';
import './splash.scss';

const Splash = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    const init = async () => {
      const result  = await messager.sendMessage({ action: Actions.GetName });
      const name = result.data; 
      if (!name) {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
        return;
      }
      dispatch({ type: Actions.SetName, data: name});
      const ws = new WebSocket('ws://localhost:8080/sockets');
      ws.onopen = function(evt) {
        console.log(28, evt);
      }
      ws.onmessage = function(data) {
        console.log(25, data);
      }
      ws.onerror = function(evt) {
        console.log(31, evt);
      }
      // setTimeout(() => {
      //   navigate('/main');
      // }, 1000);
    }
    init();
  }, []);

  return <div id='container-splash'>
    <div id='message'>
      MeetUp
    </div>
    <img src={SplashLoading} />
  </div>
};

export default Splash;
