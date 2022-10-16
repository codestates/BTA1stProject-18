import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './views/Popup/App';
import { store, persistor } from './redux/store';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './utils/theme';
import { AlertProvider } from './contexts/AlertContext';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <AlertProvider>
          <CssBaseline />
          <App />
        </AlertProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
