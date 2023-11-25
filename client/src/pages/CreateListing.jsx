import React from 'react'

export default function CreateListing() {
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
            <input className='border p-3 border-gray-300 rounded w-full' type="file" accept='image/*' multiple />
            <button className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>upload</button>
          </div>
        <button className='bg-slate-700 p-3 text-white uppercase rounded-lg block hover:opacity-95 disabled:opacity-80'>create listing</button>
        </div>

      </form>
    </main>
  )
}
