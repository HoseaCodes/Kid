import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";

export const AuthContext = createContext({ userPresent:false, user:null })

export default function FirebaseAuthContext(props){
   	const [user, loading, error] = useAuthState(auth);

    let [state,changeState] = useState({
        userDataPresent:false,
        user:user,
        userInfo:null,
        auth: auth,
        listener:null
    })

    console.log(user)
    console.log(auth)
    useEffect(()=>{
        if(state.listener==null){
            // changeState({...state,listener:auth.onAuthStateChanged((user)=>{
            // if(userInfo)
            //     changeState(oldState=>({...oldState,userDataPresent:true,user:user,auth:auth,userInfo:userInfo}));
            //     else
            //     changeState(oldState=>({...oldState,userDataPresent:true,userInfo:null}));
            // })});
        }

        return ()=>{
        if(state.listener)
            state.listener()
        }
    },[])
  
    return (
        <AuthContext.Provider value={state}>
            {props.children}
        </AuthContext.Provider>
    )
}