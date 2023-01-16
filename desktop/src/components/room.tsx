import React, { useEffect, useState } from "react";
import { ElectronActions, EventDataType, SocketActions } from "../common/constants";

import CameraOn from '../assets/camera-on.svg';
import MicOn from '../assets/mic-on.svg';

import './room.scss';

const Room = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [thisUser, setThisUser] = useState<any>({});
  useEffect(() => {
    const init = async () => {
      socketListener.registerListener((socketResp: EventDataType) => {
        const {msg, data} = socketResp.data;
        switch (msg) {
          case SocketActions.GetCurrentUser: {
            if (data) {
              setThisUser(data);
            }
            break;
          }
          case SocketActions.GetAllUsers: {
            if (data) {
              setUsers(data);
            }
            break;
          }
          default:
            break;
        }
      });
      await messager.sendMessage({
        action: ElectronActions.SendSocketMessage,
        data: {
          msg: SocketActions.GetCurrentUser
        }
      });
      await messager.sendMessage({
        action: ElectronActions.SendSocketMessage,
        data: {
          msg: SocketActions.GetAllUsers
        }
      });
    }
    init();
  }, []);

  const onUserClick = (evt: React.MouseEvent) => {
    const id = evt.currentTarget.getAttribute('data-se');
    if (selectedUserId === id) {
      setSelectedUserId('');
    } else {
      setSelectedUserId(id);
    }
  }

  const onVideoCallClick = (evt: React.MouseEvent) => {
    console.log(thisUser, selectedUserId);
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInvite,
        data: {
          from: thisUser.id,
          to: selectedUserId
        }
      }
    });
  }

  const onVoiceCallClick = (evt: React.MouseEvent) => {

  }

  const getUserCards = () => {
    return users.map((user, idx) => {
      return <div className='user-row' key={`user-${idx}`}>
        <div className='user-name'>{user.name}</div>
        <button className={`user-plus ${user.self ? '' : 'hover-effect'}`} onClick={onUserClick} data-se={user.id} disabled={user.id === thisUser.id}></button>
        <div className={`user-dropdown ${user.id === selectedUserId ? 'show' : 'hide'}`}>
          <img src={CameraOn} title='Video call' onClick={onVideoCallClick}></img>
          <img src={MicOn} title='Voice call' onClick={onVoiceCallClick}></img>
        </div>
      </div>
    })
  };

  return <div id='room-container'>
    { getUserCards() }
  </div>
};

export default Room;
