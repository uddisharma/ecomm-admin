import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState: any = {
  seller:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('seller') as string) || null
      : null,
};

const SellerContext = createContext(initialState);

const sellerReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_SELLER':
      return {
        ...state,
        seller: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        seller: null,
      };
    default:
      return state;
  }
};

const SellerProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(sellerReducer, initialState);

  useEffect(() => {
    localStorage.setItem('seller', JSON.stringify(state.seller));
  }, [state.seller]);

  const setSeller = (seller: any) => {
    dispatch({ type: 'SET_SELLER', payload: seller });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('seller');
  };

  const value = { state, setSeller, logout };

  return (
    <SellerContext.Provider value={value}>{children}</SellerContext.Provider>
  );
};

export { SellerContext, SellerProvider };
