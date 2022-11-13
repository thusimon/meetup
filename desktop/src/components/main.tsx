import { useEffect } from 'react';
import { Actions } from '../common/constants';
import { messageFactory } from './utils';

const Main = () => {
  useEffect(() => {
    const getMessage = async () => {
      const messager = messageFactory.getInstance();
      const result  = await messager.sendMessage({action: Actions.GetName, data: 123});
      console.log(10, result);
    }
    getMessage();
  }, []);
  return <div>
    <h1>Loading</h1>
  </div>

};

export default Main;
