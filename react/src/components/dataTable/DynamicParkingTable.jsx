import React from 'react';
import { IconButton, Button, Checkbox } from '@mui/material';

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

const headings = ["Id", "Property", "Host Name", "Type", "Listing", "Amount", "Action"];

function DynamicParkingTable({ data, setDeleteUser, selectedUsers,
    setSelectedUsers,
    typeOfDeletion,
    setTypeOfDeletion
}) {

    function formatDate(dateString) {
        // Create a new Date object from the input string
        const date = new Date(dateString);

        // Define options for formatting
        const options = { day: '2-digit', month: 'short', year: 'numeric' };

        // Format the date using toLocaleDateString
        return date.toLocaleDateString('en-GB', options).replace(',', '');
    }

    const navigate = useNavigate()


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
        setTypeOfDeletion('deleteAllSpace')
        console.log('selectedUsers', selectedUsers)
        setDeleteUser(1)
    };
    console.log('DynamicParkingTable', data)

    const handleOnDelete = (itemId) => {
        setTypeOfDeletion('deleteSpace')
        setDeleteUser(itemId)
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={handleDeleteSelected}
                disabled={selectedUsers?.length === 0}
                sx={{
                    backgroundColor: '#3621A0',
                    color: '#fff', // Set the text color, if needed
                    '&:hover': {
                        backgroundColor: '#2b1a85', // Darker shade for hover effect
                    },
                    marginBottom: '10px',
                }}
            >
                Delete Selected
            </Button>

            <Table className='users-table'>
                <Thead className='table-head'>
                    <Tr>
                        <Th>
                            <Checkbox
                                checked={selectedUsers?.length === data.length && data.length > 0}
                                onChange={handleSelectAll}
                            />
                        </Th>
                        {headings.map((item, index) => <Th key={index} className='row'>{item}</Th>)}
                    </Tr>
                </Thead>
                <Tbody className='table-body'>
                    {data.map((item, index) => (<Tr key={index} className='row'>
                        <Td>
                            <Checkbox
                                checked={selectedUsers?.includes(item._id)}
                                onChange={() => handleSelectUser(item._id)}
                            />
                        </Td>
                        <Td className='sr-no'>{index + 1}.</Td>
                        <Td sx={{ minWidth: '', p: { xs: 2, md: 4 }, }} className='name'>{item.description}</Td>
                        <Td className='name'>{item?.owner?.name}</Td>
                        <Td className='email'>{item?.spaceType}</Td>
                        <Td className='age'>{item?.type}</Td>
                        <Td className='age'>100$d</Td>

                        <Td className='action'>
                            <IconButton className='view-btn ' onClick={() => navigate(`/parking/details/${item._id}`)}>
                                <img src={viewSvg} alt="view icon" />
                            </IconButton>
                            <IconButton className='delete-btn' onClick={() => handleOnDelete(item._id)}>
                                {/* <IconButton className='delete-btn'> */}

                                <img src={deleteSvg} alt="delete icon" />
                            </IconButton>
                        </Td>
                    </Tr>))}
                </Tbody>
            </Table>
        </>);


};

export default DynamicParkingTable;