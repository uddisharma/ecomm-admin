'use client'
import React, { createContext, useReducer, useEffect } from 'react';

const initialState: any = {
  onboarding:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('onboarding') as string) || null
      : null,
};

const OnboardingContext = createContext(initialState);

const onboardingReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_ONBOARDING':
      return {
        ...state,
        onboarding: action.payload,
      };
    case 'LOGOUT_ONBOARDING':
      return {
        ...state,
        onboarding: null,
      };
    default:
      return state;
  }
};

const OnboardingProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  useEffect(() => {
    localStorage.setItem('onboarding', JSON.stringify(state.onboarding));
  }, [state.onboarding]);

  const setOnboarding = (onboarding: any) => {
    dispatch({ type: 'SET_ONBOARDING', payload: onboarding });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT_ONBOARDING' });
    localStorage.removeItem('onboarding');
  };

  const value = { state, setOnboarding, logout };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export { OnboardingContext, OnboardingProvider };
