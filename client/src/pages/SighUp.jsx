import { useState,  } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SighUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] =useState(false);
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
      setLoading(true);
      setError(null)
      
      const res= await fetch('/api/auth/signup',{
        method : 'POST',
        headers: {
          'content-type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data= await res.json();     
      setLoading(false);
      console.log(data);
      console.log('data');
      if (data['success']===false){
        setError(data['message'])
        console.log('message');
      }else{
        navigate('/sign-in');
      }
     
    }
    catch(e){
      setLoading(false);
      setError(e.message);
      console.log('error');
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 className='text-3xl text-center font-semibold my-7'>Sign up</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-90 disabled:opacity-80'>{loading ? 'loading...' : 'sign up'}</button>
         <OAuth/>
       </form>
      
       
         <div className='flex gap-2 mt-5'>
        <p>have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>sign in</span>
        </Link>
        
       </div>  
       <div>
        {error && <p className='text-red-500 mt-5'>{error}</p>} 
        </div>       

    </div>
   
    

  )
}
