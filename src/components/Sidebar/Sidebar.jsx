import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Drawer as MuiDrawer, Toolbar, List, Divider, IconButton, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Dashboard as DashboardIcon, TableView as TableViewIcon } from "@mui/icons-material";
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TocIcon from '@mui/icons-material/Toc';
import { StyledEngineProvider } from '@mui/material/styles';
import { ROUTER } from '../../utils/configs/router.config';
import './Sidebar.scss';

const drawerWidth = 240;
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' }) (
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const Sidebar = (props) => {
    const { currentRouter, setSidebarStatus } = props
    const [open, setOpen] = React.useState(window.innerWidth < 950 ? false : true)
    const [openSubMenu, setOpenSubMenu] = React.useState(false)
    const [routerClick , setRouterClick] = React.useState({
        home: currentRouter === ROUTER.HOME ? true : false,
        transactionDate: currentRouter === ROUTER.TRANSACTION_DATE ? true : false,
        transactionMonth: currentRouter === ROUTER.TRANSACTION_MONTH ? true : false
    })
    const handleClickSidebar = () => {
        if (setSidebarStatus && typeof setSidebarStatus === 'function') {
            setSidebarStatus(!open)
        }
        if (open) {
            setOpenSubMenu(false)
        }
        setOpen(!open);
    };
    const navigate = useNavigate()
    const handleClickEachItemSidebar = (router) => {
        navigate(router || '/')
        switch (router) {
            case ROUTER.HOME:
                setRouterClick({ home: true, transactionDate: false, transactionMonth: false })
                break;
            case ROUTER.TRANSACTION_DATE:
                setRouterClick({ home: false, transactionDate: true, transactionMonth: false })
                break;
            case ROUTER.TRANSACTION_MONTH:
                setRouterClick({ home: false, transactionDate: false, transactionMonth: true })
                break;
            default:
                break;
        } 
    }

    const handleClickTransaction = () => {
        if (!open) {
            setOpen(true)
            setOpenSubMenu(true)
        } else {
            setOpenSubMenu(!openSubMenu);
        }
      };

    window.addEventListener('resize', () => {
        if (window.innerWidth < 950) {
            setOpen(false)
            setOpenSubMenu(false)
            if (setSidebarStatus && typeof setSidebarStatus === 'function') {
                setSidebarStatus(false)
            }
        }
    })

    return (
        <StyledEngineProvider injectFirst>
            <Drawer variant="permanent" open={open}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: open === true ? 'flex-end' : 'flex-start', px: [1] }}>
                    <IconButton onClick={handleClickSidebar}>
                    {open === true ? 
                        <ChevronLeftIcon /> : 
                        <ChevronRightIcon />
                    }
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItemButton sx={routerClick.home ? {backgroundColor: '#ededed'} : {backgroundColor: '#ffffff'}} onClick={() => handleClickEachItemSidebar(ROUTER.HOME)}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Trang chủ" />
                    </ListItemButton>
                    <ListItemButton onClick={handleClickTransaction}>
                        <ListItemIcon>
                            <TableViewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dữ liệu chi tiết" />
                        {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={routerClick.transactionDate ? {backgroundColor: '#ededed', pl: 4} : {backgroundColor: '#ffffff', pl: 4}} onClick={() => handleClickEachItemSidebar(ROUTER.TRANSACTION_DATE)}>
                                <ListItemIcon>
                                    <TocIcon />
                                </ListItemIcon>
                                <ListItemText primary="Báo cáo ngày" />
                            </ListItemButton>
                            <ListItemButton sx={routerClick.transactionMonth ? {backgroundColor: '#ededed', pl: 4} : {backgroundColor: '#ffffff', pl: 4}} onClick={() => handleClickEachItemSidebar(ROUTER.TRANSACTION_MONTH)}>
                                <ListItemIcon>
                                    <TocIcon />
                                </ListItemIcon>
                                <ListItemText primary="Báo cáo tháng" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Drawer>
        </StyledEngineProvider>
    )
}

export default Sidebar;