import { createContext, useContext, useReducer, ReactNode, ReactElement } from 'react';
import { Actions } from '../common/constants';

export interface ContextDataType {
  name?: string;
}

export interface ActionType {
  type: Actions;
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
    case Actions.SetName: {
      return {
        ...state,
        name: data
      };
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
