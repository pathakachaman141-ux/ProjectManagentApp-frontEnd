import React, { useEffect } from 'react'
import { Button } from "@/Components/ui/button"
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { createPayment } from '../../Redux/Payment/Action'
import { upgradeSubscription, getUserSubscription } from '../../Redux/Subscription/Action'

const SubscriptionCard = ({ data }) => {
  const dispatch = useDispatch();
  const { subscription } = useSelector(store => store);
  
  // Define plan hierarchy (higher number = higher tier)
  const planHierarchy = {
    "FREE": 0,
    "MONTHLY": 1,
    "ANNUALLY": 2
  };

  // Fetch subscription data on component mount
  useEffect(() => {
    // Fetch current subscription details from backend
    dispatch(getUserSubscription());
  }, [dispatch]);

  // Check if subscription is expired
  const isSubscriptionExpired = () => {
    if (!subscription?.subscriptionDetails?.subscriptionEndDate) {
      return false;
    }
    return new Date(subscription.subscriptionDetails.subscriptionEndDate) < new Date();
  };

  // Check if current plan is higher tier than this card's plan
  const isLowerTierPlan = () => {
    const currentPlanType = subscription?.subscriptionDetails?.planType || "FREE";
    const currentPlanTier = planHierarchy[currentPlanType] || 0;
    const cardPlanTier = planHierarchy[data.planType] || 0;
    
    // Only disable if current plan is higher tier AND not expired
    return currentPlanTier > cardPlanTier && !isSubscriptionExpired();
  };

  // Check if this is the current active plan
  const isCurrentPlan = () => {
    const currentPlanType = subscription?.subscriptionDetails?.planType || "FREE";
    return currentPlanType === data.planType && !isSubscriptionExpired();
  };

  // Auto-refresh subscription data when it expires
  useEffect(() => {
    if (!subscription?.subscriptionDetails?.subscriptionEndDate) return;

    const endDate = new Date(subscription.subscriptionDetails.subscriptionEndDate);
    const now = new Date();
    
    if (endDate > now) {
      // Set timeout to refresh when subscription expires
      const timeUntilExpiry = endDate.getTime() - now.getTime();
      
      const timeoutId = setTimeout(() => {
        dispatch(getUserSubscription());
      }, timeUntilExpiry);

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [subscription?.subscriptionDetails?.subscriptionEndDate, dispatch]);

  // Refresh subscription data periodically to keep it in sync
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getUserSubscription());
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleUpgrade = () => {
    // If it's a FREE plan, handle it differently
    if (data.planType === "FREE") {
      // For free plan, directly upgrade without payment
      dispatch(upgradeSubscription("FREE"));
      return;
    }
    
    // For paid plans, create payment
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    
    dispatch(createPayment({ 
      planType: data.planType, 
      jwt: jwt 
    }));
  }

  const handleClick = () => {
    // Don't do anything if button is disabled
    if (getButtonState().disabled) {
      return;
    }
    
    handleUpgrade();
  }

  // Determine button state and text based on backend plan data
  const getButtonState = () => {
    const currentPlanType = subscription?.subscriptionDetails?.planType || "FREE";
    const isExpired = isSubscriptionExpired();
    
    // Loading state - when subscription data is being fetched
    if (subscription?.loading) {
      return {
        text: "Loading...",
        disabled: true,
        className: "opacity-50 cursor-not-allowed"
      };
    }
    
    // If this is the current active plan
    if (currentPlanType === data.planType && !isExpired) {
      return {
        text: "Current Plan",
        disabled: true,
        className: "opacity-50 cursor-not-allowed bg-green-600"
      };
    }
    
    // If this is a lower tier plan than current active plan
    if (isLowerTierPlan()) {
      return {
        text: "Not Available",
        disabled: true,
        className: "opacity-30 cursor-not-allowed bg-gray-500"
      };
    }
    
    // If current plan is expired and this is the same plan (renewal case)
    if (currentPlanType === data.planType && isExpired) {
      return {
        text: "Renew Plan",
        disabled: false,
        className: "bg-orange-500 hover:bg-orange-600 text-white"
      };
    }
    
    // If this is an upgrade to a higher tier plan
    if (planHierarchy[data.planType] > planHierarchy[currentPlanType]) {
      return {
        text: "Upgrade",
        disabled: false,
        className: "bg-blue-600 hover:bg-blue-700 text-white"
      };
    }
    
    // Default state - available for selection
    return {
      text: "Get Started",
      disabled: false,
      className: "bg-purple-600 hover:bg-purple-700 text-white"
    };
  };

  const buttonState = getButtonState();

  // Show loading state if subscription data is being fetched
  if (subscription?.loading) {
    return (
      <div className="rounded-xl bg-[#1b1b1b] bg-opacity-20 shadow-[#14173b] shadow-2xl card p-5 space-y-5 w-[18rem] opacity-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-[#1b1b1b] bg-opacity-20 shadow-[#14173b]
    shadow-2xl card p-5 space-y-5 w-[18rem] transition-opacity duration-300 ${
      isLowerTierPlan() ? 'opacity-60' : ''
    }`}>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">{data.planName}</p>
          {isCurrentPlan() && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div>
          <span className='text-xl font-semibold'>₹{data.price}</span>
          <span className="text-gray-400">/{data.planType.toLowerCase()}</span>
        </div>
        
        {data.planType === "ANNUALLY" && (
          <p className='text-green-500 text-sm font-medium'>🎉 30% off</p>
        )}
        
        {/* Show expiry warning if plan is expired */}
        {subscription?.subscriptionDetails?.planType === data.planType && isSubscriptionExpired() && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-2">
            <p className='text-red-400 text-sm'>⚠️ Plan Expired - Renew to continue</p>
          </div>
        )}

        {/* Show plan comparison info */}
        {isLowerTierPlan() && (
          <div className="bg-gray-500 bg-opacity-20 border border-gray-500 rounded p-2">
            <p className='text-gray-400 text-sm'>You already have a higher tier plan</p>
          </div>
        )}

        <Button
          onClick={handleClick}
          disabled={buttonState.disabled}
          className={`w-full transition-all duration-200 ${buttonState.className}`}>
            {buttonState.text}
        </Button>
        
        <div className="space-y-2">
           {data.features.map((item) => (
             <div key={item} className='flex items-center gap-2 text-sm'>
                <CheckCircledIcon className="text-green-500 flex-shrink-0"/>
                <p className="text-gray-300">{item}</p>
            </div>
           ))}
        </div>
      
    </div>
  )
}

export default SubscriptionCard