import { IpcRendererEvent } from 'electron';
import { EventDataType, EventChannelFromSocket } from '../common/constants';

class SocketMessages {
  constructor(callback: (data: EventDataType) => void) {
    window.ipcRenderer.on(EventChannelFromSocket, (evt: IpcRendererEvent, evtData: EventDataType) => {
      callback(evtData);
    });
  }
}

export default SocketMessages;
