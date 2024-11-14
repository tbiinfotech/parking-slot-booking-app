import React, { useState } from 'react';
import { IconButton, Button, Checkbox } from '@mui/material';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import viewSvg from '../../assets/images/view.svg';
import deleteSvg from '../../assets/images/delete.svg';
import { useNavigate } from 'react-router-dom';

const statusStyle = (status) => ({
  color: status.toLowerCase() === 'active' ? '#008f30' : '#e71d26',
  backgroundColor: status.toLowerCase() === 'active' ? '#ecfff3' : '#fff3f3',
});

const headings = ["Select", "Id", "Date", "User Name", "Email Address", "Phone", "Action"];

function DynamicTable({ data, setDeleteUser, onDeleteSelected, selectedUsers,
  setSelectedUsers }) {


  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allUserIds = data.map((item) => item._id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteSelected = () => {
    setDeleteUser(1)
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }

  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteSelected}
        disabled={selectedUsers.length === 0}
        style={{ marginBottom: '10px' }}
      >
        Delete Selected
      </Button>

      <Table className='users-table'>
        <Thead className='table-head'>
          <Tr>
            <Th>
              <Checkbox
                checked={selectedUsers.length === data.length && data.length > 0}
                onChange={handleSelectAll}
              />
            </Th>
            {headings.slice(1).map((item, index) => <Th key={index} className='row'>{item}</Th>)}
          </Tr>
        </Thead>
        <Tbody className='table-body'>
          {data.map((item, index) => (
            <Tr key={item._id} className='row'>
              <Td>
                <Checkbox
                  checked={selectedUsers.includes(item._id)}
                  onChange={() => handleSelectUser(item._id)}
                />
              </Td>
              <Td className='sr-no'>{index + 1}.</Td>
              <Td className='name'>{formatDate(item.createdAt)}</Td>
              <Td className='name'>{item.name}</Td>
              <Td className='email'>{item.email}</Td>
              <Td className='age'>{item.phoneNumber}</Td>
              <Td className='action'>
                <IconButton className='delete-btn' onClick={() => setDeleteUser(item._id)}>
                  <img src={deleteSvg} alt="delete icon" />
                </IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

export default DynamicTable;
