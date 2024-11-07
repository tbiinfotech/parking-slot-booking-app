import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Box, Grid2 as Grid, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material'
import { useDebounce } from '../../helper/helper';
import PersonMessage from '../../components/chat/PersonMessage';
import MyMessage from '../../components/chat/MyMessage';
import moment from 'moment';


function ChatItem({ name, image, time, last }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75, borderBottom: last && '1px solid var(--border1)', cursor: 'pointer' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          alt={name}
          src={image}
          sx={{ width: 53, height: 53, bgcolor: '#3621A0' }}
        />
        <Typography variant="body2" sx={{ fontSize: 14, color: '#000', fontWeight: 700, fontFamily: 'Almarai', textTransform: 'capitalize' }}>
          {name}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ pb: 2, pr: .2, fontSize: 12, color: 'var(--text2)', fontWeight: 400, fontFamily: 'Almarai', }}>
        {moment(time).fromNow()}
      </Typography>
    </Box>
  )
}

const chatListData = [
  {
    name: 'John Snow',
    image: '',
    time: '2024-10-28 17:46:00',
  },
  {
    name: 'boat aman',
    image: '',
    time: '2024-10-27 09:30:26',
  },
  {
    name: 'tbi dev',
    image: '',
    time: '2024-10-26 09:30:26',
  },
  {
    name: 'lanovo mon',
    image: '',
    time: '2024-10-25 09:30:26',
  },
  {
    name: 'iron man',
    image: '',
    time: '2024-10-24 09:30:26',
  },
  {
    name: 'khaki app',
    image: '',
    time: '2024-10-23 09:30:26',
  },
]

export default function Chat() {
  const [searchValue, setSearchValue] = useState('');
  const [chatList, setChatList] = useState(chatListData);
  const chatListRef = useRef(null);
  const hideScrollTimeoutRef = useRef(null);

  const debouncedSearchValue = useDebounce(searchValue, 400)

  useEffect(() => {
    if (debouncedSearchValue) {
      const newdata = chatListData.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
      setChatList(newdata)
    } else {
      setChatList(chatListData)
    }
  }, [debouncedSearchValue])

  useEffect(() => {
    const container = chatListRef.current;

    const showScrollbarOnScroll = () => {
      container.classList.add('show-scrollbar');

      if (hideScrollTimeoutRef.current) {
        clearTimeout(hideScrollTimeoutRef.current);
      }

      hideScrollTimeoutRef.current = setTimeout(() => {
        container.classList.remove('show-scrollbar');
      }, 1500);
    };

    const mouseEnter = () => {
      container.classList.add('show-scrollbar');
    };

    const mouseLeave = () => {
      container.classList.remove('show-scrollbar');
    };

    container.addEventListener('wheel', showScrollbarOnScroll);
    container.addEventListener('mouseenter', mouseEnter);
    container.addEventListener('mouseleave', mouseLeave);

    return () => {
      container.removeEventListener('wheel', showScrollbarOnScroll);
      container.removeEventListener('mouseenter', mouseEnter);
      container.removeEventListener('mouseleave', mouseLeave);
      clearTimeout(hideScrollTimeoutRef.current);
    };
  }, []);
  return (
    <Box className={'chat'}>
      <Box className={`pages_inner`} >
        <Grid container>
          <Grid size={{ xs: 12, md: 12, lg: 3.5 }} sx={{ display: { xs: 'block', md: 'block', lg: 'block' } }}  >
            <Box sx={{ p: { xs: 1.5, md: 2, lg: 4.75 }, borderRight: { lg: '1px solid var(--border1)' }, }} className={'chat-section'}>
              <Typography variant="body2" sx={{ fontSize: 22, color: '#000', fontWeight: 600, mb: 1.75 }}>
                Messages
              </Typography>
              <Box sx={{}}>
                <TextField
                  id="search-input"
                  placeholder='Search'
                  fullWidth
                  className='chat-search'
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                  }}
                />
              </Box>
              <Box sx={{ mt: .5, '&:last-child': { border: 'none' } }} className='chat-list' ref={chatListRef}>
                {chatList.length ?
                  chatList.map((item, index) => (
                    <ChatItem key={index} name={item.name} image={item.image} time={item.time} last={chatList.length !== (index - 1)} />
                  )) : (
                    <Typography variant="body2" sx={{ fontSize: 18, color: '#000', fontWeight: 500, my: 3.75 }}>
                      No Messages!
                    </Typography>)}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 8.5 }} sx={{ display: { xs: 'none', md: 'none', lg: 'block' }, mt: { xs: 2, md: 0 } }}>
            <Box sx={{}} className={`chat-detail ${true}`}>
              <ChatDetail name={'tbi dev'} image={''} />
            </Box>
          </Grid>
        </Grid>
      </Box >
    </Box>
  )
}

