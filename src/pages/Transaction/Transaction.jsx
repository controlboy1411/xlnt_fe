import * as React from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Box, FormControl, InputLabel, LinearProgress, MenuItem, Select } from '@mui/material';
import { Button } from 'react-bootstrap';
import { Header, TransactionTable, SummaryTable, Footer, Sidebar } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import Modal from 'react-bootstrap/Modal';
import { ROUTER } from '../../utils/configs/router.config';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from '@mui/x-date-pickers/locales';
import moment from 'moment';
import dayjs from 'dayjs';
import { HOST_URL_API } from '../../utils/configs/api.config';
import { ToastContainer } from 'react-toastify';
import { Plants } from '../../utils/configs/app.config';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './Transaction.scss';


const Transaction = (props) => {
    const { type } = props
    const [sidebarStatus, setSidebarStatus] = useState(window.innerWidth < 950 ? false : true)
    const [responsiveType, setResponsiveType] = useState(window.innerWidth < 800 ? 2 : 1)
    const [showPopupReport, setShowPopupReport] = useState(false)
    const [valueReport, setValueReport] = useState(dayjs(moment().format('YYYY-MM-DD')))
    const [valueInfo, setValueInfo] = useState(dayjs(moment().format('YYYY-MM-DD')))
    const [downloadReportStatus, setDownloadReportStatus] = useState(2)
    const [downloadContent, setDownloadContent] = useState('')
    const [plantCode, setPlantCode] = useState(Plants[0].code)

    const handleChangePlant = (event) => {
        setPlantCode(event.target.value)
    }

    const handleDownloadReport = (type, value) => {
        let urlApi = ''
        let formatValue = ''
        let flagCheckInput = true
        if (value) {
            if (type === 'date') {
                formatValue = dayjs(value).format('DD-MM-YYYY')
            } else if (type === 'month') {
                formatValue = dayjs(value).format('MM-YYYY')
            }
            urlApi = `${HOST_URL_API}/xlnt-api/report/download-report?type=${type}&value=${formatValue}&plantCode=${plantCode}`
        } else {
            flagCheckInput = false
        }
        
        if (flagCheckInput && urlApi) {
            setDownloadReportStatus(2)
            setDownloadContent('Đang tải file ...')
            fetch(urlApi).then((response) => {
                if (!response.ok) {
                    setDownloadReportStatus(4)
                    setDownloadContent('Đã có lỗi xảy ra. Tải file thất bại!')
                    throw new Error("Lỗi khi tải tệp Excel.");
                }
                return response.blob();
            }).then((blob) => {
                setDownloadReportStatus(3)
                setDownloadContent('Tải file thành công!')
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `plant-${plantCode}__transaction-${type}-report-${formatValue}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }).catch((error) => {
                setDownloadReportStatus(4)
                setDownloadContent('Đã có lỗi xảy ra. Tải file thất bại!')
                console.error(error);
            });
        }
    }


    window.addEventListener('resize', () => {
        if (window.innerWidth < 800) {
            setResponsiveType(2)
        } else {
            setResponsiveType(1)
        }
    })

    return (
        <>
        <ThemeProvider theme={createTheme({}, viVN)}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar currentRouter={type === 'date' ? ROUTER.TRANSACTION_DATE : ROUTER.TRANSACTION_MONTH} setSidebarStatus={setSidebarStatus}/>
                <Box component="main" sx={{ backgroundColor: (theme) => 
                    theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                    <div className='transaction-main'>
                        <Header />
                        <div className='mb-3'>
                            {responsiveType === 1 ?
                            <div className='d-flex flex-row row transaction-header'>
                                <div className='col-8 d-flex align-items-center transaction-table-title'>
                                    <div className='transaction-main-select-plant'>
                                        <FormControl fullWidth>
                                            <InputLabel>Nhà máy</InputLabel>
                                            <Select value={plantCode} label='Nhà máy' onChange={handleChangePlant}>
                                                {Plants.map(plant => {
                                                    return (
                                                        <MenuItem value={plant.code}>{plant.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='transaction-main-date-picker'>
                                        <StyledEngineProvider injectFirst>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                                                <DemoContainer components={['DatePicker']} sx={{ml: 4}}>
                                                    <DemoItem>
                                                        {type === 'date' ?
                                                        <DatePicker label='Chọn ngày' format='DD-MM-YYYY' value={valueInfo} onChange={newValue => {setValueInfo(newValue)}}/> :
                                                        <DatePicker label='Chọn tháng' views={['month', 'year']} format='MM-YYYY' value={valueInfo} onChange={newValue => {setValueInfo(newValue)}}/>
                                                        }
                                                    </DemoItem>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </StyledEngineProvider>
                                    </div>
                                </div>
                                <div className="col-4 d-flex justify-content-end">
                                    <Button variant="outline-success" className="transaction-button-download-popup" onClick={() => setShowPopupReport(true)}>
                                        <FontAwesomeIcon icon={faFileDownload} className="transaction-icon-download" />
                                        <span className="transaction-download-content">{type === 'date' ? 'Xuất báo cáo ngày' : 'Xuất báo cáo tháng'}</span>
                                    </Button>
                                </div>
                            </div> :
                            <div className='d-flex flex-column align-items-center transaction-header'>
                                <div className={'d-flex flex-column align-items-center transaction-table-title'}>
                                    <div className='transaction-main-select-plant'>
                                        <FormControl fullWidth>
                                            <InputLabel>Nhà máy</InputLabel>
                                            <Select value={plantCode} label='Nhà máy' onChange={handleChangePlant}>
                                                {Plants.map(plant => {
                                                    return (
                                                        <MenuItem value={plant.code}>{plant.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='transaction-main-date-picker'>
                                        <StyledEngineProvider injectFirst>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                                                <DemoContainer components={['DatePicker']} sx={{ml: sidebarStatus ? 4 : 0}}>
                                                    <DemoItem>
                                                        {type === 'date' ?
                                                        <DatePicker label='Chọn ngày' format='DD-MM-YYYY' value={valueInfo} onChange={newValue => {setValueInfo(newValue)}}/> :
                                                        <DatePicker label='Chọn tháng' views={['month', 'year']} format='MM-YYYY' value={valueInfo} onChange={newValue => {setValueInfo(newValue)}}/>
                                                        }
                                                    </DemoItem>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </StyledEngineProvider>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end mt-2">
                                    <Button variant="outline-success" className="transaction-button-download-popup" onClick={() => setShowPopupReport(true)}>
                                        <FontAwesomeIcon icon={faFileDownload} className="transaction-icon-download" />
                                        <span className="transaction-download-content">{type === 'date' ? 'Xuất báo cáo ngày' : 'Xuất báo cáo tháng'}</span>
                                    </Button>
                                </div>
                            </div>
                            }
                            <div>
                                <StyledEngineProvider injectFirst>
                                    {type === 'month' ?
                                    <div>
                                        <hr className='mt-4'/>
                                        <span className='transaction-table-name'>Số liệu tổng quan</span>
                                        <SummaryTable valueMonth={valueInfo} plantCode={plantCode}/>
                                        <hr className='mt-5'/>
                                        <span className='transaction-table-name'>Số liệu đo chi tiết</span>
                                    </div> : 
                                    <div className='mb-4'></div>
                                    }
                                    <TransactionTable type={type} value={valueInfo} plantCode={plantCode}/>
                                </StyledEngineProvider>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </Box>
            </Box>
            <Modal 
                className='transaction-modal' 
                backdropClassName='transaction-custom-backdrop-modal' 
                show={showPopupReport} 
                animation 
                onHide={() => setShowPopupReport(false)} 
                onShow={() => setDownloadReportStatus(1)}
                onExited={() => setDownloadReportStatus(1)}
            >
                <Modal.Header closeButton>
                    <Modal.Title as='h5'>{type === 'date' ? 'Chọn ngày muốn xuất báo cáo' : 'Chọn tháng muốn xuất báo cáo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-row row align-items-center'>
                    <div className='col-6'>
                        <StyledEngineProvider injectFirst>
                            <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
                                <DemoContainer components={['DatePicker']} >
                                    <DemoItem>
                                        {type === 'date' ?
                                        <DatePicker label='Chọn ngày' format='DD-MM-YYYY' value={valueReport} onChange={newValue => {setValueReport(newValue)}}/> :
                                        <DatePicker label='Chọn tháng' views={['month', 'year']} format='MM-YYYY' value={valueReport} onChange={newValue => {setValueReport(newValue)}}/>
                                        }
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </StyledEngineProvider>
                    </div>
                    <div className='col-6 d-flex justify-content-end' style={{paddingTop: "10px"}}>
                        <Button variant="outline-success" className="transaction-button-download" onClick={() => {handleDownloadReport(type, valueReport)}}>
                            <FontAwesomeIcon icon={faFileDownload} className="transaction-icon-download" />
                            <span className="transaction-download-content">Download</span>
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='transaction-loading-bar'>
                        {downloadReportStatus === 2 ?
                        <>
                            <div>{downloadContent}</div>
                            <Box sx={{ width: '50%', marginTop: '10px' }}>
                                <LinearProgress color='success'/>
                            </Box>
                        </> :
                        downloadReportStatus === 3 ?
                        <div className='d-flex flex-row'>
                            <CheckCircleIcon color='success' sx={{marginRight: '8px'}}/>
                            <div>{downloadContent}</div>
                        </div> :
                        downloadReportStatus === 4 ?
                        <div className='d-flex flex-row'>
                            <WarningIcon color='error' sx={{marginRight: '8px'}}/>
                            <div>{downloadContent}</div>
                        </div> : 
                        <></>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </ThemeProvider>
        <ToastContainer pauseOnFocusLoss={false}/>
        </>
    )
}

export default Transaction;