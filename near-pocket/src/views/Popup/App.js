import Router from './Router';
import Container from '@mui/material/Container';
import AlertModal from '../../components/common/AlertModal';

const App = () => {
  return (
    <Container fixed disableGutters sx={{ width: '360px', height: '600px', overflowY: 'auto' }}>
      <AlertModal />
      <Router />
    </Container>
  );
};

export default App;
