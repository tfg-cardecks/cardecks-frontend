import React, { createContext, useCallback, useMemo, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const [authenticated, setAuthenticated] = useState(
        Boolean(localStorage.getItem('access_token'))
    );

    const getInitialRole = () => {
        const roleFromStorage = localStorage.getItem('role');
        if (!roleFromStorage) {
            return { authenticated: false, isCustomer: false, isAdmin: false, role: 'anonymous' };
        }
        try {
            return JSON.parse(roleFromStorage);
        } catch (error) {
            return { authenticated: false, isCustomer: false, isAdmin: false, role: 'anonymous' };
        }
    };

    const [role, setRole] = useState(getInitialRole);
    const { authenticated: isAuth, isCustomer, isAdmin } = role;
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const login = useCallback(
        function (token, userType, userId) {
            const role = {
                authenticated: true,
                isCustomer: userType === 'customer',
                isAdmin: userType === 'admin',
                role: userType,
            };
            localStorage.setItem('access_token', token);
            localStorage.setItem('role', JSON.stringify(role));
            localStorage.setItem('userId', userId);
            setAuthenticated(true);
            setRole(role);
            setUserId(userId);
        },
        []
    );

    const logout = useCallback(function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setAuthenticated(false);
        setRole({ authenticated: false, isCustomer: false, isAdmin: false, role: 'anonymous' });
        setUserId(null);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            if (authenticated) {
                return;
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [authenticated]);

    const value = useMemo(
        () => ({
            authenticated,
            login,
            logout,
            isAuth,
            isCustomer,
            isAdmin,
            userId,
        }),
        [authenticated, login, logout, isAuth, isCustomer, isAdmin, userId]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuthContext() {
    return useContext(AuthContext);
}