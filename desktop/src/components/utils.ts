import { IpcRenderer } from "electron";
import Messages from "./messages";
import SocketListener from "./socket-listener";

export const messageFactory = (() => {
  let instance: Messages;
  return {
    getInstance: function(ipcRenderer: IpcRenderer){
      if (!instance) {
        instance = new Messages(ipcRenderer);
      }
      return instance;
    }
  }; 
})();

export const socketListenerFactory = (() => {
  let instance: SocketListener;
  return {
    getInstance: function(ipcRenderer: IpcRenderer) {
      if (!instance) {
        instance = new SocketListener(ipcRenderer);
      }
      return instance;
    }
  }
})();
