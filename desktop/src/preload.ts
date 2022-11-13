// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { EventChannelFromMain, EventDataExType } from "./common/constants";
import { messageFactory } from './components/utils';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

// As an example, here we use the exposeInMainWorld API to expose the IPC renderer 
// to the main window. They'll be accessible at "window.ipcRenderer".
process.once('loaded', () => {
  contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

  console.log(15555);
  // ipcRenderer.on(EventChannelFromMain, (evt, evtData: EventDataExType) => {
  //   console.log(21, evtData);
  // });

  const messager = messageFactory.getInstance(ipcRenderer);
  // window.ipcRenderer = ipcRenderer;
  // console.log(window.ipcRenderer.on);
});
