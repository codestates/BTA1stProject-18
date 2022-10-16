import { Alert } from '@mui/material';
import useAlert from '../../hooks/useAlert';

const AlertModal = () => {
  const { type, text } = useAlert();
  const { setAlert } = useAlert();

  if (type && text) {
    return (
      <Alert
        onClose={() => setAlert('', '')}
        severity={type}
        sx={{
          position: 'absolute',
          top: 68,
          left: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        {text}
      </Alert>
    );
  } else {
    return <></>;
  }
};

export default AlertModal;
