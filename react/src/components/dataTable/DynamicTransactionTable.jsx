import React from 'react';
import { IconButton } from '@mui/material';

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import viewSvg from '../../assets/images/view.svg'
import deleteSvg from '../../assets/images/delete.svg'
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../helper/helper'

const statusStyle = (status) => {
    return {
        color: status.toLowerCase() === 'active' ? '#008f30' : '#e71d26',
        backgroundColor: status.toLowerCase() === 'active' ? '#ecfff3' : '#fff3f3',
    };
};

const headings = ["SNo", "Transaction ID", "Customer Name", "Host Name", "Listing", "Amount", "Date"];

function DynamicTransactionTable({ data, setDeleteUser }) {

    function formatDate(dateString) {
        // Create a new Date object from the input string
        const date = new Date(dateString);

        // Define options for formatting
        const options = { day: '2-digit', month: 'short', year: 'numeric' };

        // Format the date using toLocaleDateString
        return date.toLocaleDateString('en-GB', options).replace(',', '');
    }

    const navigate = useNavigate()
    console.log('DynamicTransactionTable', data)

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
                    <Td className='name'>{item?.transactionId}</Td>
                    <Td className='name'>{item?.customerName}</Td>
                    <Td className='email'>{item?.hostName}</Td>
                    <Td className='age'>{item?.listingTitle}</Td>
                    <Td className='age'>{item?.amount} $</Td>
                    <Td className='name'>{formatDate(item.date)}</Td>

                </Tr>))}
            </Tbody>
        </Table>
    );


};

export default DynamicTransactionTable;