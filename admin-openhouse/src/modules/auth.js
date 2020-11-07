/* import React, { useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from '../config/firebase';

export const AuthContext = React.createContext({ loggedIn: false });

export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthInit() {
    const [authInit, setAuthInit] = useState({ loading: true });

    useEffect(() => {
      return firebaseAuth.onAuthStateChanged(user => {
        const auth = user ? { loggedIn: true, userID: user.uid } : { loggedIn: false };
        setAuthInit({ loading: false, auth })
      });
    }, []);

    return authInit;
} */