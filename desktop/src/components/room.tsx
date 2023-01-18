import React, { useEffect, useState } from "react";
import { ElectronActions, EventDataType, SocketActions } from "../common/constants";

import CameraOn from '../assets/camera-on.svg';
import MicOn from '../assets/mic-on.svg';

import './room.scss';

const Room = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [thisUser, setThisUser] = useState<any>({});
  const [videoInvite, setVideoInvite] = useState<any>(null);
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
          case SocketActions.VideoInvite: {
            if (data) {
              setVideoInvite(data);
            }
            break;
          }
          case SocketActions.VideoInviteAccept: {
            console.log('VideoInviteAccept', data);
            break;
          }
          case SocketActions.VideoInviteReject: {
            console.log('VideoInviteReject', data);
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

  const onVideoInviteAccept = () => {
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInviteAccept,
        data: videoInvite
      }
    });
    setVideoInvite(null);
  }

  const onVideoInviteReject = () => {
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInviteReject,
        data: videoInvite
      }
    });
    setVideoInvite(null);
  }

  const getUserCards = () => {
    return users.map((user, idx) => {
      const isSelfUser = user.id === thisUser.id;
      return <div className='user-row' key={`user-${idx}`}>
        <div className='user-name'>{user.name}</div>
        <button className='user-plus hover-effect' onClick={onUserClick} data-se={user.id} disabled={isSelfUser}></button>
        <div className={`user-dropdown ${user.id === selectedUserId ? 'show' : 'hide'}`}>
          <img src={CameraOn} title='Video call' onClick={onVideoCallClick}></img>
          <img src={MicOn} title='Voice call' onClick={onVoiceCallClick}></img>
        </div>
      </div>
    })
  };

  const getVideoConsent = () => {
    if (!videoInvite) {
      return <></>;
    }
    return <div className='video-invite-container'>
      <p>You have a video call invitation from {videoInvite.from.name}</p>
      <div className='button-group'>
        <button onClick={onVideoInviteAccept}>Accept</button>
        <button onClick={onVideoInviteReject}>Reject</button>
      </div>
    </div>
  }

  return <div id='room-container'>
    { getUserCards() }
    { getVideoConsent() }
  </div>
};

export default Room;
