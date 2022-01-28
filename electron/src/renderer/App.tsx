import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Dashboard from './Dashboard';
import GenerateRandomImage from './containers/GenerateRandomImage';
import { EnvironmentContext } from './contexts';

import { M, R } from '../shared/events';
import Env from '../shared/environment';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ipcRenderer.once('ipc-example', () => {
  console.log('ipc-example');
});
ipcRenderer.send('ipc-example', { message: 'ping' });

export default function App() {
  const [environment, setEnvironment] = useState<typeof Env>({
    scriptsRoot: '',
    storagePath: '',
  });
  useEffect(() => {
    M.requestEnv.send();
    const unsubscribe = R.sendEnv.register((_event, data) => {
      setEnvironment(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <EnvironmentContext.Provider value={environment}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          theme="colored"
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/generate-random-image"
            element={<GenerateRandomImage />}
          />
        </Routes>
      </EnvironmentContext.Provider>
    </Router>
  );
}
