import {  useSelector } from "react-redux"

export default function Profile() {
  const currentUser = useSelector(state=>state.user)
  const image = currentUser.currentUser.avatar
  return (
    <div className="max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <img src={image} className="rounded-full h-24 w-24 self-center object-cover mt-2 cursor-pointer" />
        <input id='username' type="text" placeholder="username" className="p-3 rounded-lg border "/>
        <input id='email' type="email" placeholder="email" className="p-3 rounded-lg border "/>
        <input id ='password' type="text" placeholder="password" className="p-3 rounded-lg border "/>
        <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">delete account</span>
        <span className="text-red-700 cursor-pointer">sign out</span>
      </div>
    </div>
  )
}
