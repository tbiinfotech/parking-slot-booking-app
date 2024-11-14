import React, { useEffect, useRef, useState } from 'react'
import { Box, Tab, Tabs, Typography, Pagination, PaginationItem } from '@mui/material'
import PropTypes from 'prop-types';
import DynamicTable from '../../components/dataTable/DynamicTable'
import ConfirmModal from '../../helper/ConfirmModal';
import { fetchCustomers } from '../../../store/features/customersSlice';
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
function Customers() {
  const [deleteUser, setDeleteUser] = useState(null)
  const [value, setValue] = useState(0);
  const [records, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const effectRan = useRef(false);
  const { token } = useSelector(state => state.auth);
  const { data } = useSelector(state => state.customers);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    if (!effectRan.current) {
      dispatch(fetchCustomers({ token, page: 1, limit: 10 }));
      effectRan.current = true;
    }
  }, [dispatch]);


  useEffect(() => {
    console.log('use effect', data)
    if (data) {
      const { records, pagination } = data;
      setData(records || []);
      setTotalPages(pagination?.totalPages || 1);
      setCurrentPage(pagination?.currentPage || 1);
    }
  }, [data]);

  const handleChangePage = (event, page) => {
    setData([]);
    dispatch(fetchCustomers({ token, page, limit: 10 }));
  };

  const handleChange = (event, newValue) => {
    let status = newValue === 1 ? 'active' : newValue === 2 ? 'inactive' : null;
    setData([]);
    setValue(newValue);
    dispatch(fetchCustomers({ token, page: 1, limit: 10, status }));
  };

  return (
    <Box className={'customers'}>
      <Box className="page_title" sx={{ p: 0 }}>
        <Typography variant="h3" component="h3">
          User Listings
        </Typography>
      </Box>
      <Box className={`pages_inner`} >
        <Box sx={{ width: '100%' }} className='page_tabs'>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          </Box>
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
      <ConfirmModal open={deleteUser} setOpen={setDeleteUser} />
    </Box>
  )
}

export default Customers