import React, { useEffect, useState } from "react";
import { AppContextActions, ElectronActions, EventDataType, SocketActions } from "../common/constants";
import { ContextDataType, useAppContext } from './app-context';
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
  const [webRTC, setWebRTC] = useState<WebRTCConnection>(null);
  const { state, dispatch } = useAppContext();

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
            console.log('52 send webrtc offer', data);
            await messager.sendMessage({
              action: ElectronActions.SendSocketMessage,
              data: {
                msg: SocketActions.SendWebRTCOffer,
                data: data
              }
            });
            // setWebRTC(webRTC);
            // dispatch({type: AppContextActions.SetWebRTCConnection, data: webRTC});
            break;
          }
          case SocketActions.VideoInviteReject: {
            setVideoInviteResp(data);
            break;
          }
          case SocketActions.SendWebRTCOffer: {
            console.log('68 on send webrtc offer', data);
            console.log(state, webRTC);
            // const webRTC = state.webRTC;
            await webRTC.peerConnection.setRemoteDescription(data.offer);
            const answer = await webRTC.peerConnection.createAnswer();
            console.log(72, answer)
            await webRTC.peerConnection.setLocalDescription(answer);
            // await messager.sendMessage({
            //   action: ElectronActions.SendSocketMessage,
            //   data: {
            //     msg: SocketActions.SendWebRTCAnswer,
            //     data: data
            //   }
            // });
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
    // init();
    console.log('got webRTC offer', state.webRTC, state.webRTCOffer);
    handleWebRTCOffer(state);
  }, [state.webRTCOffer]);

  useEffect(() => {
    console.log('got webRTC answer', state.webRTC, state.webRTCAnswer);
    handleWebRTCAnswer(state);
  }, [state.webRTCAnswer]);

  const onUserClick = (evt: React.MouseEvent) => {
    const id = evt.currentTarget.getAttribute('data-se');
    if (selectedUserId === id) {
      setSelectedUserId('');
    } else {
      setSelectedUserId(id);
    }
  }

  const onVideoCallClick = (evt: React.MouseEvent) => {
    const me = state.me;
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInvite,
        data: {
          from: {id: me.id},
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
    const videoInvite = state.videoInvite;
    if (!videoInvite) {
      return;
    }
    const webRTC = new WebRTCConnection();
    dispatch({type: AppContextActions.SetVideoInviteAccept, data: webRTC});
    dispatch({type: AppContextActions.SetVideoInvite, data: null});
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInviteAccept,
        data: videoInvite
      }
    });
  }

  const onVideoInviteRespReject = () => {
    dispatch({type: AppContextActions.SetVideoInviteReject, data: null});
  }

  const onVideoInviteReject = () => {
    dispatch({type: AppContextActions.SetVideoInvite, data: null});
    messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.VideoInviteReject,
        data: state.videoInvite
      }
    });
  }

  const handleWebRTCOffer = async (state: ContextDataType) => {
    const { webRTC, webRTCOffer } = state;
    if (!webRTC || !webRTCOffer) {
      return;
    }
    await webRTC.peerConnection.setRemoteDescription(new RTCSessionDescription(webRTCOffer.offer));
    const webRTCAnswer = await webRTC.peerConnection.createAnswer();
    await webRTC.peerConnection.setLocalDescription(webRTCAnswer);
    const answer = {
      sdp: webRTCAnswer.sdp,
      type: webRTCAnswer.type
    };
    const data = {
      from: webRTCOffer.from,
      to: webRTCOffer.to,
      answer
    }
    await messager.sendMessage({
      action: ElectronActions.SendSocketMessage,
      data: {
        msg: SocketActions.SendWebRTCAnswer,
        data: data
      }
    });

  }

  const handleWebRTCAnswer = async (state: ContextDataType) => {
    const { webRTC, webRTCAnswer } = state;
    if (!webRTC || !webRTCAnswer) {
      return;
    }
    webRTC.peerConnection.setRemoteDescription(new RTCSessionDescription(webRTCAnswer.answer));
  }
  console.log(164, state.webRTC);
  const getUserCards = () => {
    const users = state.users || [];
    const me = state.me || {};
    return users.map((user, idx) => {
      const isSelfUser = user.id === me.id;
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
    const videoInvite = state.videoInvite;
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
    const videoInviteResp = state.videoInviteResp;
    if (!videoInviteResp) {
      return <></>;
    }

    if (videoInviteResp.type = 'reject') {
      return <div className='modal'>
        <p>{videoInviteResp.to.name} has rejected your invitation</p>
        <div className='button-group'>
          <button onClick={onVideoInviteRespReject}>OK</button>
        </div>
      </div>
    }
  }

  return <div id='room-container'>
    { getUserCards() }
    { getVideoConsent() }
    { getVideoConsentResp() }
  </div>
};

export default Room;
