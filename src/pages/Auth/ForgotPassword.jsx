import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from "@/Components/ui/Button"
import { Input } from "@/Components/ui/Input"
import { ArrowLeftIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { forgotPassword } from '../../Redux/Auth/Action' // Adjust path as needed

const ForgotPassword = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const { 
        forgotPasswordLoading, 
        forgotPasswordSuccess, 
        forgotPasswordError 
    } = useSelector(state => state.auth);

    // Clear local error when Redux state changes
    useEffect(() => {
        if (forgotPasswordError) {
            setError('');
        }
    }, [forgotPasswordError]);

    // Clear local error when user starts typing
    useEffect(() => {
        if (error && email) {
            setError('');
        }
    }, [email, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Dispatch Redux action
        dispatch(forgotPassword(email));
    };

    const handleResendEmail = async () => {
        if (email) {
            dispatch(forgotPassword(email));
        }
    };

    const handleBackToSignIn = () => {
        // Clear any error states when going back
        setError('');
        setEmail('');
        onBack();
    };

    // Show success screen when email is sent successfully
    if (forgotPasswordSuccess) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <CheckCircledIcon className="w-16 h-16 text-green-500" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-blue-800">Check Your Email</h2>
                    <p className="text-gray-200">
                        We've sent a password reset link to
                    </p>
                    <p className="font-medium text-gray-300">{email}</p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-400">
                        Didn't receive the email? Check your spam folder or
                    </p>
                    
                    <Button 
                        onClick={handleResendEmail}
                        disabled={forgotPasswordLoading}
                        variant="outline"
                        className="w-full"
                    >
                        {forgotPasswordLoading ? 'Sending...' : 'Resend Email'}
                    </Button>

                    <Button 
                        onClick={handleBackToSignIn}
                        variant="ghost"
                        className="w-full flex items-center gap-2 text-blue-500 hover:text-blue-700"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Sign In
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-black">Forgot Password?</h2>
               
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-black"
                        disabled={forgotPasswordLoading}
                    />
                </div>

                {/* Show local validation errors */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Show Redux errors */}
                {forgotPasswordError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{forgotPasswordError}</p>
                    </div>
                )}

                <Button 
                    type="submit" 
                     className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={forgotPasswordLoading}
                >
                    {forgotPasswordLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
            </form>

            <div className="text-center">
                <Button 
                    onClick={handleBackToSignIn}
                    variant="ghost"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Sign In
                </Button>
            </div>
        </div>
    );
};

export default ForgotPassword;