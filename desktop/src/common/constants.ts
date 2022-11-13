export const Init_Window_Ratio = 0.8;
export const EventChannelFromContent = 'message:fromContent';
export const EventChannelFromMain = 'message:fromMain';

export interface EventDataType {
  action: Actions
  data: any
};

export interface EventDataExType extends EventDataType{
  id: string;
};

export enum Actions {
  GetName,
};
