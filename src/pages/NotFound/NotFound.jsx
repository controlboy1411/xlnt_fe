import { Button } from "react-bootstrap";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Header, Footer, Sidebar } from '../../components';
import "./NotFound.scss";
import { useState } from "react";

const NotFound = () => {
    const [bodyHeight, setBodyHeight] = useState(window.innerHeight * 0.7)
    const navigate = useNavigate()

    window.addEventListener('resize', () => {
        setBodyHeight(window.innerHeight * 0.7)
    })

    return (
        <ThemeProvider theme={createTheme()}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box component="main" sx={{ backgroundColor: (theme) => 
                    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                    <div className="not-found-container">
                        <Header />
                        <div className="not-found-body" style={{minHeight: bodyHeight}}>
                            <div className="not-found-body-main">
                                <h1 className="mb-3">404 - Page Not Found</h1>
                                <Button variant="success" size="md" onClick={() => navigate('/')}>Back to Home</Button>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default NotFound;