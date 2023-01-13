import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ElectronActions, AppContextActions } from '../common/constants';
import { useAppContext } from './app-context';
import './login.scss';

const Login = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const onInputChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setName(evt.target.value);
  }
  const onBtnClickHandler = async () => {
    const result = await messager.sendMessage({ action: ElectronActions.SetName, data: name });
    dispatch({ type: AppContextActions.SetName, data: result.data });
    navigate('/main');
  }

  return <div id='login-container'>
    <label htmlFor='input-name'>Please enter your name:</label>
    <div id='input-container'>
      <input id='input-name' onChange={onInputChangeHandler} value={name}></input>
      <button id='btn-submit' onClick={onBtnClickHandler}>OK</button>
    </div>
  </div>
};

export default Login;
