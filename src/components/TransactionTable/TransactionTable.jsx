import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as api from '../../api/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { customToastId } from '../../utils/constant';
import { PlantCode } from '../../utils/configs/app.config';
import './TransactionTable.scss';


const columns = [
    { id: 'stt', label: 'STT', minWidth: 20 },
    { id: 'time', label: 'Thời gian', minWidth: 150 },
    { id: 'cod', label: 'COD (mg/l)', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'tss', label: 'TSS (mg/l)', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'ph', label: 'pH', minWidth: 70, format: (value) => value.toFixed(2) },
    { id: 'temp', label: 'Temp ', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'nh4', label: 'NH4 (mg/l)', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'flow_in_1', label: 'Flow in 1 (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_in_2', label: 'Flow in 2 (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_out', label: 'Flow out (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
];

const columnsV2 = [
    { id: 'stt', label: 'STT', minWidth: 20 },
    { id: 'time', label: 'Thời gian', minWidth: 150 },
    { id: 'cod', label: 'COD (mg/l)', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'tss', label: 'TSS (mg/l)', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'ph', label: 'pH', minWidth: 70, format: (value) => value.toFixed(2) },
    { id: 'temp', label: 'Temp ', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'nh4', label: 'NH4 (mg/l)', minWidth: 120, format: (value) => value.toFixed(2) },
    { id: 'flow_in_1', label: 'Flow in 1 (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_in_2', label: 'Flow in 2 (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_out', label: 'Flow out (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'total_flow_out', label: 'Total flow out (m\u00b3)', minWidth: 150, format: (value) => value.toFixed(2) },
];

const TransactionTable = (props) => {
    const { type, value, plantCode } = props
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalData, setTotalData] = useState(0);
    const [rows, setRows] = useState([]);
    const [tableHeight, setTableHeight] = useState(window.innerHeight * 2 / 3)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    window.addEventListener('resize', () => {
        setTableHeight(window.innerHeight * 2 / 3)
    })

    useEffect(() => {
        const fetchData = async () => {
            if (toast.isActive(customToastId.transaction)) {
                toast.update(customToastId.transaction, { render: "Đang tải dữ liệu ...", isLoading: true })
            } else {
                toast.loading("Đang tải dữ liệu ...", { toastId: customToastId.transaction })
            }
            
            const formatValue = type === 'date' ? dayjs(value).format('DD-MM-YYYY') : dayjs(value).format('MM-YYYY')
            try {
                const responseApi = await api.getDataTable(page + 1, rowsPerPage, type, formatValue, plantCode)
                if (responseApi && responseApi.data && responseApi.data.data) {
                    const dataApi = responseApi.data.data
                    setTotalData(dataApi.total || 0)
                    const dataTable = dataApi.data.map(record => {
                        return {
                            stt: record.index,
                            time: record.TransactionTime != null ? record.TransactionTime : '',
                            cod: record.COD != null ?  record.COD : '',
                            tss: record.TSS != null ? record.TSS : '',
                            ph: record.pH != null ? record.pH : '',
                            temp: record.Temp != null ? record.Temp : '',
                            nh4: record.NH4 != null ? record.NH4 : '',
                            flow_in_1: record.In1 != null ? record.In1 : '',
                            flow_in_2: record.In2 != null ? record.In2 : '',
                            flow_out: record.Out != null ? record.Out : '',
                            total_flow_out: record.TFlowOut != null ? record.TFlowOut : ''
                        }
                    })
                    setRows(dataTable)
                    toast.update(customToastId.transaction, { render: "Tải dữ liệu thành công", type: "success", isLoading: false, autoClose: 2000 })
                } else {
                    toast.update(customToastId.transaction, { render: "Tải dữ liệu thất bại", type: "error", isLoading: false, autoClose: 5000 })
                }
            } catch (e) {
                toast.update(customToastId.transaction, { render: "Tải dữ liệu thất bại", type: "error", isLoading: false, autoClose: 5000 })
            }
        }

        fetchData()
    }, [page, rowsPerPage, type, value, plantCode])

    return (
        <>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: tableHeight }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {plantCode === PlantCode.B407 ? (
                            <>
                            {columns.map((column) => (
                                <TableCell key={column.id} align='center' style={{ minWidth: column.minWidth, fontWeight: 'bold', borderLeft: '1px groove #e6e6e6' }}>
                                    {column.id === 'temp' ? <>{column.label}(&deg;C)</> : column.label}
                                </TableCell>
                            ))}
                            </>
                        ) : (
                            <>
                            {columnsV2.map((column) => (
                                <TableCell key={column.id} align='center' style={{ minWidth: column.minWidth, fontWeight: 'bold', borderLeft: '1px groove #e6e6e6' }}>
                                    {column.id === 'temp' ? <>{column.label}(&deg;C)</> : column.label}
                                </TableCell>
                            ))}
                            </>
                        )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {plantCode === PlantCode.B407 ? (
                                <>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={(column.id === 'stt' || column.id === 'time') ? 'center' : 'right'} 
                                            style={{fontWeight: 'normal', borderLeft: '1px groove #e6e6e6'}}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                    )
                                })}
                                </>
                            ) : (
                                <>
                                {columnsV2.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={(column.id === 'stt' || column.id === 'time') ? 'center' : 'right'} 
                                            style={{fontWeight: 'normal', borderLeft: '1px groove #e6e6e6'}}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                    )
                                })}
                                </>
                            )}
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[50, 100, 200]}
                labelRowsPerPage="Số bản ghi mỗi trang:"
                labelDisplayedRows={({ from, to, count }) => { return `${from}-${to} của ${count}`}}
                component="div"
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </>
    );
}


export default TransactionTable;