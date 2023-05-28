import { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";

import { DataStore } from "aws-amplify";
import { Courier } from "../models";

const AuthContext = createContext({});

//childrem is nothing but rootnavigator as whole application is mounted between AuthContext
const AuthContextProvider = ({ children }) =>{
    const [authUser, setAuthUser] = useState(null);
    const [dbCourier, setdBCourier] = useState(null);
    const sub = authUser?.attributes?.sub;

    useEffect(()=>{
        Auth.currentAuthenticatedUser({ bypassCache:true }).then(setAuthUser);
        // console.log(authUser);
    }, []);

    useEffect(()=>{
        //this will retur data in array format so we will get 1st element
        DataStore.query(Courier, (courier)=>courier.sub.eq(sub)).then((couriers)=>{
            setdBCourier(couriers[0]);
        });
    }, [sub])
    
    return(
        <AuthContext.Provider value={{authUser, dbCourier, sub, setdBCourier}}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);