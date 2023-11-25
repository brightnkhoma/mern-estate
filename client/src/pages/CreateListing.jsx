import React from 'react'
import { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'

export default function CreateListing() {
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState(
    {
      imageUrls : [],
    }
  );
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const storeImage = async (file) =>{
    return new Promise((resolve, reject) =>{
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          console.log(`Upload is ${progress}% done`)
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
  console.log(formData)
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row  gap-4 '>
        <div className="flex flex-col gap-4 flex-1">
          <input id='name' className='border p-3 rounded-lg' type="text" placeholder='Name' maxLength={'62'} minLength={'10'} required/>
          <textarea id='description' className='border p-3 rounded-lg' type="text" placeholder='Description'  required/>
          <input id='address' className='border p-3 rounded-lg' type="text" placeholder='Address' required/>
          <div className="flex gap-6 flex-wrap  ">
                <div className="flex gap-2">
                  <input id='sale' className='w-5' type="checkbox" />
                  <span>sell</span>
                </div>
                <div className="flex gap-2">
                  <input id='rent' className='w-5' type="checkbox" />
                  <span>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input id='parking' className='w-5' type="checkbox" />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input id='furnished' className='w-5' type="checkbox" />
                  <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                  <input id='offer' className='w-5' type="checkbox" />
                  <span>Offer</span>
                </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input className='p-2 border border-gray-300 rounded-lg' type="number" id='bedrooms' min={1} max={10} required/>
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input className='p-2 border border-gray-300 rounded-lg' type="number" id='bathrooms' min={1} max={10} required/>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input className='p-2 border border-gray-300 rounded-lg' type="number" id='regularPrice' min={1} max={10} required/>
              <div  className="flex flex-col items-center">
              <p>Regular price</p>
              <span className='text-sm'>( $ / month )</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input className='p-2 border border-gray-300 rounded-lg' type="number" id='discountPrice' min={1} max={10} required/>
              <div className="flex flex-col items-center">
              <p>Discounted price</p>
              <span className='text-sm'>( $ / month )</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-4 flex-col ">
          <p className='font-semibold'>Images :
          <span className='font-normal text-gray-600 ml-2 '> The first image will be a cover ( max 6 )</span>
          </p>
          <div className="flex gap-4">
            <input onChange={e=>setFiles(e.target.files)} className='border p-3 border-gray-300 rounded w-full' type="file" accept='image/*' multiple />
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>{uploading ? 'uploading...' : 'upload'}</button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls && formData.imageUrls.map((url, index) =>(
           <div className='flex justify-between p-3 items-center border'>
             <img key={url} src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg'  />
             <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 uppercase hover:opacity-75 '>delete</button>
           </div>
          ))}
        <button className='bg-slate-700 p-3 text-white uppercase rounded-lg block hover:opacity-95 disabled:opacity-80'>create listing</button>
        </div>
       

      </form>
    </main>
  )
}
