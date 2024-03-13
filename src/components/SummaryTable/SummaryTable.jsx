import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './SummaryTable.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import * as api from '../../api/api';
import dayjs from 'dayjs';

const columns = [
    { id: 'desc', label: '', minWidth: 200 },
    { id: 'cod', label: 'COD (mg/l)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'tss', label: 'TSS (mg/l)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'ph', label: 'pH', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'temp', label: 'Temp ', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'nh4', label: 'NH4 (mg/l)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_in_1', label: 'Flow in 1 (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_in_2', label: 'Flow in 2 (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'flow_out', label: 'Flow out (m\u00b3/h)', minWidth: 150, format: (value) => value.toFixed(2) },
];

const initSummaryData = (desc, cod, tss, ph, temp, nh4, flow_in_1, flow_in_2, flow_out) => {
    return {desc, cod, tss, ph, temp, nh4, flow_in_1, flow_in_2, flow_out}
}

const SummaryTable = (props) => {
    const { valueMonth, plantCode } = props
    const [rows, setRows] = useState([
        initSummaryData('Thời gian vượt tối đa', '', '', '', '', '', '', '' , ''),
        initSummaryData('Giá trị tối đa', '', '', '', '', '', '', '' , ''),
        initSummaryData('Thời gian giảm tối thiểu', '', '', '', '', '', '', '' , ''), 
        initSummaryData('Giá trị tối thiểu', '', '', '', '', '', '', '' , ''), 
        initSummaryData('Giá trị trung bình', '', '', '', '', '', '', '' , ''), 
        initSummaryData('Số lần vượt ngưỡng', '', '', '', '', '', '', '' , ''), 
    ])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseApi = await api.getSummaryData(plantCode, dayjs(valueMonth).format('MM-YYYY'))
                if (responseApi && responseApi.data && responseApi.data.data) {
                    setRows(responseApi.data.data)
                }
            } catch (e) {
                
            }
        }

        fetchData()
    }, [plantCode, valueMonth])

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} align='center' style={{ minWidth: column.minWidth, fontWeight: 'bold', borderLeft: '1px groove #e6e6e6' }}>
                                {column.id === 'temp' ? <>{column.label}(&deg;C)</> : column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                            {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.id === 'desc' ? 'left' : 'center'} style={{ fontWeight: column.id === 'desc' ? 'bold' : 'normal', borderLeft: '1px groove #e6e6e6' }}>
                                        {column.format && typeof value === 'number' && row.desc !== 'Số lần vượt ngưỡng' ? column.format(value) : value}
                                    </TableCell>
                                )
                            })}
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default SummaryTable;