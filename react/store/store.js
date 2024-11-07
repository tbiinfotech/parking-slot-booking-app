import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from './features/authSlice'
import customersReducer from './features/customersSlice'
import userReducer from './features/userSlice'

const persistConfig = {
    key: "root",
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const appReducer = combineReducers({
    auth: persistedAuthReducer,
    customers: customersReducer,
    user: userReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/logoutSuccess') {
        const newState = {
            auth: state.auth,
        };
        // localStorage.removeItem('token')
        storage.removeItem('persist:root');
        return appReducer(newState, action);
    }
    return appReducer(state, action);
};


const store = configureStore({
    reducer: rootReducer,
    devTools: import.meta.env.VITE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

const persistor = persistStore(store);

export { persistor, store }; 