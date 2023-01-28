import { createContext, useContext, useReducer, ReactNode, ReactElement } from 'react';
import WebRTCConnection from '../common/webRTC';
import { AppContextActions } from '../common/constants';

export interface ContextDataType {
  name?: string;
  me?: any;
  users?: any[];
  videoInvite?: any;
  videoInviteResp?: any;
  webRTC?: WebRTCConnection;
  webRTCOffer?: any;
  webRTCAnswer?: any;
}

export interface ActionType {
  type: AppContextActions;
  data: any;
};

export interface ContextType {
  state: ContextDataType
  dispatch: (message: ActionType) => void
}

const initContextData: ContextDataType = {
};

const AppReducer = (state: ContextDataType, action: ActionType): ContextDataType => {
  const { type, data } = action;
  switch (type) {
    case AppContextActions.SetName: {
      return {
        ...state,
        name: data
      };
    }
    case AppContextActions.SetCurrentUser: {
      return {
        ...state,
        me: data,
      };
    }
    case AppContextActions.SetUsers: {
      return {
        ...state,
        users: data,
      };
    }
    case AppContextActions.SetVideoInvite: {
      return {
        ...state,
        videoInvite: data
      }
    }
    case AppContextActions.SetVideoInviteReject: {
      return {
        ...state,
        videoInviteResp: data
      }
    }
    case AppContextActions.SetVideoInviteAccept: {
      return {
        ...state,
        webRTC: data
      }
    }
    case AppContextActions.SendWebRTCOffer: {
      return {
        ...state,
        webRTCOffer: data
      }
    }
    case AppContextActions.SendWebRTCAnswer: {
      return {
        ...state,
        webRTCAnswer: data
      }
    }
    default:
      return state;
  }
};

const AppContext = createContext<ContextType>({} as any);

interface ProviderPropType {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: ProviderPropType): ReactElement => {
  const [state, dispatch] = useReducer(AppReducer, initContextData);
  // NOTE: you *might* need to memoize this value
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): ContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};
