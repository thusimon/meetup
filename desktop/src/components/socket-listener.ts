import { IpcRendererEvent, IpcRenderer } from 'electron';
import { EventDataType, EventChannelFromSocket } from '../common/constants';

class SocketListener {
  ipcRenderer: Electron.IpcRenderer;
  constructor(ipcRenderer: IpcRenderer) {
    this.ipcRenderer = ipcRenderer;
  }
  registerListener = (callback: (arg: EventDataType) => void) => {
    this.ipcRenderer.on(EventChannelFromSocket, (evt: IpcRendererEvent, evtData: EventDataType) => {
      callback(evtData);
    });
  }
}

export default SocketListener;
