import { IpcRenderer } from 'electron';
import Messages from '../components/messages';

declare global {
  var ipcRenderer: IpcRenderer;
  var messager: Messages;
}

export {};
