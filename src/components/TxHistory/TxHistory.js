import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import db from "../../firebase";
import { useEffect, useState } from 'react';
import { TxStatus } from '../Transaction/Transaction';

const columns = [
    { id: 'status', label: 'Status', minWidth: 80 },
    { id: 'amount', label: 'Amout', minWidth: 80, },
    { id: 'txHash', label: 'TxHash', minWidth: 50 },
    { id: 'from', label: 'From', minWidth: 50 },
    { id: 'to', label: 'To', minWidth: 100 },
];

function createData(txHash, from, to, amount, status) {
    return { txHash, from, to, amount, status };
}


function TxHistory() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = useState([]);

    const ref = db.collection("Transactions")

    function updateList() {
        ref.onSnapshot((querySnapshot) => {
            const items = [];

            querySnapshot.forEach((doc) => {
                let status = ""

                if (doc.data().status === TxStatus.PENDING) {
                    status = "⏱️ Pending"
                } else if (doc.data().status === TxStatus.SUCCESS) {
                    status = "✅ Success"
                } else if (doc.data().status === TxStatus.FAILED) {
                    status = "❌ Failed"
                }
                items.push(createData(doc.data().txHash, doc.data().from, doc.data().to, doc.data().amount, status));
            });

            setData(items);
        })
    }

    useEffect(() => {
        updateList()
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80%',

        }}>
            <Paper sx={{
                boxShadow: '1px 2px 9px #000000',
                margin: '4em',
                padding: '1em',
                width: '80%',
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <TableContainer sx={{ maxHeight: "80%" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover role="checkbox"
                                            tabIndex={-1}
                                            key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default TxHistory;