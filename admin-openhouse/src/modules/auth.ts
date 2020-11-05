import { auth as firebaseAuth } from '../config/firebase';
import React, { useContext, useEffect, useState } from 'react';

interface Auth {
    loggedIn: boolean;
    userID?: string;
}

interface AuthInit {
    loading: boolean;
    auth?: Auth;
}

export const AuthContext = React.createContext<Auth>({ loggedIn: false });

export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthInit() {
    const [authInit, setAuthInit] = useState<AuthInit>({ loading: true });

    useEffect(() => {
      return firebaseAuth.onAuthStateChanged((firebaseUser) => {
        const auth = firebaseUser ? { loggedIn: true, userID: firebaseUser.uid } : { loggedIn: false };
        setAuthInit({ loading: false, auth })
      });
    }, []);

    return authInit;
}