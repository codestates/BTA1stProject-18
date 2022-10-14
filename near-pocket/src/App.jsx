import Router from './Router';
import Container from '@mui/material/Container';
import { Box } from '@mui/system';

const App = () => {
  return (
    <Container sx={{ width: '400px', height: '600px' }} maxWidth='sm'>
      <Box textAlign='center' mt={5}>
        <Router />
      </Box>
    </Container>
  );
};

export default App;
