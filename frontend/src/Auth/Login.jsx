import React from 'react'
import {useNavigate} from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate()
    return (
        <div className='flex  justify-center items-center p-10'>
            <div className=''>
                <button onClick={()=> navigate('/dashboard')} className='bg-amber-400'>Login with Google</button>
            </div>
        </div>
    )
}

export default Login