import fs from 'fs'
import { IpcMainEvent } from 'electron';
import { EventDataType, EventChannelFromMain, Actions } from '../common/constants';

const fsp = fs.promises;

export const backgroundEventHandler = async (evt: IpcMainEvent, msg: EventDataType) => {
  const action = msg.action;
  const sender = evt.sender;
  switch (action) {
    case Actions.GetName: {
      const infoFile = await fsp.readFile('./info.json', { encoding: 'utf8' });
      const info = JSON.parse(infoFile);
      msg.data = info.name
      break;
    }
    case Actions.SetName: {
      const infoFile = await fsp.readFile('./info.json', { encoding: 'utf8' });
      const info = JSON.parse(infoFile);
      info.name = msg.data;
      await fsp.writeFile('./info.json', JSON.stringify(info, null, 2), { encoding: 'utf8' });
      break;
    }
    default: {
      break;
    }
  }
  sender.send(EventChannelFromMain, msg);
};
