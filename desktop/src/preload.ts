// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { messageFactory, socketListenerFactory } from './components/utils';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

// As an example, here we use the exposeInMainWorld API to expose the IPC renderer 
// to the main window. They'll be accessible at "window.ipcRenderer".
process.once('loaded', () => {
  const messager = messageFactory.getInstance(ipcRenderer);
  const socketListener = socketListenerFactory.getInstance(ipcRenderer);
  console.log(14, socketListener, messager);
  contextBridge.exposeInMainWorld('socketListener', socketListener);
  contextBridge.exposeInMainWorld('messager', messager);
});
