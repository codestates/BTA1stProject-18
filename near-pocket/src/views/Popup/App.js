import Router from './Router';
import Container from '@mui/material/Container';
import { Box } from '@mui/system';

const App = () => {
  return (
    <Container fixed sx={{ width: '360px', height: '600px', overflowY: 'auto' }}>
      <Box>
        <Router />
      </Box>
    </Container>
  );
};

export default App;
