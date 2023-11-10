import { useState,  } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { signInStart,signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const dispatch = useDispatch();
  const state = useSelector(state=>state.user)
  const [formData, setFormData] = useState({});  
  const navigate= useNavigate();
  const handleChange= (e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
    
  }
  const handleSubmit= async (e)=>{
    try{
      
      e.preventDefault();
      dispatch(signInStart())    
      
      const res= await fetch('/api/auth/signin',{
        method : 'POST',
        headers: {
          'content-type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data= await res.json();    

      console.log(data);
      
      if (data['success']===false){
        dispatch(signInFailure(data['message']));       
      }else{
        dispatch(signInSuccess(data))
        navigate('/');
      }
     
    }
    catch(e){
      dispatch(signInFailure(e.message));
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>        
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={state.loading} className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-90 disabled:opacity-80'>{state.loading ? 'loading...' : 'sign in'}</button>
        <OAuth/>
       </form>
       
         <div className='flex gap-2 mt-5'>
          
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>sign up</span>
        </Link>
        
       </div>  
       <div>
        {state.error && <p className='text-red-500 mt-5'>{state.error}</p>} 
        </div>       

    </div>
   
    

  )
}
