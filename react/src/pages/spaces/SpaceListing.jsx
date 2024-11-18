import React, { useEffect, useRef, useState } from 'react'
import { Box, Tab, Tabs, Typography, Pagination, PaginationItem } from '@mui/material'
import PropTypes from 'prop-types';
import DynamicParkingTable from '../../components/dataTable/DynamicParkingTable'
import ConfirmModal from '../../helper/ConfirmModal';
import { fetchCustomers, fetchSpaceListing, fetchCustomersWithPagination } from '../../../store/features/customersSlice';
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



function SpaceListing() {
  const [deleteUser, setDeleteUser] = useState(null)
  const [value, setValue] = useState(0);
  // const [roleName, setRoleName] = useState(null);
  const [records, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [searchValue, setSearchValue] = useState('');
  // const [type, setType] = useState('');
  const effectRan = useRef(false);
  const { token } = useSelector(state => state.auth);
  const { data } = useSelector(state => state.customers);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [typeOfDeletion, setTypeOfDeletion] = useState('');



  useEffect(() => {
    if (!effectRan.current) {
      dispatch(fetchCustomersWithPagination({ token, page: 1, limit: 10 }));
      effectRan.current = true;
    }
  }, [dispatch]);



  // useEffect(() => {
  //   if (data?.length) {
  //     setData(data);

  //   }
  // }, [data]);


  useEffect(() => {
    console.log('use effect', data)
    if (data) {
      const { records, pagination } = data;
      console.log('records', records)
      console.log('pagination', pagination)

      setData(records || []);
      setTotalPages(pagination?.totalPages || 1);
      setCurrentPage(pagination?.currentPage || 1);
    }
  }, [data]);



  const handleChange = (event, newValue) => {
    setValue(newValue);

  };

  const handleChangePage = (event, page) => {
    setData([]);
    dispatch(fetchCustomersWithPagination({ token, page, limit: 10 }));
  };


  console.log('data1642', data)
  return (
    <Box className={'customers'}>
      <Box className="page_title" sx={{ p: 0 }}>
        <Typography variant="h3" component="h3">
          Space Listing        </Typography>
      </Box>
      <Box className={`pages_inner`} >
        <Box sx={{ width: '100%' }} className='page_tabs'>
          {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="customers list tabs"
              variant='scrollable'
              scrollButtons='auto'

            >
              {tabValues.map((label, index) => (
                <Tab
                  key={index}
                  label={label}
                  {...a11yProps(index)}
                  sx={{ borderRadius: index === 0 ? '4px 0 0 4px' : index === tabValues.length - 1 ? '0 4px 4px 0' : '0 0 0 0' }}
                />
              ))}
            </Tabs>
          </Box> */}
          {tabValues.map((_, index) => (
            <CustomTabPanel
              key={index}
              value={value}
              index={index}
              className="tab_pannels"
            >
              {index === 0 && (
                <DynamicParkingTable data={records} setDeleteUser={setDeleteUser} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
                  typeOfDeletion={typeOfDeletion}
                  setTypeOfDeletion={setTypeOfDeletion}
                />
              )}
              {index === 1 && (
                <DynamicParkingTable data={records.filter(item => item.status === 'active')} setDeleteUser={setDeleteUser} />
              )}
              {index === 2 && (
                <DynamicParkingTable data={records.filter(item => item.status === 'inactive')} setDeleteUser={setDeleteUser} />
              )}
            </CustomTabPanel>
          ))}
        </Box>
        {totalPages > 1 && <Box className='pagination' sx={{ mt: { sm: 3, md: 5.5, lg: 7.5 }, mx: 'auto' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            boundaryCount={2}
            onChange={handleChangePage}
            color="primary"
            renderItem={(item) => <PaginationItem {...item} disabled={item.selected || item.disabled} />}
          />
        </Box>}
      </Box>
      <ConfirmModal open={deleteUser} setOpen={setDeleteUser} type={typeOfDeletion}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}


      />
    </Box>
  )
}

export default SpaceListing