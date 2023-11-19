import {  useSelector, useDispatch } from "react-redux"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"
import { updateStart, updateFailure, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, setDenyDelete } from "../redux/user/userSlice"
import { ComfirmDelete } from "../components/comfirmDelete"

export default function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state=>state.user.currentUser)
  const {loading, error, deleting} = useSelector(state=>state.user)

  const image =currentUser.avatar
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [Success, setUpdateSuccess] = useState(false)
  const [formData, setFormData] = useState({})
  const [imageError, setError] = useState(null)
 
  
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
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //alert(currentUser.currentUser._id)
      
      dispatch(updateStart())
      dispatch(setDenyDelete());
      const res = await fetch(`/api/auth/update/${currentUser._id}`,{        
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
                 
        },
        body : JSON.stringify(formData)        
      });
      //alert('here after fetch')
      console.log(formData)
      console.log(res);
      const data = await res.json();
      console.log(data);
      console.log(formData);

      if(data.success === false) {        
        dispatch(updateFailure(data.message));
        return;
      }
      

      dispatch(updateSuccess(data));
      setUpdateSuccess(true);
      
      
    } catch (error) {     
      console.log(error);      
      dispatch(updateFailure(error.message));
    }
  };

  const handleDelete =async ()=>{
    try {
      dispatch(deleteUserStart());
      


      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : 'DELETE'
      })
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      
    } catch (error) {
      console.log(error.message);    
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form id="form" onSubmit={(e)=>handleSubmit(e)} className="flex flex-col gap-4">
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || image} className="rounded-full h-24 w-24 self-center object-cover mt-2 cursor-pointer" />
        <p className="text-sm self-center">
          {imageError ? <span className="text-red-700">Error upload image</span> : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
        ) :filePerc === 100 ? (<span className="text-green-700">Image successifully uploaded</span>):"" }
        </p>
        
        
        <input id='username' type="text" placeholder="username" defaultValue={currentUser.username} className="p-3 rounded-lg border " onChange={(e)=>handleChange(e)}/>
        <input id='email' type="email" placeholder="email" defaultValue={currentUser.email} className="p-3 rounded-lg border " onChange={(e)=>handleChange(e)}/>
        <input id ='password' type="text" placeholder="password" className="p-3 rounded-lg border " onChange={(e)=>handleChange(e)}/>
        <button disabled={loading} className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80" >{loading ? 'updating...' : 'update' }</button>
      </form>
      <div className="flex justify-between mt-5">
        <ComfirmDelete toDelete={handleDelete}/>
        <span className="text-red-700 cursor-pointer">sign out</span>
      </div>
          <p className="mt-4">{error ?  (<span className="text-red-600">{error+'!'} </span>) : Success && <span className="text-green-600">Profile updated successifully</span>}</p>
    </div>
  )
}
