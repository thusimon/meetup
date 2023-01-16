import fs from 'fs'
import { IpcMainEvent } from 'electron';
import { EventDataType, EventChannelFromMain, EventChannelFromSocket, ElectronActions } from '../common/constants';
import Socket from './socket';

const fsp = fs.promises;

let ws: Socket;

export const backgroundEventHandler = async (evt: IpcMainEvent, msg: EventDataType) => {
  const { action, data } = msg;
  const sender = evt.sender;
  switch (action) {
    case ElectronActions.GetName: {
      const infoFile = await fsp.readFile('./info.json', { encoding: 'utf8' });
      const info = JSON.parse(infoFile);
      msg.data = info.name
      break;
    }
    case ElectronActions.SetName: {
      const infoFile = await fsp.readFile('./info.json', { encoding: 'utf8' });
      const info = JSON.parse(infoFile);
      info.name = msg.data;
      await fsp.writeFile('./info.json', JSON.stringify(info, null, 2), { encoding: 'utf8' });
      break;
    }
    case ElectronActions.InitSocket: {
      ws = new Socket(encodeURI(`ws://localhost:8081/sockets?name=${data}`));
      try {
        await ws.connect();
        msg.data = {};
        ws.onMessage((wsEvent) => {
          sender.send(EventChannelFromSocket, {
            action: ElectronActions.OnSocketMessage,
            data: JSON.parse(wsEvent.data as string)
          });
        });
        ws.onClose((wsEvent) => {
          sender.send(EventChannelFromSocket, {
            action: ElectronActions.OnSocketClose,
            data: wsEvent.reason
          });
        })
      } catch (err) {
        ws = null;
        msg.data = { err };
      }
      break;
    }
    case ElectronActions.SendSocketMessage: {
      if (!ws) {
        msg.data = {err: 'socket is not connected'};
      } else {
        ws.send(JSON.stringify(msg.data));
      }
      break;
    }
    default: {
      break;
    }
  }
  sender.send(EventChannelFromMain, msg);
};
