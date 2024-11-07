import React, { useEffect, useRef, useState } from 'react'
import { Grid2 as Grid, Avatar, Typography, Card, CardContent, Select, MenuItem, Box, InputAdornment, OutlinedInput, Modal, IconButton, Chip, CircularProgress } from '@mui/material';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useParams } from 'react-router-dom'
// import profileImg from '../../assets/images/profile-img.png'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUser } from '../../../store/features/userSlice';


const tableHeadings = ["Order No", "Date", "Status", "Total"];
const dummyData = [
  {
    orderNo: 1,
    date: "Oct 2, 2024",
    status: "Active",
    total: "Fake Profile",
  },
  {
    orderNo: 2,
    date: "Oct 2, 2024",
    status: "Inactive",
    total: "Fake Profile",
  },
]

const statusStyle = (status) => {
  return {
    color: status === 'Active' ? 'green' : 'red',
    fontWeight: 'bold',
  };
};

const subDetails = {
  plan: "$39.00 / Monthly",
  createdOn: "May 12, 2024",
  renewalDate: "Jun 12, 2024",
  planName: "Upgrade Plan",
  status: "Active",
}
const statusStyling = {
  active: {
    color: 'green',
    border: '2px solid green'
  },
  inactive: {
    color: 'red',
    border: '2px solid red'
  },
  pending: {
    color: 'orange',
    border: '2px solid orange'
  }
};
const modalStyle = {
  bgcolor: '#fff',
  borderRadius: 3.5,
  p: 2.5,
  display: 'flex',
  alignItems: 'center',
  margin: 'auto',
  position: 'relative',
  pointeEvents: 'none',
  maxWidth: 598,
  width: '100%',
  minHeight: 'calc(100% - 100px)',
  ':focus-visible': { outline: 'none' }
};

