import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './app-context';
import Main from './main';
import Splash from './splash';
import Login from './login';

const App = (): JSX.Element => {
  return (
    <HashRouter>
      <AppContextProvider>
        <Routes>
          <Route path='/' element={<Navigate replace to='/splash' />} />
          <Route path='/splash' element={<Splash />} />
          <Route path='/login' element={<Login />} />
          <Route path='/main' element={<Main />} />
        </Routes>
      </AppContextProvider>
    </HashRouter>
  );
}

const root = createRoot(document.getElementById('app'));

root.render(<App />);
