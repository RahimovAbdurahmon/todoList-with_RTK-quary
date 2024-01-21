import { Button, TextField } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { useAddUserMutation, useDeleteUserMutation, useEditUserMutation, useGetUserQuery, useIsCompleteMutation, useSearchUserQuery, useSelUserQuery } from './api/todo/todosApi'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Close } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const App = () => {

  /// get
  let { data = [], isLoading, isError } = useGetUserQuery();

  /// delete
  let [deleteUser] = useDeleteUserMutation();

  /// isComplete
  let [isCompleteUser] = useIsCompleteMutation();

  /// info
  let [infoName, setInfoName] = useState("")
  let [infoStatus, setInfoStatus] = useState("")
  const [open, setOpen] = useState(false);
  const handleOpen = (user) => {
    setOpen(true);
    setInfoName(user.name);
    setInfoStatus(user.isComplete)
  }
  const handleClose = () => setOpen(false);

  /// add
  let [inpAdd, setInpAdd] = useState("")
  let [selAdd, setSelAdd] = useState("")
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => {
    setOpenAdd(true);
  }
  const handleCloseAdd = () => setOpenAdd(false);
  let [addUser] = useAddUserMutation();

  /// edit
  let [inpEdit, setInpEdit] = useState("")
  let [idx, setIdx] = useState(null)
  let [selEdit, setSelEdit] = useState("")
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = (user) => {
    setOpenEdit(true);
    setInpEdit(user.name)
    setSelEdit(user.isComplete ? "active" : "inactive")
    setIdx(user.id)
  }
  const handleCloseEdit = () => setOpenEdit(false);
  let [editUser] = useEditUserMutation();

  /// search
  let [inpSearch, setInpSearch] = useState("")
  let {searchUser = ''} = useSearchUserQuery();

  /// search
  let [select, setSelect] = useState("")
  let {selUser = ''} = useSelUserQuery();

  if(isLoading) return "Loading..."
  if(isError) return "Error..."
  return (
    <>
    <div className='p-[20px] lg:p-[50px] xl:px-[150px] flex items-center justify-between'>
      <h1 className='text-[30px] font-[600]'>TODO LIST</h1>
      <div className='flex items-center gap-[10px]'>
        <select value={select} onChange={(event) => {setSelect(event.target.value); selUser(select)}} className='px-[15px] py-[15px] border-gray-400 border-[1px] rounded-[3px]'>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <TextField label="Search" value={inpSearch} onInput={() => searchUser(inpSearch)} onChange={(event) => setInpSearch(event.target.value)} />
        <Button variant='contained' onClick={handleOpenAdd}>Add New +</Button>
      </div>
    </div>
    <div className='p-[20px] lg:p-[50px] xl:px-[150px]'>
      <table className='table'>
          <tr className='text-[35px] border-b-[2px] border-b-black'>
            <th className='w-[400px]'>Name</th>
            <th className='w-[400px]'>Status</th>
            <th className='w-[400px]'>Action</th>
          </tr>
        {data.map((elem) => {
          return (
            <tr key={elem.id} className='border-b-[1px] border-b-gray-600'>
              <td className={elem.isComplete ? 'text-center text-[20px]' : 'text-center text-[20px] text-red-400 line-through'}>{elem.name}</td>
              <td className='text-center p-[10px]'> <Button variant='contained' color={elem.isComplete ? "success" : "inherit"} onClick={() => isCompleteUser({id: elem.id, name: elem.name, isComplete: !elem.isComplete})}>{elem.isComplete ? "Active" : "Inactive"}</Button> </td>
              <td className='text-center p-[10px] flex items-center gap-[10px] ml-[50px]'>
                <Button variant='contained' color='error' onClick={() => deleteUser(elem.id)}>Delete</Button>
                <Button variant='contained' onClick={() => handleOpenEdit(elem)}>Edit</Button>
                <Button variant='contained' color='secondary' onClick={() => handleOpen(elem)}>Info</Button>
              </td>
            </tr>
          )
        })}
      </table>
    </div>
    {/* info */}
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex items-center justify-between mb-[20px]'>
            <p className='text-[20px]'>Info User</p>
            <div className='cursor-pointer text-[25px]' onClick={handleClose}> <Close /> </div>
          </div>
          <h1 className='text-[30px] font-[500] flex items-center justify-between'><span className='font-[700]'>Name : </span>{infoName}</h1>
          <h1 className='flex items-center justify-between'><span className='text-[30px] font-[700]'>Status</span> <Button variant='contained' color={infoStatus ? "success" : "inherit"}>{infoStatus ? "Active" : "Inactive"}</Button> </h1>
        </Box>
      </Modal>
    </div>
    {/* add */}
    <div>
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex items-center justify-between mb-[20px]'>
            <p className='text-[20px]'>add User</p>
            <div className='cursor-pointer text-[25px]' onClick={handleCloseAdd}> <Close /> </div>
          </div>
          <div className='flex flex-col gap-[15px] items-end'>
            <TextField label="Name" fullWidth value={inpAdd} onChange={(event) => setInpAdd(event.target.value)} />
            <select value={selAdd} className='w-[100%] px-[20px] py-[15px] border-gray-400 border-[1px] rounded-[3px]' onChange={(event) => setSelAdd(event.target.value)}>
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
            <div className='flex items-center gap-[10px]'>
              <Button variant='outlined' onClick={handleCloseAdd}>Cancel</Button>
              <Button variant='contained' onClick={() => {addUser({name: inpAdd, isComplete: selAdd == "active" ? true : false}); handleCloseAdd()}}>Add</Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
    {/* edit */}
    <div>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex items-center justify-between mb-[20px]'>
            <p className='text-[20px]'>Edit User</p>
            <div className='cursor-pointer text-[25px]' onClick={handleCloseEdit}> <Close /> </div>
          </div>
          <div className='flex flex-col gap-[15px] items-end'>
            <TextField label="Name" fullWidth value={inpEdit} onChange={(event) => setInpEdit(event.target.value)} />
            <select value={selEdit} className='w-[100%] px-[20px] py-[15px] border-gray-400 border-[1px] rounded-[3px]' onChange={(event) => setSelEdit(event.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className='flex items-center gap-[10px]'>
              <Button variant='outlined' onClick={handleCloseEdit}>Cancel</Button>
              <Button variant='contained' onClick={() => {editUser({id: idx, name: inpEdit, isComplete: selEdit == "active" ? true : false}); handleCloseEdit()}}>Edit</Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
    </>
  )
}

export default App