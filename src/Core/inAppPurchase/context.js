import React from 'react';

export const IAPContext = React.createContext({
  processing: false,
  setProcessing: () => {},
  activePlan: 0,
  subscriptionVisible: false,
  setSubscriptionVisible: () => {},
});

export const useIap = () => React.useContext(IAPContext);
