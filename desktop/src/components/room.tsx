import React, { useEffect, useState } from "react";
import { AppContextActions, ElectronActions, EventDataType, SocketActions } from "../common/constants";
import { useAppContext } from './app-context';
import WebRTCConnection from "../common/webRTC";

import CameraOn from '../assets/camera-on.svg';
import MicOn from '../assets/mic-on.svg';

import './room.scss';
import SocketListener from "./socket-listener";

const Room = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [thisUser, setThisUser] = useState<any>({});
  const [videoInvite, setVideoInvite] = useState<any>(null);
  const [videoInviteResp, setVideoInviteResp] = useState<any>(null);
  const [webRTC, setWebRTC] = useState(null);
  const { dispatch } = useAppContext();

  useEffect(() => {
    const init = async () => {
      socketListener.registerListener(async (socketResp: EventDataType) => {
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
            // caller: invitation is accepted by callee
            // now we can establish WebRTC connection between from.id and to.id
            // and actually the callee also has already created a WebRTC connection
            // caller need to send WebRTC offer to callee
            const webRTC = new WebRTCConnection();
            const offer = await webRTC.createOffer();
            data.offer = offer;
            await messager.sendMessage({
              action: ElectronActions.SendSocketMessage,
              data: {
                msg: SocketActions.SendWebRTCOffer,
                data: data
              }
            });
            //dispatch({type: AppContextActions.SetWebRTCConnection, data: webRTC});
            break;
          }
          case SocketActions.VideoInviteReject: {
            setVideoInviteResp(data);
            break;
          }
          case SocketActions.SendWebRTCOffer: {
            console.log('send webrtc offer', data);
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
          from: {id: thisUser.id},
          to: {id: selectedUserId}
        }
      }
    });
  }

  const onVoiceCallClick = (evt: React.MouseEvent) => {

  }

  const sendWebRTCOffer = (webRTC: WebRTCConnection) => {

  }
  const onVideoInviteAccept = async () => {
    // callee: accept invitation from caller
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInviteAccept,
        data: videoInvite
      }
    });
    setVideoInvite(null);
    const webRTC = new WebRTCConnection();

    dispatch({type: AppContextActions.SetWebRTCConnection, data: webRTC});
  }

  const onVideoInviteRespReject = () => {
    setVideoInviteResp(null);
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
    return <div className='modal'>
      <p>You have a video call invitation from {videoInvite.from.name}</p>
      <div className='button-group'>
        <button onClick={onVideoInviteAccept}>Accept</button>
        <button onClick={onVideoInviteReject}>Reject</button>
      </div>
    </div>
  }

  const getVideoConsentResp = () => {
    if (!videoInviteResp) {
      return <></>;
    }
    return <div className='modal'>
      <p>{videoInviteResp.to.name} has rejected your invitation</p>
      <div className='button-group'>
        <button onClick={onVideoInviteRespReject}>OK</button>
      </div>
    </div>
  }

  return <div id='room-container'>
    { getUserCards() }
    { getVideoConsent() }
    { getVideoConsentResp() }
  </div>
};

export default Room;
