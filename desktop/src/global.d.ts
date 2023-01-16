import { IpcRenderer } from 'electron';
import Messages from './components/messages';
import SocketListener from './components/socket-listener';

declare global {
  const ipcRenderer: IpcRenderer;
  const messager: Messages;
  const socketListener: SocketListener;
}

export {};
