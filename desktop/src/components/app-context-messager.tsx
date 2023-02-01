import { useEffect } from 'react';
import WebRTCConnection from '../common/webRTC';
import { AppContextActions, ElectronActions, EventDataType, SocketActions } from '../common/constants';
import { useAppContext } from './app-context';

const AppContextMessager = () => {
  const { dispatch } = useAppContext();
  useEffect(() => {
    const init = async () => {
      socketListener.registerListener(async (socketResp: EventDataType) => {
        const {msg, data} = socketResp.data;
        switch (msg) {
          case SocketActions.GetCurrentUser: {
            if (data) {
              console.log('SetCurrentUser', data);
              dispatch({type: AppContextActions.SetCurrentUser, data});
            }
            break;
          }
          case SocketActions.GetAllUsers: {
            if (data) {
              console.log('SetUsers', data);
              dispatch({type: AppContextActions.SetUsers, data});
            }
            break;
          }
          case SocketActions.VideoInvite: {
            if (data) {
              console.log('SetVideoInvite', data);
              dispatch({type: AppContextActions.SetVideoInvite, data});
            }
            break;
          }
          case SocketActions.VideoInviteAccept: {
            // caller: invitation is accepted by callee
            // now we can establish WebRTC connection between from.id and to.id
            // and actually the callee also has already created a WebRTC connection
            // caller need to send WebRTC offer to callee
            const webRTC = new WebRTCConnection(data);
            const webRTCOffer = await webRTC.peerConnection.createOffer();
            await webRTC.peerConnection.setLocalDescription(webRTCOffer);
            const offer = {
              sdp: webRTCOffer.sdp,
              type: webRTCOffer.type
            };
            data.offer = offer;
            await messager.sendMessage({
              action: ElectronActions.SendSocketMessage,
              data: {
                msg: SocketActions.SendWebRTCOffer,
                data: data
              }
            });
            console.log('SetVideoInviteAccept', data);
            dispatch({type: AppContextActions.SetVideoInviteAccept, data: webRTC});
            break;
          }
          case SocketActions.VideoInviteReject: {
            console.log('SetVideoInviteReject', data);
            data.type = 'reject';
            dispatch({type: AppContextActions.SetVideoInviteReject, data});
            break;
          }
          case SocketActions.SendWebRTCOffer: {
            console.log('SendWebRTCOffer', data);
            dispatch({type: AppContextActions.SendWebRTCOffer, data});
            break;
          }
          case SocketActions.SendWebRTCAnswer: {
            console.log('SendWebRTCAnswer', data);
            dispatch({type: AppContextActions.SendWebRTCAnswer, data});
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

  return <></>;
};

export default AppContextMessager;
