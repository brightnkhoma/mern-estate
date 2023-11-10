import {  useSelector } from "react-redux"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"

export default function Profile() {
  const currentUser = useSelector(state=>state.user)
  const image = currentUser.currentUser.avatar
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [error, setError] = useState(false)
  const [formData, setFormData] = useState({})
  console.log(filePerc)
  console.log(formData)
  useEffect(()=>{
    if (file){
      handleFileUpload(file)
    }
  },[file])
  const handleFileUpload = (file)=>{
    setError(false);
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
      
    },
    
    (error)=>{
      setError(true) 
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL)=>{
          setFormData({...formData, avatar: downloadURL})
        }
      )
    });
  }
  console.log(file)

  return (
    <div className="max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || image} className="rounded-full h-24 w-24 self-center object-cover mt-2 cursor-pointer" />
        <p className="text-sm self-center">
          {error ? <span className="text-red-700">Error upload image</span> : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
        ) :filePerc === 100 ? (<span className="text-green-700">Image successifully uploaded</span>):"" }
        </p>
        
        
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
