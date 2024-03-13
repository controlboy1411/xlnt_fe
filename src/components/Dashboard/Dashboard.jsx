import { OneColumnChart, BoxData } from '../../shared';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import WarningIcon from '@mui/icons-material/Warning';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import * as api from '../../api/api';
import { standardParameter } from '../../utils/constant';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PlantCode, Plants } from '../../utils/configs/app.config';
import './Dashboard.scss';

const Dashboard = () => {
    const [fetchBoxData, setFetchBoxData] = useState({loading: true, error: false})
    const [fetchChartData, setFetchChartData] = useState({loading: true, error: false})
    const [showPopup, setShowPopup] = useState(false)
    const [useEffectFlag, setUseEffecFlag] = useState(false)
    const [popupContent, setPopupContent] = useState('')
    const [blockHeight, setBlockHeight] = useState(window.innerHeight * 2 / 3)
    const [chartData, setChartData] = useState({Cod: 0, Tss: 0, pH: 0, Temp: 0, Amoni: 0})
    const [boxData, setBoxData] = useState({Cod: 0, Tss: 0, pH: 0, Temp: 0, Amoni: 0, Flow_In1: 0, Flow_In2: 0, Flow_Out: 0, Total_In1: 0, Total_In2: 0, Total_Out: 0, Total_Flowout: 0})
    const [plantCode, setPlantCode] = useState(Plants[0].code)

    const handleChangePlant = (event) => {
        setPlantCode(event.target.value)
    }

    setInterval(() => {
        setUseEffecFlag(!useEffectFlag)
    }, 1000 * 300)

    window.addEventListener('resize', () => {
        setBlockHeight(window.innerHeight * 2 / 3)
    })

    useEffect(() => {
        const fetchData = async () => {
            setFetchChartData({loading: true, error: false})
            try {
                const chartResponseApi = await api.getChartData(plantCode)
                if (chartResponseApi && chartResponseApi.data && chartResponseApi.data.data) {
                    const chartDataResult = chartResponseApi.data.data
                    setChartData({
                        Cod: chartDataResult.COD || 0,
                        Tss: chartDataResult.TSS || 0,
                        pH: chartDataResult.pH || 0,
                        Temp: chartDataResult.Temp || 0,
                        Amoni: chartDataResult.Amoni || 0
                    })
                    setFetchChartData({loading: false, error: false})
                    
                    const paramsWarning = []
                    if (Number(chartDataResult.COD) >= standardParameter.Cod) {
                        paramsWarning.push('COD')
                    }
                    if (Number(chartDataResult.TSS) >= standardParameter.Tss) {
                        paramsWarning.push('TSS')
                    }
                    if (Number(chartDataResult.pH) >= standardParameter.pH) {
                        paramsWarning.push('pH')
                    }
                    if (Number(chartDataResult.Temp) >= standardParameter.Temp) {
                        paramsWarning.push('TEMP')
                    }
                    if (Number(chartDataResult.Amoni) >= standardParameter.Amoni) {
                        paramsWarning.push('AMONI')
                    }
                    
                    if (paramsWarning.length > 0) {
                        setPopupContent(paramsWarning.join(', '))
                        setShowPopup(true)
                    }
                } else {
                    setFetchChartData({loading: false, error: true})
                }
            } catch (e) {
                setFetchChartData({loading: false, error: true})
            }

            setFetchBoxData({loading: true, error: false})
            try {
                const boxResponseApi = await api.getBoxData(plantCode)
                if (boxResponseApi && boxResponseApi.data && boxResponseApi.data.data) {
                    const boxResult = boxResponseApi.data.data
                    setBoxData({
                        Cod: boxResult.COD || 0,
                        Tss: boxResult.TSS || 0,
                        pH: boxResult.pH || 0,
                        Temp: boxResult.Temp || 0,
                        Amoni: boxResult.Amoni || 0,
                        Flow_In1: boxResult.Flow_In1 || 0,
                        Flow_In2: boxResult.Flow_In2 || 0,
                        Flow_Out: boxResult.Flow_Out || 0,
                        Total_In1: boxResult.Total_In1 || 0,
                        Total_In2: boxResult.Total_In2 || 0,
                        Total_Out: boxResult.Total_Out || 0,
                        Total_Flowout: boxResult.TFlowOut || 0
                    })
                    setFetchBoxData({loading: false, error: false})
                } else {
                    setFetchBoxData({loading: false, error: true})
                }
            } catch (e) {
                setFetchBoxData({loading: false, error: true})
            }
        }

        fetchData()
    }, [useEffectFlag, plantCode])

    return (
        <div>
            <div className='dashboard-main'>
                <div className='dashboard-main-select-plant'>
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
                <div className='row row-cols-sm-1 d-flex mt-3'>
                    <div className='col-sm-6 mb-3'>
                        <div className='dashboard-board' style={{height: blockHeight}}>
                            {fetchBoxData.loading ?
                            <div className='dashboard-loading-bar'>
                                <div>Đang tải ...</div>
                                <Box sx={{ width: '35%', marginTop: '5px' }}>
                                    <LinearProgress color='success'/>
                                </Box>
                            </div> :
                            fetchBoxData.error ?
                            <div className='d-flex flex-row'>
                                <WarningIcon color='error' sx={{marginRight: '8px'}}/>
                                <div>Đã có lỗi xảy ra. Tải dữ liệu thất bại!</div>
                            </div> :
                            <div className='row row-cols-sm-3 row-cols-md-4'>
                                <div className='col-3 p-2 d-flex justify-content-center'><BoxData title='COD' unit='mg/L' value={boxData.Cod} backgroundColor={'#3bb713'}/></div>
                                <div className='col-3 p-2 d-flex justify-content-center'><BoxData title='TSS' unit='mg/L' value={boxData.Tss} backgroundColor={'#7fbaf5'}/></div>
                                <div className='col-3 p-2 d-flex justify-content-center'><BoxData title='pH' unit='' value={boxData.pH} backgroundColor={'#bdb127'}/></div>
                                <div className='col-3 p-2 d-flex justify-content-center'><BoxData title='TEMP' unit='&deg;C' value={boxData.Temp} backgroundColor={'#0eada5'}/></div>
                                {plantCode === PlantCode.B407 && (
                                    <>
                                        <div className='col-3 p-2 d-flex justify-content-center'>
                                            <BoxData title='AMONI' unit='mg/L' value={boxData.Amoni} backgroundColor={'#b9ad25'}/>
                                        </div>
                                        <div className='col-3 p-2 d-flex justify-content-center'>
                                            <BoxData title='FLOW IN1' unit='m&sup3;/h' value={boxData.Flow_In1} backgroundColor={'#f58716'}/>
                                        </div>
                                        <div className='col-3 p-2 d-flex justify-content-center'>
                                            <BoxData title='FLOW IN2' unit='m&sup3;/h' value={boxData.Flow_In2} backgroundColor={'#f50e63'}/>       
                                        </div>
                                    </>
                                )}
                                <div className='col-3 p-2 d-flex justify-content-center'>
                                    <BoxData title='FLOW OUT' unit='m&sup3;/h' value={boxData.Flow_Out} backgroundColor={'#28db12'}/>
                                </div>
                                {plantCode === PlantCode.B457 && (
                                    <div className='col-3 p-2 d-flex justify-content-center'>
                                        <BoxData title='TOTAL FLOW OUT' unit='m&sup3;' value={boxData.Total_Flowout} backgroundColor={'#2a8285'}/>
                                    </div>
                                )}
                            </div>
                            }
                        </div>
                    </div>
                    <div className='col-sm-6 mb-3'>
                        <div className='dashboard-chart' style={{height: blockHeight, justifyContent: (fetchChartData.loading || fetchChartData.error) ? 'center' : 'space-between'}}>
                            {fetchChartData.loading ?
                            <div className='dashboard-loading-bar'>
                                <div>Đang tải ...</div>
                                <Box sx={{ width: '35%', marginTop: '5px' }}>
                                    <LinearProgress color='success'/>
                                </Box>
                            </div> :
                            fetchChartData.error ?
                            <div className='d-flex flex-row'>
                                <WarningIcon color='error' sx={{marginRight: '8px'}}/>
                                <div>Đã có lỗi xảy ra. Tải dữ liệu thất bại!</div>
                            </div> :
                            <>
                                <OneColumnChart currentValue={chartData.Cod} maxValue={standardParameter.Cod} title='COD' progressColor={'#3bb713'}/>
                                <OneColumnChart currentValue={chartData.Tss} maxValue={standardParameter.Tss} title='TSS' progressColor={'#7fbaf5'}/>
                                <OneColumnChart currentValue={chartData.pH} maxValue={standardParameter.pH} title='pH' progressColor={'#bdb127'}/>
                                <OneColumnChart currentValue={chartData.Temp} maxValue={standardParameter.Temp} title='TEMP' progressColor={'#0eada5'}/>
                                <OneColumnChart currentValue={chartData.Amoni} maxValue={standardParameter.Amoni} title='AMONI' progressColor={'#b9ad25'}/>
                            </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showPopup} animation onHide={() => setShowPopup(false)} className='dashboard-popup-warning' backdropClassName='dashboard-popup-warning-backdrop'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className='modal-warning-title'>
                            <FontAwesomeIcon icon={faTriangleExclamation} color='#96310f' className="icon-warning" />
                            <span>Cảnh báo</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{`Chỉ số ${popupContent} đã đạt tới ngưỡng tối đa!`}</Modal.Body>
            </Modal>
        </div>
    )
}

export default Dashboard