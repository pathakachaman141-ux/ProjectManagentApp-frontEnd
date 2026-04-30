import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ArrowLeftIcon, CheckCircledIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import { resetPassword } from '../../Redux/Auth/Action';

const ResetPassword = ({ onBack, onSuccess }) => {
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { resetPasswordLoading, resetPasswordSuccess, resetPasswordError } = useSelector(state => state.auth);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [location]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setErrors({});
        }
    }, [formData]);

    useEffect(() => {
        if (resetPasswordSuccess) {
            setFormData({ otp: '', newPassword: '', confirmPassword: '' });
            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => {
                    navigate('/auth');
                }, 2000);
            }
        }
    }, [resetPasswordSuccess, onSuccess, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
        else if (!/^\d{4}$/.test(formData.otp.trim())) newErrors.otp = 'OTP must be 4 digits';

        if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required';
        else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters long';

        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (!token) newErrors.token = 'Reset token is missing';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        dispatch(resetPassword({
            token,
            otp: formData.otp.trim(),
            newPassword: formData.newPassword
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBackToLogin = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/auth');
        }
    };

    // Success Screen with matching design
    if (resetPasswordSuccess) {
        return (
            <div className='space-y-6'>
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircledIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold text-white">Password Reset Successful!</h1>
                    <p className="text-gray-300 text-sm">Your password has been successfully updated.</p>
                    <p className="text-gray-400 text-xs">You can now login with your new password.</p>
                </div>

                <Button 
                    onClick={handleBackToLogin} 
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                    Continue to Login
                </Button>
            </div>
        );
    }

    return (
        <div className='space-y-5'>
            <h1 className="text-xl font-semibold text-center text-white">Reset Password</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* OTP Field */}
                <div className="space-y-1">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                        Verification Code
                    </label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-center text-lg tracking-[0.5em] font-mono"
                        disabled={resetPasswordLoading}
                        maxLength={4}
                        autoComplete="one-time-code"
                    />
                    {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}
                </div>

                {/* New Password Field */}
                <div className="space-y-1">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                        New Password
                    </label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 pr-12"
                            disabled={resetPasswordLoading}
                            autoComplete="new-password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={resetPasswordLoading}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeClosedIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                                <EyeOpenIcon className="h-4 w-4 text-gray-400" />
                            )}
                        </Button>
                    </div>
                    {errors.newPassword && <p className="text-red-400 text-sm">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 pr-12"
                            disabled={resetPasswordLoading}
                            autoComplete="new-password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={resetPasswordLoading}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
                                <EyeClosedIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                                <EyeOpenIcon className="h-4 w-4 text-gray-400" />
                            )}
                        </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                </div>

                {/* Error Messages */}
                {(errors.token || resetPasswordError) && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm text-center">
                            {errors.token || resetPasswordError}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <Button 
                    type="submit" 
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={resetPasswordLoading}
                >
                    {resetPasswordLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Resetting Password...
                        </span>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
                <Button
                    onClick={handleBackToLogin}
                    variant="ghost"
                    className="text-purple-400 hover:text-purple-300 p-0 h-auto font-normal text-sm flex items-center gap-2 mx-auto transition-all duration-200"
                    disabled={resetPasswordLoading}
                    type="button"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Login
                </Button>
            </div>
        </div>
    );
};

export default ResetPassword;