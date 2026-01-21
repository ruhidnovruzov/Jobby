// src/components/AuthForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ isRegister, role }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        category: '',
        companyName: '',
        industry: '',
        description: '',
        address: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const url = isRegister
            ? 'https://job-server-tcq9.onrender.com/api/auth/register'
            : 'https://job-server-tcq9.onrender.com/api/auth/login';

        const dataToSend = {
            email: formData.email,
            password: formData.password,
            role: role,
        };

        if (isRegister) {
            if (role === 'applicant') {
                Object.assign(dataToSend, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    category: formData.category,
                });
            } else if (role === 'company') {
                Object.assign(dataToSend, {
                    companyName: formData.companyName,
                    industry: formData.industry,
                    description: formData.description,
                    address: formData.address,
                });
            }
        }

        try {
            const res = await axios.post(url, dataToSend);
            setMessage(res.data.message || (isRegister ? 'Qeydiyyat uğurludur!' : 'Giriş uğurludur!'));
            setError('');

            if (isRegister) {
                // Qeydiyyat uğurlu olduqda /auth (giriş) səhifəsinə yönləndir
                navigate('/auth');
                // Qeydiyyatdan sonra login etmədiyi üçün local storage-ı təmizlə
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('displayName');
            } else {
                // Giriş uğurlu olduqda Ana Səhifəyə yönləndir
                login(res.data.token, res.data.role, res.data.displayName);
                navigate('/');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {isRegister ? 'Qeydiyyat' : 'Daxil Ol'}
            </h2>

            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Parol
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>

            {isRegister && role === 'applicant' && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            Ad
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Soyad
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                            İş Sahəsi
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                </>
            )}

            {isRegister && role === 'company' && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
                            Şirkət Adı
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="industry">
                            Sektor
                        </label>
                        <input
                            type="text"
                            name="industry"
                            id="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Təsvir
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            Ünvan
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                </>
            )}

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    {isRegister ? 'Qeydiyyatdan Keç' : 'Daxil Ol'}
                </button>
            </div>
        </form>
    );
};

export default AuthForm;