function ChatDetail({ name, image }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      type: 0,
      time: '10:03',
      message: 'Password reset link has been sent to your registered email. Let me know once you’ve reset it!'
    },
    {
      type: 1,
      time: '10:10',
      message: 'Password reset link in registered email.'
    },
    {
      type: 0,
      time: '10:50',
      message: 'Let me know once you’ve reset it!'
    },
    {
      type: 1,
      time: '11:02',
      message: 'Password reset done.'
    },
  ]);

  const chatDisplayRef = useRef(null)
  const chatRef = useRef(null)


  const handleMessage = () => {
    setMessage('')
    message && setMessages(prevMessages => [...prevMessages, { type: 0, time: moment(new Date()).format('hh:mm'), message: message }]);
  }

  useEffect(() => {
    const container = chatDisplayRef.current;
    const showScrollbarOnScroll = () => {
      container.classList.add('show-scrollbar');

      clearTimeout(container.hideScrollTimeout);
      container.hideScrollTimeout = setTimeout(() => {
        container.classList.remove('show-scrollbar');
      }, 1500);
    };
    const mouseEnter = () => {
      container.classList.add('show-scrollbar');
    };
    const mouseLeave = () => {
      container.classList.remove('show-scrollbar');
    };


    container.addEventListener('wheel', showScrollbarOnScroll);
    container.addEventListener('mouseover', mouseEnter);
    container.addEventListener('mouseout', mouseLeave);
    return () => {
      container.removeEventListener('wheel', showScrollbarOnScroll);
      container.removeEventListener('mouseover', mouseEnter);
      container.removeEventListener('mouseout', mouseLeave);
    };
  }, []);

  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  // Add new messages (for demo)
  // useEffect(() => {
  //   const newMessage = setTimeout(() => {
  //     setMessages(prevMessages => [...prevMessages, { type: 0, time: moment(new Date()).format('hh:mm'), message: 'new message ' + moment(new Date()).format('hh:mm:ss') }]);
  //   }, 3000);

  //   return () => clearTimeout(newMessage);
  // }, [messages]);

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 3, lg: 5 }, height: 80, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid var(--border1)' }} className='head'>
        <Avatar
          alt={name}
          src={image}
          sx={{ width: 53, height: 53, bgcolor: '#3621A0' }}
        />
        <Typography variant="body2" sx={{ fontSize: 18, color: '#000', fontWeight: 700, fontFamily: 'Almarai', textTransform: 'capitalize' }}>
          {name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', height: 'calc(100% - 80px)' }}>
        <Box ref={chatDisplayRef} className='chat-display' sx={{ display: 'flex', flexDirection: 'column-reverse', mt: { xs: 1.5, md: 2, lg: 3.5 }, }}>
          <Box ref={chatRef} sx={{ display: 'flex', flexDirection: 'column-reverse', px: { xs: 1.8, md: 2.5, lg: 4 } }} className='chat-display-inner'>
            <Box sx={{}}>
              {messages.map((msg, index) => msg.type === 0 ?
                (<MyMessage key={index} time={msg.time} message={msg.message} />) : msg.type === 1 ?
                  (<PersonMessage key={index} time={msg.time} message={msg.message} />) : null
              )}
            </Box>
          </Box>
        </Box>
        <Box className='chat-message' sx={{ mt: 1, mb: 5, px: { xs: 1.8, md: 2.5, lg: 4 } }}>
          <OutlinedInput
            id="message-input"
            className='chat-message'
            placeholder='Write your message'
            endAdornment={<InputAdornment position="end" sx={{ '&>*': { fontWeight: 400 } }}>
              <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleMessage}>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6716 18.1L11.6716 18.1002L11.6774 18.0999L11.8685 18.092L11.8685 18.0921L11.8729 18.0917C12.2531 18.059 12.6152 17.9146 12.9139 17.6768C13.2125 17.4391 13.4344 17.1185 13.552 16.7552C13.552 16.755 13.5521 16.7549 13.5521 16.7547L17.9868 3.53371C17.9869 3.53346 17.987 3.5332 17.9871 3.53294C18.1112 3.18164 18.1335 2.80232 18.0515 2.43883C17.9693 2.07508 17.786 1.74205 17.5227 1.47832C17.2593 1.21458 16.9268 1.03093 16.5635 0.948651C16.2005 0.866439 15.8218 0.888795 15.471 1.01312L2.27762 5.42303C1.90962 5.53823 1.58365 5.75939 1.34035 6.0589C1.09684 6.35866 0.946934 6.72363 0.909342 7.1082C0.87175 7.49277 0.948134 7.87991 1.12896 8.22127C1.30979 8.56263 1.58706 8.84308 1.92614 9.02756L1.92641 9.02771L6.99105 11.7633L6.99104 11.7634L6.99232 11.764C7.09 11.815 7.1697 11.8948 7.2206 11.9927L7.22058 11.9927L7.22157 11.9945L9.99199 17.0655C9.99211 17.0657 9.99224 17.066 9.99237 17.0662C10.1537 17.3735 10.3947 17.6316 10.69 17.8135C10.9856 17.9956 11.3247 18.0945 11.6716 18.1ZM15.8777 2.34303L15.8777 2.3433L15.8848 2.34034C15.989 2.29644 16.1038 2.28463 16.2148 2.30641C16.3257 2.32819 16.4276 2.38257 16.5076 2.46265C16.5875 2.54272 16.6419 2.64486 16.6636 2.75604C16.6854 2.86721 16.6736 2.98236 16.6297 3.08678L16.6295 3.08667L16.6271 3.09373L12.1995 16.3093L12.1995 16.3093L12.1991 16.3105C12.1647 16.4177 12.0994 16.5123 12.0114 16.5823C11.9234 16.6523 11.8167 16.6947 11.7047 16.704L11.7039 16.7041C11.5935 16.7142 11.4826 16.6913 11.3852 16.6383C11.2878 16.5853 11.2082 16.5045 11.1565 16.4062L11.1562 16.4057L8.44885 11.3335C8.4488 11.3334 8.44875 11.3333 8.4487 11.3332C8.26854 10.9931 7.99077 10.7149 7.6512 10.5344C7.65109 10.5344 7.65099 10.5343 7.65088 10.5343L2.58685 7.79896L2.58685 7.79895L2.58596 7.79848C2.48784 7.74676 2.40721 7.66707 2.35426 7.56945C2.30131 7.47182 2.27844 7.36066 2.28853 7.25L2.2886 7.2492C2.29793 7.13697 2.34024 7.03003 2.41016 6.94188C2.48009 6.85374 2.5745 6.78833 2.68146 6.75388L2.68146 6.75389L2.68251 6.75354L15.8777 2.34303Z" fill="#1C1D21" stroke="#1C1D21" strokeWidth="0.2" />
                  <path d="M7.62151 12.0625C7.71285 12.0627 7.80333 12.0448 7.88768 12.0097C7.97234 11.9745 8.04912 11.9228 8.11355 11.8575C8.11365 11.8574 8.11375 11.8573 8.11385 11.8572L17.51 2.47847L17.5101 2.47835C17.645 2.34325 17.7207 2.16004 17.7207 1.96904C17.7207 1.77803 17.645 1.59483 17.5101 1.45972C17.3752 1.32461 17.1922 1.24868 17.0013 1.24868C16.8105 1.24868 16.6275 1.32461 16.4926 1.45972L16.4925 1.45984L7.1287 10.87C7.12852 10.8702 7.12834 10.8704 7.12816 10.8706C7.06252 10.9348 7.01033 11.0114 6.97468 11.0961C6.93892 11.181 6.92051 11.2722 6.92051 11.3643C6.92051 11.4564 6.93892 11.5476 6.97468 11.6325C7.01019 11.7168 7.0621 11.7932 7.12738 11.8573C7.19101 11.9238 7.26772 11.9764 7.35269 12.0117C7.43782 12.0471 7.52936 12.0644 7.62151 12.0625ZM7.62151 12.0625C7.62105 12.0625 7.62059 12.0625 7.62012 12.0625L7.6206 11.9625L7.62285 12.0625C7.62241 12.0625 7.62196 12.0625 7.62151 12.0625Z" fill="#1C1D21" stroke="#1C1D21" strokeWidth="0.2" />
                </svg>
              </span>
            </InputAdornment>}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
          />
        </Box>
      </Box>
    </>
  )
}
