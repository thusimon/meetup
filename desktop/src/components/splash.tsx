import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './app-context';
import { ElectronActions, AppContextActions } from '../common/constants';

import SplashLoadingIcon from '../assets/splash-loading.svg';
import ErrorIcon from '../assets/error.svg';

import './splash.scss';

const Splash = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [ err, setErr ] = useState(null);
  useEffect(() => {
    const init = async () => {
      const getNameResult  = await messager.sendMessage({ action: ElectronActions.GetName });
      const name = getNameResult.data; 
      if (!name) {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
        return;
      }
      dispatch({ type: AppContextActions.SetName, data: name});
      const initSocketResult = await messager.sendMessage({ action: ElectronActions.InitSocket, data: name});
      if (initSocketResult.data && initSocketResult.data.err) {
        // socket init error happens
        console.log(29, initSocketResult.data);
        setErr(initSocketResult.data.err.toString());
      } else {
        setTimeout(() => {
          navigate('/main');
        }, 1000);
      }
    }
    init();
  }, []);

  return <div id='container-splash'>
    <div id='message'>
      MeetUp
    </div>
    <img src={SplashLoadingIcon} />
    <div id='error-container' className={err ? 'show' : 'hide'}>
      <img src={ErrorIcon} />
      <p>{err}</p>
    </div>
  </div>
};

export default Splash;
