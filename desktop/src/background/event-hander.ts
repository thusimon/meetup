import { IpcMainEvent } from 'electron';
import { EventDataType, EventChannelFromMain } from '../common/constants';

export const backgroundEventHandler = (evt: IpcMainEvent, data: EventDataType) => {
  console.log(5, data);
  const action = data.action;
  const sender = evt.sender;
  switch (action) {
    default: {
      sender.send(EventChannelFromMain, data);
      console.log(11, 'already send data', EventChannelFromMain, data);
    }
    break;
  }
};
