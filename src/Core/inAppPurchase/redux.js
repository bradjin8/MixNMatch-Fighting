const SET_SUBSCRIPTION_PLAN = 'SET_SUBSCRIPTION_PLAN';
const SET_PLANS = 'SET_PLANS';
const IS_PLAN_ACTIVE = 'IS_PLAN_ACTIVE';

export const setIsPlanActive = (data) => ({
  type: IS_PLAN_ACTIVE,
  data,
});

export const setSubscriptionPlan = (data) => ({
  type: SET_SUBSCRIPTION_PLAN,
  data,
});

export const setPlans = (data) => ({
  type: SET_PLANS,
  data,
});

const initialState = {
  planId: '',
  plans: [],
  isPlanActive: false,
};

export const inAppPurchase = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUBSCRIPTION_PLAN:
      return {
        ...state,
        planId: action.data.planId,
      };
    case SET_PLANS:
      return {
        ...state,
        plans: action.data.plans,
      };
    case IS_PLAN_ACTIVE:
      return {
        ...state,
        isPlanActive: action.data,
      };
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};
