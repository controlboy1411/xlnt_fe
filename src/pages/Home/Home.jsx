import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Header, Dashboard, Footer, Sidebar } from '../../components';
import { ROUTER } from '../../utils/configs/router.config';
import './Home.scss';


const Home = () => {
    return (
        <ThemeProvider theme={createTheme()}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar currentRouter={ROUTER.HOME} />
                <Box component="main" sx={{ backgroundColor: (theme) => 
                    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                    <div className='home-main'>
                        <Header />
                        <Dashboard />
                        <Footer />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Home;