import { useEffect } from 'react'
import {useUserAuth} from "./context/context"
import {useNavigate} from "react-router-dom"

export default function ProtectedRoute({ children }) {
   const navigate = useNavigate();
    const {isAdminLogin}= useUserAuth();
useEffect(()=>{

    if(isAdminLogin===false){
        navigate("/admin/login");
    }
},[])

  return (
       children
  )
}
