import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../pages/layout/MainLayout';
import ProtectedRoute from '../helper/ProtectedRoute';
import LogIn from '../auth/LogIn';
import Customers from '../pages/customers/Customers';
import ReportedUsers from '../pages/reportedUsers/ReportedUsers';
import CustomerDetail from '../pages/customers/CustomerDetail';
import SpaceListing from '../pages/spaces/SpaceListing'
import Chat from '../pages/chat/Chat';
import CreateAdmin from '../pages/createAdmin/CreateAdmin';
import ParkingDetails from '../pages/spaces/ParkingDetails';
import LinkBankAccount from '../pages/account/LinkBankAccount';
import Payments from '../pages/payments/Payments';

const router = createBrowserRouter([
    {
        path: "",
        element: <Navigate to={`customers`} />,
    },
    {
        path: "login",
        element: <LogIn />,
    },
    {
        path: "forget-password",
        element: <LogIn />,
    },
    {
        path: "customers",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <Customers />
                </MainLayout>
            }
        />,
    },
    {
        path: "space-listing",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <SpaceListing />
                </MainLayout>
            }
        />,
    },
    {
        path: "parking/details/:id",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <ParkingDetails />
                </MainLayout>
            }
        />,
    },
    {
        path: "link-bank-account",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <LinkBankAccount />
                </MainLayout>
            }
        />,
    },
    {
        path: "payments",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <Payments />
                </MainLayout>
            }
        />,
    },



    {
        path: "customers/details/:customerId",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <CustomerDetail />
                </MainLayout>
            }
        />,
    },
    {
        path: "chat",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <Chat />
                </MainLayout>
            }
        />,
    },
    {
        path: "reported-users",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <ReportedUsers />
                </MainLayout>
            }
        />,
    },
    {
        path: "create-admin",
        element: <ProtectedRoute
            element={
                <MainLayout>
                    <CreateAdmin />
                </MainLayout>
            }
        />,
    },

]);


export default router;