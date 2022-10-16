import { createContext, useState } from 'react';

const ALERT_TIME = 5000;
const initialState = {
  type: '',
  text: '',
};

const AlertContext = createContext({
  ...initialState,
  setAlert: () => {},
});

export const AlertProvider = ({ children }) => {
  const [type, setType] = useState('');
  const [text, setText] = useState('');

  const setAlert = (type, text) => {
    setType(type);
    setText(text);

    setTimeout(() => {
      setType('');
      setText('');
    }, ALERT_TIME);
  };

  return (
    <AlertContext.Provider
      value={{
        type,
        text,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
