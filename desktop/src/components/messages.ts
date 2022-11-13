import { IpcRenderer, IpcRendererEvent } from 'electron';
import { EventDataType, EventDataExType, EventChannelFromContent, EventChannelFromMain } from '../common/constants';
import Deferred from '../common/deferred';

class Messages {
  messagesPromises: {[key: string]: Deferred<EventDataExType>} = {};
  ipcRenderer: Electron.IpcRenderer;
  constructor(ipcRenderer: IpcRenderer) {
    this.ipcRenderer = ipcRenderer;
    ipcRenderer.on(EventChannelFromMain, (evt: IpcRendererEvent, evtData: EventDataExType) => {
      const id = evtData.id;
      const promise = this.messagesPromises[id];
      if (!promise) {
        return;
      }
      promise.resolve(evtData);
      // delete the promise recoreds
      delete this.messagesPromises[id];
    });
  }

  sendMessage = async (evtData: EventDataType) => {
    const id = crypto.randomUUID();
    const result = new Deferred<EventDataExType>();
    this.messagesPromises[id] = result;
    this.ipcRenderer.send(EventChannelFromContent, {...evtData, ...{id}});
    return result.promise;
  }
}

export default Messages;
