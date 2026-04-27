import { useEffect } from 'react'
import {useUserAuth} from "./context/context"
import {useNavigate} from "react-router-dom"

export default function ProtectedRoute({ children }) {
   const navigate = useNavigate();
    const {isLogin}= useUserAuth();
useEffect(()=>{

    if(isLogin===false){
        navigate("/login");
    }
},[])

  return (
       children
  )
}
