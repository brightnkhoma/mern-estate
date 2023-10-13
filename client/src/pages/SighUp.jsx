import React from 'react'

export default function SighUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 className='text-3xl text-center font-semibold my-7'>Sign up</h1>
       <form  className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' className='p-3 rounded-lg' id='email'/>
        <input type="password" placeholder='password' className='p-3 rounded-lg' id='password' />
        <button className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-90 disabled:opacity-80'>sign up</button>
       </form>
       <div className='flex gap-2 mt-5'>
        <p>have an account?</p>
        <span className='text-blue-700'>sign in</span>
       </div>

    </div>
   
    

  )
}
