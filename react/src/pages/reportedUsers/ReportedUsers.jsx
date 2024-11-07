import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import UsersTable from './UsersTable';

const data = [
  {
    srNo: 1,
    reportedTo: "Oliver Thompson",
    reportedBy: "Charlotte Evans",
    reason: "Fake Profile",
    date: "Oct 2, 2024"
  },
  {
    srNo: 2,
    reportedTo: "Sophie Johnson",
    reportedBy: "Benjamin Wright",
    reason: "Under 18",
    date: "Oct 1, 2024"
  },
  {
    srNo: 3,
    reportedTo: "Liam Garcia",
    reportedBy: "Amelia Taylor",
    reason: "Bad Behaviour",
    date: "Sep 31, 2024"
  },
  {
    srNo: 4,
    reportedTo: "Emma Robinson",
    reportedBy: "James Anderson",
    reason: "Fake Profile",
    date: "Sep 28, 2024"
  },
  {
    srNo: 5,
    reportedTo: "Noah Martinez",
    reportedBy: "Harper Clark",
    reason: "Under 18",
    date: "Sep 28, 2024"
  },
  {
    srNo: 6,
    reportedTo: "Noah Martinez",
    reportedBy: "Alexander Young",
    reason: "Fake Profile",
    date: "Sep 28, 2024"
  },
  {
    srNo: 7,
    reportedTo: "Lucas Brown",
    reportedBy: "Sofia Lewis",
    reason: "Bad Behaviour",
    date: "Sep 25, 2024"
  },
  {
    srNo: 8,
    reportedTo: "Mia Davis",
    reportedBy: "William Hall",
    reason: "Fake Profile",
    date: "Sep 23, 2024"
  },
  {
    srNo: 9,
    reportedTo: "Ethan Miller",
    reportedBy: "Ella King",
    reason: "Fake Profile",
    date: "Sep 23, 2024"
  },
  {
    srNo: 10,
    reportedTo: "Isabella Wilson",
    reportedBy: "Matthew Scott",
    reason: "Fake Profile",
    date: "Sep 20, 2024"
  }
];

export default function ReportedUsers() {
  const [records, setData] = useState(data);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const effectRan = useRef(false);

  // useEffect(() => {
  //   if (!effectRan.current) {
  //     dispatch(fetchLandForSale(token, 1));
  //     effectRan.current = true;
  //   }
  // }, [dispatch, token]);

  // const handleChangePage = (status, newPage) => {
  //   setData(null);
  //   let filter = '';
  //   if (status) filter = { status: status };
  //   dispatch(fetchLandForSale(token, newPage, filter));
  // };

  // useEffect(() => {
  //   // setTimeout(() => setData(data), 5000);
  // }, [data])

  return (
    <Box className={'reported-users'}>
      <Box className="page_title" sx={{ p: 0 }}>
        <Typography variant="h3" component="h3">
          Reported Users
        </Typography>
      </Box>
      <Box className={`pages_inner`} >
        <UsersTable data={records} />
      </Box>
    </Box>
  )
}