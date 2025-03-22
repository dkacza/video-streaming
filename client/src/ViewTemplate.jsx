import {Box, Card, Typography, IconButton} from '@mui/joy';
import ListIcon from '@mui/icons-material/List';
import {useNavigate} from 'react-router-dom';



const ViewTemplate = function(props) {
  const navigate = useNavigate();

  const containerStyles = {
    width: '100vw',
    height: '100vh',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Box className="container" sx={containerStyles}>
      <Card variant="outlined" color="primary" sx={{width: '100vw', padding: '1rem', "--Card-radius": "0", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', }}>
          <Typography level='h2' color='primary'>Video Streaming</Typography>
          <Typography level='body-sm'>Politechnika Śląska - Systemy Interaktywne i Multimedialne - 2025</Typography>
        </Box>
        <IconButton variant='outlined' color='primary' size='lg' onClick={() => {navigate('/')}}>
          <ListIcon></ListIcon>
        </IconButton>
      </Card>

      <Box
        className="main-content"
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}>
        {props.children}
      </Box>
    </Box>
  );
}
export default ViewTemplate;