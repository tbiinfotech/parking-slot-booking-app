import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const headings = ["Sr. No", "Reported To", "Reported By", "Reason", "Date"];

export default function UsersTable({ data }) {

  return (
    <Table className='users-table'>
      <Thead className='table-head'>
        <Tr>
          {headings.map((item, index) => <Th key={index} className='row'>{item}</Th>)}
        </Tr>
      </Thead>
      <Tbody className='table-body'>
        {data.map((item, index) => (<Tr key={index} className='row'>
          <Td>{index + 1}.</Td>
          <Td>{item.reportedTo}</Td>
          <Td>{item.reportedBy}</Td>
          <Td>{item.reason}</Td>
          <Td>{item.date}</Td>
        </Tr>))}
      </Tbody>
    </Table>
  );
}