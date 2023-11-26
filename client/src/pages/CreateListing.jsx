import React from 'react'
import { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {
  const navigate = useNavigate();
  const currentUser = useSelector(state=>state.user.currentUser)
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(null)
  const [formData, setFormData] = useState(
    {
      imageUrls : [],
      name : '',
      description : '',
      address : '',
      type : 'rent',
      bedRooms : 1,
      bathRooms : 1,
      regularPrice : 0,
      discountPrice : 0,
      offer : false,
      parking : false,
      furnished : false,
    }
  );
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const storeImage = async (file) =>{
    return new Promise((resolve, reject) =>{
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progresss = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          console.log(`Upload is ${progress}% done`)
          setProgress(progresss+'%')
        },
        (error)=>{
         reject(error);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            resolve(downloadURL);
            
          });
        }
      )
    })
  }

  const handleImageSubmit = (e)=>{
    if(files.length > 0 && files.length + formData.imageUrls.length< 7){
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
  
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }  
      Promise.all(promises).then(urls=>{
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setUploading(false);
      }
     
      ).catch((error)=>{
        setImageUploadError('Image upload failed, (2 mb max per image)');
        setUploading(false)
      })
      
    }else{
      setImageUploadError('You can only upload 1 up to 6 images per listing')
      setUploading(false);
    }
  
    
  }

  const handleRemoveImage = (index)=>{
    setFormData({...formData, imageUrls : formData.imageUrls.filter((_, i)=> i !== index)})

  }
  const handleChange = (e)=>{
    if (e.target.id === 'sell' || e.target.id === 'rent'){
      setFormData({...formData, type : e.target.id});
    }
    if (e.target.id === 'parking' || e.target.id === 'offer' || e.target.id === 'furnished'){
      setFormData({...formData, [e.target.id] : e.target.checked});
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({...formData, [e.target.id] : e.target.value})
    }
  }
  const handleSubmit =async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);
      if(formData.imageUrls.length < 1) {setLoading(false);return setError('You must upload atleast one image')}
      if(+formData.regularPrice < +formData.discountPrice && formData.offer) {setLoading(false);return setError('Discount price must be less than regular price')}else{setFormData({...formData,discountPrice : 0});}
      const res = await fetch ('api/listing/create',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef : currentUser._id,
        }),
      })

      const data = await res.json()
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      navigate(`/listing/${data._id}`)
      
    } catch (error) {
      setLoading(false);
      setError(error.message);      
    }

  };
  console.log(formData)
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row  gap-4 '>
        <div className="flex flex-col gap-4 flex-1">
          <input onChange={handleChange} value={formData.name} id='name' className='border p-3 rounded-lg' type="text" placeholder='Name' maxLength={'62'} minLength={'10'} required/>
          <textarea onChange={handleChange} value={formData.description} id='description' className='border p-3 rounded-lg' type="text" placeholder='Description'  required/>
          <input onChange={handleChange} value={formData.address} id='address' className='border p-3 rounded-lg' type="text" placeholder='Address' required/>
          <div className="flex gap-6 flex-wrap  ">
                <div className="flex gap-2">
                  <input id='sell' className='w-5' type="checkbox" onChange={e=>handleChange(e)} checked={formData.type === 'sell'} />
                  <span>sell</span>
                </div>
                <div className="flex gap-2">
                  <input id='rent' className='w-5' type="checkbox" onChange={e=>handleChange(e)} checked={formData.type==='rent'} />
                  <span>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input onChange={handleChange} checked={formData.parking} id='parking' className='w-5' type="checkbox" />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input onChange={handleChange} checked={formData.furnished} id='furnished' className='w-5' type="checkbox" />
                  <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                  <input onChange={handleChange} checked={formData.offer} id='offer' className='w-5' type="checkbox" />
                  <span>Offer</span>
                </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input onChange={handleChange} value={formData.bedRooms} className='p-2 border border-gray-300 rounded-lg' type="number" id='bedRooms' min={1} max={10} required/>
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input onChange={handleChange} value={formData.bathRooms} className='p-2 border border-gray-300 rounded-lg' type="number" id='bathRooms' min={1} max={10} required/>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input onChange={handleChange} value={formData.regularPrice} className='p-2 border border-gray-300 rounded-lg' type="number" id='regularPrice' min={1} max={1000000} required/>
              <div  className="flex flex-col items-center">
              <p>Regular price</p>
              <span className='text-sm'>( $ / month )</span>
              </div>
            </div>
            {formData.offer &&
            <div className="flex items-center gap-2">
            <input onChange={handleChange} value={formData.discountPrice} className='p-2 border border-gray-300 rounded-lg' type="number" id='discountPrice' min={1} max={1000000} required/>
            <div className="flex flex-col items-center">
            <p>Discounted price</p>
            <span className='text-sm'>( $ / month )</span>
            </div>
          </div>
            }
          </div>
        </div>

        <div className="flex flex-1 gap-4 flex-col ">
          <p className='font-semibold'>Images :
          <span className='font-normal text-gray-600 ml-2 '> The first image will be a cover ( max 6 )</span>
          </p>
          <div className="flex gap-4">
            <input onChange={e=>setFiles(e.target.files)} className='border p-3 border-gray-300 rounded w-full' type="file" accept='image/*' multiple />
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>{uploading ? `uploading...${progress}` : 'upload'}</button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls && formData.imageUrls.map((url, index) =>(
           <div className='flex justify-between p-3 items-center border'>
             <img key={url} src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg'  />
             <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 uppercase hover:opacity-75 '>delete</button>
           </div>
          ))}
        <button disabled={loading || uploading} className='bg-slate-700 p-3 text-white uppercase rounded-lg block hover:opacity-95 disabled:opacity-80'>{loading ? 'creating...' : 'create listing'}</button>
        {error && <p className='text-red-700 text-sm text-center'>{error}</p>}
        </div>
       

      </form>
    </main>
  )
}
