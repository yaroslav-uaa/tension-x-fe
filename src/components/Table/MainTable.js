import {Paper, Table, TableCell, TableContainer, TableRow} from '@mui/material';
import React, {useCallback, useEffect, useState} from 'react'
import SearchField from '../SearchField/SearchField';
import Pagination from './Pagination/Pagination';
import Row from './Row';
import CollapsibleTable from './TableHead';
import ToolBar from './ToolBar';
import {getAllStudents} from "../../services/api";


const MainTable = () => {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('ask');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const getStudents = useCallback(async () => {
    try {
      const result = await getAllStudents();
      setRows(result)
    } catch (e) {
      console.log(e);
    }
  }, [])

  useEffect(() => {
    getStudents()
  }, [getStudents])

  const handleRequestSort = (e, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.ID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleClick = (e, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      {selected.length > 0 ? (<ToolBar numSelected={selected.length} setSelected={setSelected}/>) : (<SearchField/>)}
      <TableContainer component={Paper} sx={{padding: '0 40px', maxWidth: 'calc(100% - 80px)'}}>
        <Table aria-label="collapsible table" size="small">
          <CollapsibleTable onSelectAllClick={handleSelectAllClick} order={order} orderBy={orderBy}
                            numSelected={selected.length} rowCount={rows.length} onRequestSort={handleRequestSort}/>
          {rows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
            const isItemSelected = isSelected(row.ID);
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Row row={row} isItemSelected={isItemSelected} handleClick={handleClick} labelId={labelId} order={order}
                   orderBy={orderBy} handleRequestSort={handleRequestSort}/>)
          })}
          {emptyRows > 0 && (
            <TableRow style={{height: 53 * emptyRows}}>
              <TableCell colSpan={6}/>
            </TableRow>
          )}
        </Table>
        <Pagination page={page} setPage={setPage} rows={rows} rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}/>

      </TableContainer>

    </>

  )
}

export default MainTable
