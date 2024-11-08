import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { fetchSpaceListingById } from '../../../store/features/customersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
const ParkingDetails = () => {

    const { id } = useParams();

    const effectRan = useRef(false);
    const { data } = useSelector(state => state.customers);
    const [records, setData] = useState([]);
    const [details, setDetails] = useState();

    const { token } = useSelector(state => state.auth);

    // console.log('id', id)

    const dispatch = useDispatch()


    useEffect(() => {
        console.log('###')
        if (!effectRan.current) {
            dispatch(fetchSpaceListingById({ token, id }));
            effectRan.current = true;
        }
    }, [dispatch]);

    const transformData = (outputData) => {
        const firstItem = outputData[0]; // Assuming the output data is an array and we need the first item


        const data = {
            media: firstItem.photos.map(photo => photo.replace(/^public\//, '')) || [],
            space: firstItem?.title || '',
            hostName: firstItem?.owner?.name || '',
            spaceType: firstItem?.spaceType || '',
            vehicleType: firstItem?.vehicleType || '',
            dimensions: {
                length: `${firstItem?.dimensions.length || 0}' x 20'`,
                width: `${firstItem?.dimensions.width || 0}' x 30'`,
                height: `${firstItem?.dimensions.height || 0}' x 40'`,
            },
            address: firstItem?.location.address || '',
            description: firstItem?.description || '',
            price: firstItem?.rentalParkingPlan === 'Hourly' ? '$100/hour' : '$100/month',
            features: [
                firstItem?.amenities.includes('ClimateControlled') ? 'Climated Controlled' : null,
                firstItem?.amenities.includes('SmokeDetectors') ? 'Smoke detectors' : null,
                'Smoke free',
                'Private Space'
            ].filter(Boolean),
        };

        return data;
    };

    useEffect(() => {
        console.log('below###')

        console.log('useEffect data', data)

        console.log("data?.length:", data?.length)

        if (data?.length) {
            setData(data[0]);
            // setDetails(details1)

            console.log('transform data', transformData(data));
            setDetails(transformData(data))

        }
    }, [data]);


    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 2,
                m: { xs: 1, md: 2 },
                border: '1px solid #e0e0e0', // Light gray border
            }}
        >
            <Typography variant="h5" sx={{ mb: 3 }}>
                Spaces/Parking's Details
            </Typography>

            {/* Media Section */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Media
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    overflowX: 'auto', // Allows scrolling for small screens
                }}
            >
                {details?.media?.map((image, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={`${import.meta.env.VITE_API_URL}/${image}`}
                        alt={`Media ${index + 1}`}
                        sx={{
                            width: { xs: 80, sm: 100, md: 250 }, // Responsive width
                            height: { xs: 60, sm: 80, md: 165 }, // Responsive height
                            objectFit: 'cover',
                            borderRadius: 1,
                            
                        }}
                    />
                ))}
            </Box>

            {/* Details Grid */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}
                
                sx={{
                    p: { xs: 2, md: 2 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}
                
                >
                    <Typography variant="subtitle2">Space</Typography>
                    <Typography>{details?.space}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 2 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Host Name</Typography>
                    <Typography>{details?.hostName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 2 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Space Type</Typography>
                    <Typography>{details?.spaceType}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 4 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Vehicle Type</Typography>
                    <Typography>{details?.vehicleType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 4 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Dimensions</Typography>
                    <Typography>
                        Length: {details?.dimensions?.length}
                        Width: {details?.dimensions?.width} <br />
                        Height: {details?.dimensions?.height}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 4 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Address</Typography>
                    <Typography>{details?.address}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 4 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography>{details?.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 4 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Price</Typography>
                    <Typography>{details?.price}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{
                    p: { xs: 2, md: 4 },
                    border: '1px solid #e0e0e0', // Light gray border
                }}>
                    <Typography variant="subtitle2">Features</Typography>
                    <Typography>{details?.features?.join(', ')}</Typography>
                </Grid>
            </Grid>
        </Paper>

    );
};

export default ParkingDetails;
