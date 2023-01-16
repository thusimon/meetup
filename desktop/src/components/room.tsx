import { useEffect, useState } from "react";
import { ElectronActions, EventDataType, SocketActions } from "../common/constants";

import './room.scss';

const Room = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketListener.registerListener((socketResp: EventDataType) => {
        const {msg, data} = socketResp.data;
        if (msg != SocketActions.GetAllUsers || !data) {
          return;
        }
        setUsers(data);
      });
      messager.sendMessage({
        action: ElectronActions.SendSocketMessage,
        data: SocketActions.GetAllUsers
      });
    }
    init();
  }, []);

  return <div id='room-container'>
    {
      users.map((user, idx) => {
        return <div key={`user-${idx}`}>
          <span>{user.name}</span>
        </div>
      })
    }
  </div>
};

export default Room;
