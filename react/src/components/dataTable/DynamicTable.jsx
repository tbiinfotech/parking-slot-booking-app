import React from 'react';
import { IconButton } from '@mui/material';

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import viewSvg from '../../assets/images/view.svg'
import deleteSvg from '../../assets/images/delete.svg'
import { useNavigate } from 'react-router-dom';


const statusStyle = (status) => {
  return {
    color: status.toLowerCase() === 'active' ? '#008f30' : '#e71d26',
    backgroundColor: status.toLowerCase() === 'active' ? '#ecfff3' : '#fff3f3',
  };
};

const headings = ["Id", "Date", "user Name", "Email Address", "Phone", "Action"];

function DynamicTable({ data, setDeleteUser }) {

  function formatDate(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Define options for formatting
    const options = { day: '2-digit', month: 'short', year: 'numeric' };

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }

  const navigate = useNavigate()
  return (
    <Table className='users-table'>
      <Thead className='table-head'>
        <Tr>
          {headings.map((item, index) => <Th key={index} className='row'>{item}</Th>)}
        </Tr>
      </Thead>
      <Tbody className='table-body'>
        {data.map((item, index) => (<Tr key={index} className='row'>
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
        </Tr>))}
      </Tbody>
    </Table>
  );

  // return (
  //   <TableContainer component={Paper}>
  //     <Table>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Sr. No</TableCell>
  //           <TableCell>Name</TableCell>
  //           <TableCell>Email</TableCell>
  //           <TableCell>Age</TableCell>
  //           <TableCell>Gender</TableCell>
  //           <TableCell>Status</TableCell>
  //           <TableCell>Action</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {data?.map((row, index) => (
  //           <TableRow key={row.id}>
  //             <TableCell>{index + 1}</TableCell>
  //             <TableCell>{row.name}</TableCell>
  //             <TableCell>{row.email}</TableCell>
  //             <TableCell>{row.age}</TableCell>
  //             <TableCell>{row.gender}</TableCell>
  //             <TableCell>
  //               <span style={statusStyle(row.status)}>{row.status}</span>
  //             </TableCell>
  //             <TableCell>
  //               <IconButton>
  //                 <img src={viewSvg} alt="view icon" />
  //               </IconButton>
  //               <IconButton onClick={() => setDeleteUser(row.id)}>
  //                 <img src={deleteSvg} alt="delete icon" />
  //               </IconButton>
  //             </TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
};

export default DynamicTable;