import React from 'react'
import { Card } from '@/Components/ui/card'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/Components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { upgradeSubscription, getUserSubscription } from '../../Redux/Subscription/Action'
import { useEffect, useState } from 'react'

const UpgradeSuccess = () => {
  const navigate = useNavigate();
  const { subscription } = useSelector(store => store)
  const dispatch = useDispatch();
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  
  const queryParams = new URLSearchParams(location.search)
  const paymentId = queryParams.get("payment_id")
  const planType = queryParams.get("planType")

  useEffect(() => {
    const handleUpgrade = async () => {
      if (planType && !upgradeComplete) {
        try {
          // First upgrade the subscription
          await dispatch(upgradeSubscription(planType));
          // Then fetch the updated subscription details
          await dispatch(getUserSubscription());
          setUpgradeComplete(true);
        } catch (error) {
        }
      }
    };

    handleUpgrade();
  }, [planType, dispatch, upgradeComplete]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get subscription details from Redux store
  const getSubscriptionDetails = () => {
    const subscriptionDetails = subscription?.subscriptionDetails;
    
    if (!subscriptionDetails) {
      return {
        startDate: 'Loading...',
        endDate: 'Loading...',
        planType: planType || 'Unknown'
      };
    }

    return {
      startDate: formatDate(subscriptionDetails.startedSubscriptionDate),
      endDate: formatDate(subscriptionDetails.subscriptionEndDate),
      planType: subscriptionDetails.planType || planType || 'Unknown'
    };
  };

  const upgradeDetails = getSubscriptionDetails();

  // Show loading state while subscription is being processed
  if (subscription?.loading) {
    return (
      <div className="flex justify-center">
        <Card className="mt-20 p-6 space-y-5 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl">Processing your upgrade...</p>
          </div>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex justify-center">
      <Card className="mt-20 p-6 space-y-5 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <CheckCircledIcon className="h-9 w-9 text-green-500" />
          <p className="text-xl">Plan Upgraded Successfully</p>
        </div>
        
        {/* Payment ID display */}
        {paymentId && (
          <div className="text-center">
            <p className="text-sm text-gray-500">Payment ID: {paymentId}</p>
          </div>
        )}
        
        <div className="space-y-3 text-center">
          <p className="text-green-500">Start date: {upgradeDetails.startDate}</p>
          <p className="text-red-500">End date: {upgradeDetails.endDate}</p>
          <p className="text-blue-500">Plan Type: {upgradeDetails.planType}</p>
        </div>
        
        {/* Additional subscription info */}
        {subscription?.subscriptionDetails && (
          <div className="text-center space-y-1 text-sm text-gray-600">
            <p>Subscription ID: {subscription.subscriptionDetails.id}</p>
            {subscription.subscriptionDetails.isActive !== undefined && (
              <p className={subscription.subscriptionDetails.isActive ? "text-green-600" : "text-red-600"}>
                Status: {subscription.subscriptionDetails.isActive ? "Active" : "Inactive"}
              </p>
            )}
          </div>
        )}
        
        <Button onClick={() => navigate("/")}>Go To Home</Button>
      </Card>
    </div>
  )
}

export default UpgradeSuccess