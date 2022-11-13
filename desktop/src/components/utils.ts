import { IpcRenderer } from "electron";
import Messages from "./messages";

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
