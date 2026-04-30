import React, { useState, useEffect } from 'react'
import { Button } from '@/Components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { acceptInvitation } from '../../Redux/Project/Action'
import { useNavigate } from 'react-router-dom'
import { Alert, AlertDescription } from '@/Components/ui/alert'

const AcceptInvitation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    // Get project state from Redux (optional)
    const { project } = useSelector(store => store);
    
    const handleAcceptInvitation = async () => {
        if (!token) {
            setError('Invalid or missing invitation token');
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            const result = await dispatch(acceptInvitation(token, navigate));

            console.log(result)
            
            setSuccess(true);
            
            // Optional: Show success message for a moment before navigation
            setTimeout(() => {
                if (result?.projectId) {
                    navigate(`/project/${result.projectId}`);

                } else {
                    navigate('/');
                }
            }, 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to accept invitation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    
    // Validation for missing token
    if (!token) {
        return (
            <div className='h-[85vh] flex flex-col justify-center items-center'>
                <div className='max-w-md w-full px-4'>
                    <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                            Invalid or missing invitation token. Please check your invitation link.
                        </AlertDescription>
                    </Alert>
                    <Button 
                        onClick={() => navigate('/login')} 
                        className="w-full mt-4"
                        variant="outline"
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className='h-[85vh] flex flex-col justify-center items-center'>
            <div className='max-w-md w-full px-4 text-center'>
                {success ? (
                    <div className="space-y-4">
                        <h1 className='py-5 font-semibold text-xl text-green-600'>
                            Invitation Accepted Successfully!
                        </h1>
                        <p className="text-gray-600">
                            Redirecting you to the project...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h1 className='py-5 font-semibold text-xl'>
                            You are invited to join the Project
                        </h1>
                        
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <Button 
                            onClick={handleAcceptInvitation}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Accepting Invitation...' : 'Accept Invitation'}
                        </Button>
                        
                        <Button 
                            onClick={() => navigate('/login')} 
                            variant="outline"
                            className="w-full"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AcceptInvitation