export default function CustomerDetail() {
  const [user, setUser] = useState(null)
  const [adminPercent, setAdminPercent] = useState(50);
  const [customerPercent, setCustomerPercent] = useState(50);
  const [balance, setBalance] = useState(56.70);
  const [editBal, setEditBal] = useState(true);
  const [imageOpen, setImageOpen] = useState(false);
  const [bio, setBio] = useState(`I'm a positive person who loves to travel, explore new places, try different foods, and I'm always available for a friendly chat anytime!`);
  const [editBio, setEditBio] = useState(false);
  const effectRan = useRef(null)
  const { customerId } = useParams()
  const { token } = useSelector(state => state.auth);
  const { data } = useSelector(state => state.user);
  const dispatch = useDispatch()

  const handleChangeAdmin = (event) => {
    setAdminPercent(event.target.value);
  };
  const handleChangeCustomer = (event) => {
    setCustomerPercent(event.target.value);
  };

  const handleDeleteTag = (tag) => {
    let newHashTags = []
    newHashTags = user?.hashTags?.filter(item => item !== tag)
    const values = { hashTags: newHashTags }

    dispatch(updateUser({ values, userId: customerId, token }))
  }
  const handleDeleteProfileImage = () => {
    const values = { profilePicture: null }
    dispatch(updateUser({ values, userId: customerId, token }))
    setImageOpen(false)
  }

  const handleBio = () => {
    setEditBio(!editBio)
    if (editBio && bio !== data?.bio) {
      const values = { bio: bio }

      dispatch(updateUser({ values, userId: customerId, token }))
    }

  };

  useEffect(() => {
    if (!effectRan.current) {
      dispatch(fetchUser({ userId: customerId, token }))
      effectRan.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setUser(data)
      setBio(data?.bio || '')
      setBalance(data?.balance || 0)
    }
  }, [data])

  // user?.profilePicture && console.log('image', `${import.meta.env.VITE_API_URL}/${user.profilePicture}`);

  return (
    <>
      <Grid container spacing={2} className='customer-detail-page' sx={{ p: { xs: 1, md: 2, lg: 3 } }}>
        <Grid size={{ xs: 12, md: 12, lg: 6 }}>
          <Card
            className='detail-card-main profile'
            sx={{
              borderRadius: 4,
              boxShadow: '0px 4px 20px 0px #EEEEEE80',
            }}
          >
            <CardContent
              className='detail-card-content'
              sx={{
                pt: { xs: 1.5, md: 2, lg: 5 },
                pb: { xs: 1.5, md: 2, lg: 5 },
                px: { xs: 1, md: 2, lg: 3.75 },
              }}
            >
              <Typography component='h6' variant="h6" sx={{ fontSize: 22, color: '#000', fontWeight: 600, mb: 2.75 }}>
                Customers Details
              </Typography>
              <Grid container spacing={2} className='image-info' sx={{ alignItems: 'center', mb: 3.75 }}>
                <Grid className='image' sx={{ p: .4, borderRadius: '50%', background: 'linear-gradient(142.25deg, #3621A0 14.95%, #E71D26 87.22%)', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '50%', p: 0.5 }}>
                    <Avatar
                      alt={user?.name}
                      src={user?.profilePicture && `${import.meta.env.VITE_API_URL}/${user.profilePicture}`}
                      sx={{ width: 154, height: 154, bgcolor: '#3621A0', cursor: user?.profilePicture ? 'pointer' : 'default' }}
                      onClick={() => user?.profilePicture && setImageOpen(true)}
                    />
                  </Box>
                </Grid>
                <Grid className='info'>
                  <Typography component={'h6'} variant="h6" sx={{ fontFamily: 'Roboto', fontSize: 24, color: 'var(--heading1)', fontWeight: 600, textTransform: 'capitalize' }} >{user?.name}</Typography>
                  <Box sx={{ display: 'flex', width: '100%', textAlign: 'center', textTransform: 'uppercase', mt: 3 }}>
                    <Box sx={{ flex: 'auto', pr: 2, borderRight: '3px solid var(--border1)' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'Roboto', fontSize: 24, color: 'var(--heading1)', fontWeight: 500 }}>
                        2.7K
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'var(--text1)', fontWeight: 400 }}>
                        Story Likes
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 'auto', px: 2 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'Roboto', fontSize: 24, color: 'var(--heading1)', fontWeight: 500 }}>
                        788
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'var(--text1)', fontWeight: 400 }}>
                        Conversations
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 'auto', pl: 2, borderLeft: '3px solid var(--border1)' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'Roboto', fontSize: 24, color: 'var(--heading1)', fontWeight: 500 }}>
                        {user?.followers?.length || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Roboto', fontSize: 12, color: 'var(--text1)', fontWeight: 400 }}>
                        Followers
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box className='text-info'>
                <Box sx={{ borderBottom: '1px solid var(--border1)', mb: 3.75 }}>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--heading1)', fontWeight: 500, mb: 2 }}>
                    Full Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--text1)', fontWeight: 400, mb: 2, textTransform: 'capitalize' }}>
                    {user?.name}
                  </Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid var(--border1)', mb: 3.75 }}>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--heading1)', fontWeight: 500, mb: 2 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--text1)', fontWeight: 400, mb: 2 }}>
                    {user?.email}
                  </Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid var(--border1)', mb: 3.75 }}>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--heading1)', fontWeight: 500, mb: 2 }}>
                    Gender
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--text1)', fontWeight: 400, mb: 2, textTransform: 'capitalize' }}>
                    {user?.gender}
                  </Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid var(--border1)', mb: 3.75 }}>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--heading1)', fontWeight: 500, mb: 2 }}>
                    Age
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--text1)', fontWeight: 400, mb: 2 }}>
                    {user?.age}
                  </Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid var(--border1)', mb: 3.75 }} className={'hashtags'}>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--heading1)', fontWeight: 500, mb: 2 }}>
                    Hashtags
                  </Typography>
                  <Box sx={{ fontSize: 16, color: 'var(--text1)', fontWeight: 400, mb: 2 }}>
                    {user?.hashTags?.length ? user.hashTags.map((item, index) => <Chip
                      key={index}
                      label={item}
                      onDelete={() => handleDeleteTag(item)}
                      sx={{ ml: index !== 0 ? 1 : 0, bgcolor: '#f1f1f9', borderRadius: 2 }}
                    />) : 'N/A'}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 16, color: 'var(--heading1)', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bio</span>
                    <span style={{ cursor: 'pointer', fontWeight: 400, color: 'var(--text1)' }} onClick={handleBio}>
                      {editBio ? 'Save' : 'Edit'}
                    </span>
                  </Typography>
                  <OutlinedInput
                    id="bio-input"
                    className='bio-input'
                    sx={{ color: 'var(--heading1)', px: 0, borderRadius: 0, }}
                    fullWidth
                    multiline
                    maxRows={5}
                    inputProps={{ sx: { px: 0 } }}
                    disabled={!editBio}
                    value={bio || ''}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 6 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Card
                className='detail-card-main '
                sx={{
                  borderRadius: 4,
                  boxShadow: '0px 4px 20px 0px #EEEEEE80',
                }}
              >
                <CardContent
                  className='detail-card-content'
                  sx={{
                    pt: { xs: 1.5, md: 2, lg: 5 },
                    pb: { xs: 1.5, md: 2, lg: 5 },
                    px: { xs: 2, md: 4, lg: 8.125 },
                  }}
                >
                  <Typography component='h6' variant="h6" sx={{ fontSize: 22, color: '#000', fontWeight: 600, mb: 3.75 }}>
                    Subscription Details
                  </Typography>
                  <Grid container>
                    <Grid size={6} sx={{ pb: 2.5, border: 'solid #0000001a', borderWidth: '0px 1px 0px 0px' }}>
                      <Typography variant="body1" sx={{ fontSize: 14, color: '#6B7280' }}>Plan</Typography>
                      <Typography variant="body1" sx={{ fontSize: 17, color: '#111928', fontWeight: 500 }}>{subDetails.plan}</Typography>
                    </Grid>
                    <Grid size={6} sx={{ pb: 2.5, pl: 3.75, border: 'solid #0000001a', borderWidth: '0px 0px 0px 0px' }}>
                      <Typography variant="body1" sx={{ fontSize: 14, color: '#6B7280' }}>Created on</Typography>
                      <Typography variant="body1" sx={{ fontSize: 17, color: '#111928', fontWeight: 500 }}>{subDetails.createdOn}</Typography>
                    </Grid>
                    <Grid size={6} sx={{ py: 2.5, border: 'solid #0000001a', borderWidth: '1px 1px 1px 0px' }}>
                      <Typography variant="body1" sx={{ fontSize: 14, color: '#6B7280' }}>Plan Name</Typography>
                      <Typography variant="body1" sx={{ fontSize: 17, color: '#111928', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ marginTop: '2px', }}>
                          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.82574 3.51562C8.50187 3.51562 8.2398 3.25355 8.2398 2.92969V0.585938C8.2398 0.26207 8.50187 0 8.82574 0C9.14961 0 9.41168 0.26207 9.41168 0.585938V2.92969C9.41168 3.25355 9.14961 3.51562 8.82574 3.51562ZM5.82051 3.66441L4.1634 2.59324C3.8916 2.41758 3.81379 2.0548 3.98945 1.78301C4.1657 1.51121 4.52734 1.43227 4.79969 1.60906L6.45679 2.68023C6.72859 2.8559 6.8064 3.21867 6.63074 3.49047C6.45504 3.76207 6.0923 3.8398 5.82051 3.66441Z" fill="#DFD7D5" />
                            <path d="M14.0988 4.72656H3.55187C3.44008 4.72656 3.33695 4.7641 3.24512 4.8216L3.5702 8.71824L5.30969 10L8.2577 8.49852L12.3409 10L14.0988 8.62672L14.4055 4.82164C14.3138 4.7641 14.2105 4.72656 14.0988 4.72656Z" fill="#FFD400" />
                            <path d="M12.3428 10L14.1006 8.62674L14.4074 4.82166C14.3156 4.76416 14.2124 4.72662 14.1006 4.72662H8.82715V8.70733L12.3428 10Z" fill="#FDBF00" />
                            <path d="M11.0207 3.49045C10.845 3.21866 10.9228 2.85588 11.1946 2.68022L12.8518 1.60905C13.1236 1.43166 13.4857 1.5112 13.662 1.78299C13.8377 2.05479 13.7598 2.41756 13.488 2.59323L11.8309 3.6644C11.5591 3.83983 11.1964 3.76209 11.0207 3.49045Z" fill="#DFD7D5" />
                            <path d="M17.5886 9.6893L14.5964 5.0018C14.5486 4.92539 14.4805 4.86805 14.4065 4.82164L12.3419 10L8.82627 4.72656L5.31065 10L3.24608 4.8216C3.17205 4.86801 3.10397 4.92539 3.05619 5.00176L0.0718179 9.68926C0.0138101 9.7818 -0.002479 9.89145 0.000294433 9.99996L1.72182 11.7578H15.1496L17.6502 9.99996C17.6514 9.88762 17.641 9.77289 17.5886 9.6893Z" fill="#FDBF00" />
                            <path d="M15.1504 11.7578L17.651 10C17.6523 9.88762 17.6419 9.77289 17.5895 9.6893L14.5973 5.0018C14.5495 4.92539 14.4814 4.86805 14.4074 4.82164L12.3428 10L8.82715 4.72656V11.7578H15.1504Z" fill="#FF9F00" />
                            <path d="M12.3433 10H5.31203L4.61621 13.9551L8.82766 20L12.7644 14.7607L12.3433 10Z" fill="#FFD400" />
                            <path d="M12.3428 10H8.82715V20L12.7639 14.7607L12.3428 10Z" fill="#FDBF00" />
                            <path d="M0 10C0.00414063 10.1611 0.0592187 10.3196 0.153906 10.4143L8.41172 19.8283C8.46605 19.8828 8.53062 19.926 8.60172 19.9555C8.67281 19.985 8.74902 20.0001 8.82598 20L5.31035 10H0Z" fill="#FF9F00" />
                            <path d="M12.3428 10L8.82715 20C8.97707 20 9.12699 19.9428 9.24141 19.8283L17.507 10.4143C17.6116 10.3097 17.6492 10.1548 17.651 10H12.3428Z" fill="#FF7816" />
                          </svg>
                        </span>
                        {subDetails.planName}
                      </Typography>
                    </Grid>
                    <Grid size={6} sx={{ py: 2.5, pl: 3.75, border: 'solid #0000001a', borderWidth: '1px 0px 1px 0px' }}>
                      <Typography variant="body1" sx={{ fontSize: 14, color: '#6B7280' }}>Renewal Date</Typography>
                      <Typography variant="body1" sx={{ fontSize: 17, color: '#111928', fontWeight: 500 }}>{subDetails.renewalDate}</Typography>
                    </Grid>
                    <Grid size={6} sx={{ pt: 2.5, border: 'solid #0000001a', borderWidth: '0px 1px 0px 0px' }}>
                      <Typography variant="body1" sx={{ fontSize: 14, color: '#6B7280' }}>Status</Typography>
                      <Typography variant="body1" sx={{ fontSize: 17, fontWeight: 500, color: statusStyling[user?.status || 'active'].color, textTransform: 'capitalize' }}>
                        {user?.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Card
                className='detail-card-main '
                sx={{
                  borderRadius: 4,
                  boxShadow: '0px 4px 20px 0px #EEEEEE80',
                }}
              >
                <CardContent
                  className='detail-card-content'
                  sx={{
                    pt: { xs: 1.5, md: 2, lg: 5 },
                    pb: { xs: 1.5, md: 2, lg: 5 },
                    px: { xs: 1, md: 2, lg: 3.75 },
                  }}
                >
                  <Typography component='h6' variant="h6" sx={{ fontSize: 22, color: '#000', fontWeight: 600, mb: 3.75 }}>
                    Percentage Split for Gifts
                  </Typography>
                  <Grid container spacing={3.75}>
                    <Grid size={6}>
                      {/* <TextField
                      id="admin_percent-input"
                      type="number"
                      fullWidth
                      value={adminPercent}
                      onChange={handleChangeAdmin}
                    /> */}
                      <Select
                        labelId="admin-select-label"
                        id="admin-select"
                        value={adminPercent}
                        fullWidth
                        renderValue={(value) => <><span style={{ color: '#6B7280' }}>Admin: </span>{value}%</>}
                        onChange={handleChangeAdmin}
                      >
                        <MenuItem value={0}><em>None</em></MenuItem>
                        <MenuItem value={10}>10%</MenuItem>
                        <MenuItem value={20}>20%</MenuItem>
                        <MenuItem value={30}>30%</MenuItem>
                        <MenuItem value={40}>40%</MenuItem>
                        <MenuItem value={50}>50%</MenuItem>
                      </Select>
                    </Grid>
                    <Grid size={6}>
                      <Select
                        labelId="customer-select-label"
                        id="customer-select"
                        value={customerPercent}
                        // label="Customer"
                        fullWidth
                        renderValue={(value) => <><span style={{ color: '#6B7280' }}>Customer: </span>{value}%</>}
                        onChange={handleChangeCustomer}
                      >
                        <MenuItem value={0}><em>None</em></MenuItem>
                        <MenuItem value={10}>10%</MenuItem>
                        <MenuItem value={20}>20%</MenuItem>
                        <MenuItem value={30}>30%</MenuItem>
                        <MenuItem value={40}>40%</MenuItem>
                        <MenuItem value={50}>50%</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Card
                className='detail-card-main '
                sx={{
                  borderRadius: 4,
                  boxShadow: '0px 4px 20px 0px #EEEEEE80',
                }}
              >
                <CardContent
                  className='detail-card-content'
                  sx={{
                    pt: { xs: 1.5, md: 2, lg: 5 },
                    pb: { xs: 1.5, md: 2, lg: 5 },
                    px: { xs: 1, md: 2, lg: 3.75 },
                  }}
                >
                  <Typography component='h6' variant="h6" sx={{ fontSize: 22, color: '#000', fontWeight: 600, mb: 3 }}>
                    Customer Balance
                  </Typography>
                  <Box sx={{ pb: 5 }}>
                    <Typography variant="body2" sx={{ fontSize: 16, color: '#000', fontWeight: 500 }} >Balance</Typography>
                    <OutlinedInput
                      id="balance-input"
                      className='balance-input'
                      startAdornment={
                        <InputAdornment sx={{ '&>*': { color: '#000 !important', fontWeight: 600 } }} position="start">
                          $
                        </InputAdornment>
                      }
                      endAdornment={<InputAdornment position="end" sx={{ '&>*': { fontWeight: 400 } }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => setEditBal(!editBal)}>
                          {editBal ? 'Edit' : 'Save'}
                        </span>
                      </InputAdornment>}
                      sx={{ color: '#000', px: 0, borderRadius: 0, fontWeight: 600 }}
                      fullWidth
                      disabled={editBal}
                      value={balance || ''}
                      onChange={(e) => setBalance(e.target.value)}
                    />
                    <Box>

                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid >

        </Grid >
        <Grid size={12}>
          <Table className='users-table'>
            <Thead className='table-head'>
              <Tr>
                {tableHeadings.map((item, index) => <Th key={index} className='row'>{item}</Th>)}
              </Tr>
            </Thead>
            <Tbody className='table-body'>
              {dummyData?.map((item, index) => (<Tr key={index} className='row'>
                <Td>{item.orderNo}</Td>
                <Td>{item.date}</Td>
                <Td>
                  <span style={statusStyle(item.status)}>{item.status}</span>
                </Td>
                <Td>{item.total}</Td>
              </Tr>))}
            </Tbody>
          </Table>
        </Grid>

      </Grid >
      <Modal
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
        sx={{
          padding: '80px 0',
          height: '100%',
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <Box sx={modalStyle} className='image-modal' >
          <Box sx={{ position: 'relative', borderRadius: 3.5 }}>
            <IconButton
              sx={{
                position: 'absolute', top: 20, right: 20, p: 0.564, alignItems: 'center', border: '2px solid #fff',
              }}
              onClick={handleDeleteProfileImage}
            >
              <svg width="21" height="21" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.4002 13.2C18.7185 13.2 19.0237 13.3264 19.2487 13.5515C19.4738 13.7765 19.6002 14.0818 19.6002 14.4V21.2C19.6002 21.5183 19.4738 21.8235 19.2487 22.0485C19.0237 22.2736 18.7185 22.4 18.4002 22.4C18.0819 22.4 17.7767 22.2736 17.5517 22.0485C17.3266 21.8235 17.2002 21.5183 17.2002 21.2V14.4C17.2002 14.0818 17.3266 13.7765 17.5517 13.5515C17.7767 13.3264 18.0819 13.2 18.4002 13.2Z" fill="white" />
                <path d="M14.8004 14.4C14.8004 14.0818 14.674 13.7765 14.4489 13.5515C14.2239 13.3264 13.9187 13.2 13.6004 13.2C13.2821 13.2 12.9769 13.3264 12.7519 13.5515C12.5268 13.7765 12.4004 14.0818 12.4004 14.4V21.2C12.4004 21.5183 12.5268 21.8235 12.7519 22.0485C12.9769 22.2736 13.2821 22.4 13.6004 22.4C13.9187 22.4 14.2239 22.2736 14.4489 22.0485C14.674 21.8235 14.8004 21.5183 14.8004 21.2V14.4Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5996 8.4C11.5996 7.23305 12.0632 6.11389 12.8883 5.28873C13.7135 4.46357 14.8327 4 15.9996 4C17.1666 4 18.2857 4.46357 19.1109 5.28873C19.936 6.11389 20.3996 7.23305 20.3996 8.4H25.1996C25.5179 8.4 25.8231 8.52643 26.0481 8.75147C26.2732 8.97652 26.3996 9.28174 26.3996 9.6C26.3996 9.91826 26.2732 10.2235 26.0481 10.4485C25.8231 10.6736 25.5179 10.8 25.1996 10.8H23.9996V19.52C23.9996 22.208 23.9996 23.552 23.4764 24.5792C23.0162 25.4823 22.2819 26.2166 21.3788 26.6768C20.3516 27.2 19.0076 27.2 16.3196 27.2H15.6796C12.9916 27.2 11.6476 27.2 10.6204 26.6768C9.71727 26.2166 8.98299 25.4823 8.52281 24.5792C7.99961 23.552 7.99961 22.208 7.99961 19.52V10.8H6.79961C6.48135 10.8 6.17612 10.6736 5.95108 10.4485C5.72604 10.2235 5.59961 9.91826 5.59961 9.6C5.59961 9.28174 5.72604 8.97652 5.95108 8.75147C6.17612 8.52643 6.48135 8.4 6.79961 8.4H11.5996ZM13.9996 8.4C13.9996 7.86957 14.2103 7.36086 14.5854 6.98579C14.9605 6.61071 15.4692 6.4 15.9996 6.4C16.53 6.4 17.0387 6.61071 17.4138 6.98579C17.7889 7.36086 17.9996 7.86957 17.9996 8.4H13.9996ZM10.3996 10.8H21.5996V19.52C21.5996 20.904 21.598 21.7968 21.542 22.4768C21.4892 23.1296 21.398 23.3712 21.3372 23.4896C21.1072 23.9408 20.7404 24.3076 20.2892 24.5376C20.1708 24.5984 19.9292 24.6896 19.2764 24.7424C18.5964 24.7984 17.7036 24.8 16.3196 24.8H15.6796C14.2956 24.8 13.4028 24.7984 12.7228 24.7424C12.07 24.6896 11.8284 24.5984 11.71 24.5376C11.2583 24.3079 10.8908 23.941 10.6604 23.4896C10.6012 23.3712 10.51 23.1296 10.4572 22.4768C10.4012 21.7968 10.3996 20.904 10.3996 19.52V10.8Z" fill="white" />
              </svg>
            </IconButton>
            <Box sx={{}}>
              <img src={user?.profilePicture && `${import.meta.env.VITE_API_URL}/${user.profilePicture}`} alt="profile" style={{ borderRadius: 3.5, width: '100%' }} />
            </Box>
          </Box>
        </Box >
      </Modal >
    </>
  );
}