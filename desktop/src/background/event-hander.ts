import { IpcMainEvent } from 'electron';
import { EventDataType, EventChannelFromMain } from '../common/constants';

export const backgroundEventHandler = (evt: IpcMainEvent, data: EventDataType) => {
  const action = data.action;
  const sender = evt.sender;
  switch (action) {
    default: {
      sender.send(EventChannelFromMain, data);
      break;
    }
  }
};
