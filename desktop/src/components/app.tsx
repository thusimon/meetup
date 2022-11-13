import { createRoot } from 'react-dom/client';
import { AppContextProvider } from './app-context';
import { messageFactory } from './utils';
import Main from './main';

const App = (): JSX.Element => {
  return (
    <AppContextProvider>
      <Main />
    </AppContextProvider>
  );
}

const root = createRoot(document.getElementById('app'));

root.render(<App />);
