import { IpcRenderer } from "electron";
import Messages from "./messages";

export const messageFactory = (() => {
  let instance: Messages;
  return {
    getInstance: function(ipcRenderer: IpcRenderer){
        if (instance == null) {
            instance = new Messages(ipcRenderer);
            // Hide the constructor so the returned object can't be new'd...
            instance.constructor = null;
        }
        return instance;
    }
  }; 
})();
