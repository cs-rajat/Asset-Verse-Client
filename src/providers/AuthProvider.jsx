import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { setAuthToken } from '../api/api';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            // Verify token and get user data
            axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setUser(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Token verification failed:', err);
                    localStorage.removeItem('token');
                    setAuthToken(null);
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setAuthToken(res.data.token);
                setUser(res.data.user);
            }
            setLoading(false);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    const updateUser = (name, photo) => {
        setUser(prev => ({ ...prev, name: name || prev.name, profileImage: photo || prev.profileImage }));
        return Promise.resolve();
    };

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                return res.data;
            } catch (err) {
                console.error('Failed to refresh user:', err);
            }
        }
    };

    const authInfo = {
        user,
        loading,
        login,
        logout,
        updateUser,
        refreshUser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
