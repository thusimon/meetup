export const Init_Window_Ratio = 0.8;
export const EventChannelFromContent = 'message:fromContent';
export const EventChannelFromMain = 'message:fromMain';
export const EventChannelFromSocket = 'message:fromSocketServer';

export interface EventDataType {
  action: ElectronActions
  data?: any
};

export interface EventDataExType extends EventDataType{
  id: string;
};

export enum AppContextActions {
  SetName
};

export enum ElectronActions {
  GetName,
  SetName,
  InitSocket,
  OnSocketMessage,
  OnSocketClose,
  SendSocketMessage
};

export enum SocketActions {
  GetCurrentUser = 'GetCurrentUser',
  GetAllUsers = 'GetAllUsers',
  VideoInvite = 'VideoInvite',
  VideoInviteAccept = 'VideoInviteAccept',
  VideoInviteReject = 'VideoInviteReject'
}

export const VideoStreamConstraints = {
  audio: true,
  video: true,
};
