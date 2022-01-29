import { useEffect, useState } from 'react';
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
import Layout from './containers/Layout/Layout';
import ScriptServiceProvider from './containers/ScriptServeProvider';

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
      <EnvironmentContext.Provider value={environment}>
        <ScriptServiceProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/generate-random-image"
                element={<GenerateRandomImage />}
              />
            </Routes>
          </Layout>
        </ScriptServiceProvider>
      </EnvironmentContext.Provider>
    </Router>
  );
}
