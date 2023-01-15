import { useEffect } from "react";
import { ElectronActions } from "../common/constants";
import SocketMessages from "./messages-socket";

import './room.scss';

const Room = () => {

  const onSocketMessageHandler = (socketMessage: any) => {
    console.log(socketMessage);
  }
  useEffect(() => {
    const init = async () => {
      const socketMessage = new SocketMessages(onSocketMessageHandler);
      const getUsersResult  = await messager.sendMessage({
        action: ElectronActions.SendSocketMessage,
        data: 'GetAllUsers'
      });
      console.log(13, getUsersResult)
    }
    init();
  }, []);

  return <div id='room-container'>

  </div>
};

export default Room;
