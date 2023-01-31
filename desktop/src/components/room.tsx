import React, { useEffect, useState } from "react";
import { AppContextActions, ElectronActions, EventDataType, SocketActions } from "../common/constants";
import { ContextDataType, useAppContext } from './app-context';
import WebRTCConnection from "../common/webRTC";

import CameraOn from '../assets/camera-on.svg';
import MicOn from '../assets/mic-on.svg';

import './room.scss';

const Room = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const { state, dispatch } = useAppContext();

  useEffect(() => {
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
