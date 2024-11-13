import React, { useEffect, useRef, useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import PropTypes from 'prop-types';
import DynamicTable from '../../components/dataTable/DynamicTransactionTable'
import ConfirmModal from '../../helper/ConfirmModal';
import { fetchTransaction } from '../../../store/features/customersSlice';
import { useDispatch, useSelector } from 'react-redux';


const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`customers-tabpanel-${index}`}
            aria-labelledby={`customers-tabpanel-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const tabValues = [
    'All',
    'Active',
    'Inactive',
];

function a11yProps(index) {
    return {
        id: `customers-tab-${index}`,
        'aria-controls': `customers-tabpanel-${index}`,
    };
}

const dummyData = [
    { id: 1, name: 'Ophelia Coleman', email: 'opheliacoleman@gmail.com', age: 28, gender: 'Female', status: 'Active' },
    { id: 2, name: 'James Anderson', email: 'james.anderson@email.com', age: 27, gender: 'Female', status: 'Inactive' },
    { id: 3, name: 'Emily Johnson', email: 'emily.johnson@email.com', age: 32, gender: 'Male', status: 'Active' },
    { id: 4, name: 'Michael Smith', email: 'michael.smith@email.com', age: 20, gender: 'Male', status: 'Inactive' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@email.com', age: 25, gender: 'Male', status: 'Active' },
    { id: 6, name: 'Ophelia Coleman', email: 'opheliacoleman@gmail.com', age: 28, gender: 'Female', status: 'Active' },
    { id: 7, name: 'James Anderson', email: 'james.anderson@email.com', age: 27, gender: 'Female', status: 'Inactive' },
    { id: 8, name: 'Emily Johnson', email: 'emily.johnson@email.com', age: 32, gender: 'Male', status: 'Active' },
    { id: 9, name: 'Michael Smith', email: 'michael.smith@email.com', age: 20, gender: 'Male', status: 'Inactive' },
    { id: 10, name: 'David Wilson', email: 'david.wilson@email.com', age: 25, gender: 'Male', status: 'Active' },
];


function Payments() {
    const [deleteUser, setDeleteUser] = useState(null)
    const [value, setValue] = useState(0);
    const [records, setData] = useState([]);
    // const [roleName, setRoleName] = useState(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(0);
    // const [searchValue, setSearchValue] = useState('');
    // const [type, setType] = useState('');
    const effectRan = useRef(false);
    const { token } = useSelector(state => state.auth);
    const { data } = useSelector(state => state.customers);
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    useEffect(() => {
        if (!effectRan.current) {
            dispatch(fetchTransaction({ token }));
            effectRan.current = true;
        }
    }, [dispatch]);

    // useEffect(() => {
    //   if (user?.data?.user?.rolename)
    //     setRoleName(user.data.user.rolename?.toLowerCase());
    // }, [user]);

    useEffect(() => {
        if (data?.length) {
            setData(data);
            // setCurrentPage(current_page || 1);
            // setTotalPages(Math.ceil((total || 0) / (per_page || 1)));
        }
    }, [data]);

    // const handleChangePage = (status, newPage) => {
    //   setData(null);
    //   let filter = '';
    //   if (status) filter = { status: status };
    //   dispatch(fetchLandForSale(token, newPage, filter));
    // };

    const handleChange = (event, newValue) => {
        // setData(null);
        setValue(newValue);

    };

    console.log('transaction data', data)

    return (
        <Box className={'customers'}>
            <Box className="page_title" sx={{ p: 0 }}>
                <Typography variant="h3" component="h3">
                    Payments                </Typography>
            </Box>
            <Box className={`pages_inner`} >
                <Box sx={{ width: '100%' }} className='page_tabs'>

                    {tabValues.map((_, index) => (
                        <CustomTabPanel
                            key={index}
                            value={value}
                            index={index}
                            className="tab_pannels"
                        >
                            {index === 0 && (
                                <DynamicTable data={records} setDeleteUser={setDeleteUser} />
                            )}
                            {index === 1 && (
                                <DynamicTable data={records.filter(item => item.status === 'active')} setDeleteUser={setDeleteUser} />
                            )}
                            {index === 2 && (
                                <DynamicTable data={records.filter(item => item.status === 'inactive')} setDeleteUser={setDeleteUser} />
                            )}
                        </CustomTabPanel>
                    ))}
                </Box>
            </Box>
            <ConfirmModal open={deleteUser} setOpen={setDeleteUser} />
        </Box>
    )
}

export default Payments