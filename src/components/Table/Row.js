import {ArrowDropDown, ArrowDropUp, EditOutlined, InfoOutlined, TrendingUp} from '@mui/icons-material'
import {Button, Checkbox, IconButton, TableCell, TableRow} from '@mui/material'
import React, {useState} from 'react'
import InnerTable from "./InnerTable"
import {getStudentsTests} from "../../services/api";

const Row = (props) => {
  const {row, isItemSelected, handleClick, labelId, order, orderBy, handleRequestSort} = props
  const [open, setOpen] = useState(false);
  const [tests, setTests] = useState([]);

  const openTable = async (id) => {
    try {
      const data = await getStudentsTests(id);
      setTests(data)
    } catch (error) {
      console.log(error)
    }
    setOpen(!open)
  }

  return (
    <>
      <TableRow hover aria-checked={isItemSelected} role="checkbox" selected={isItemSelected} tabIndex={-1}
                key={row.id}>
        <TableCell>
          <Checkbox
            color="primary"
            checked={isItemSelected}
            id={row.id}
            onClick={(event) => handleClick(event, row.id)}
            inputProps={{
              'aria-labelledby': labelId,
            }}
          />
        </TableCell>
        <TableCell align="left" id={labelId}><p>{row.name}</p></TableCell>
        <TableCell align="left"><p>{row.id}</p></TableCell>
        <TableCell align="center"><p>{row.class}</p></TableCell>
        <TableCell align="left" style={{
          fontFamily: 'inherit',
          color: row.avScore < 50 ? "#DB4437" : row.avScore < 80 ? "#E2B534" : row.avScore < 90 ? "#0F9D58" : "#4285F4"
        }}><p>{`${row.avScore}%`}</p></TableCell>
        <TableCell align="left" style={{
          fontFamily: 'inherit',
          color: row.avSpeed === "Below Expected" ? "#DB4437" : row.avSpeed === "As Expected" ? "#0F9D58" : "#4285F4"
        }}><p>{row.avSpeed}</p></TableCell>
        <TableCell align="left"
                   style={{fontFamily: 'inherit', color: row.parents ? "black" : "#C0C0C0"}}>{row.parents ? (
          <p style={{display: 'flex', alignItems: 'flex-end'}}><InfoOutlined sx={{
            color: '#C0C0C0', width: '17px', marginRight: '5px'
          }}/><span>{row.parents}</span></p>) : <p>No parents added</p>}</TableCell>
        <TableCell align="right">
          <Button size="large" sx={{
            background: 'rgb(239, 239, 239)', color: "#828282", minWidth: 0, padding: "8px", ...!isItemSelected && {
              visibility: 'hidden'
            }
          }}><EditOutlined/></Button><Button size="large" sx={{
          background: 'rgb(239, 239, 239)',
          color: "#828282",
          minWidth: 0,
          padding: "8px",
          margin: '0 8px', ...!isItemSelected && {
            visibility: 'hidden'
          }
        }}><TrendingUp/></Button>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={()=>openTable(row.id)}
          >
            {open ? <ArrowDropUp/> : <ArrowDropDown/>}
          </IconButton>
        </TableCell>
      </TableRow>
      <InnerTable open={open} row={row} sortRequest={handleRequestSort} order={order} orderBy={orderBy} tests={tests}/>

    </>
  )
}

export default Row
