import React from 'react';
import environment from '../shared/environment';

// eslint-disable-next-line import/prefer-default-export
export const EnvironmentContext = React.createContext<typeof environment>({
  scriptsRoot: '',
  storagePath: '',
});
