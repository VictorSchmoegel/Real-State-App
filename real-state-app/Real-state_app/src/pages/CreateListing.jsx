import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
 const [loading, setLoading] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [formData, setFormData] = useState({
    imagesUrls: [],
  });
  console.log(formData);
  
  const handleImgSubmit = () => {
    if (files.length > 0 && files.length + formData.imagesUrls.length < 7) {
      setLoading(true);
      setErrorUpload(false);
      const promisesImg = []

      for (let i = 0; i < files.length; i += 1) {
        promisesImg.push(storeImage(files[i]));
      }

      Promise.all(promisesImg).then((values) => {
        setFormData({ ...formData, imagesUrls: formData.imagesUrls.concat(values) });
        setErrorUpload(false);
        setLoading(false);
      }).catch(() => {
        setErrorUpload('Image upload failed');
        setLoading(false);
      });
    } else {
      setErrorUpload('You can only upload 6 images');
      setLoading(false);
    }
  };

  const handleRemoveImg = (index) => {
    const newImages = formData.imagesUrls.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      imagesUrls: newImages,
    })
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error)=> {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      )
    });
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input 
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea 
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input 
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='sale'
                className='w-5'
              />
              <span>Sell</span>
            </div>

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='rent'
                className='w-5'
              />
              <span>Rent</span>
            </div>

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='parking'
                className='w-5'
              />
              <span>Parking Spot</span>
            </div>

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='furnished'
                className='w-5'
              />
              <span>Furnished</span>
            </div>

            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='offer'
                className='w-5'
              />
              <span>Offer</span>
            </div>

          </div>

          <div className='flex flex-wrap gap-6'>

            <div className='flex items-center gap-2'>
              <input 
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Beds</p>
            </div>

            <div className='flex items-center gap-2'>
              <input 
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Baths</p>
            </div>

            <div className='flex items-center gap-2'>
              <input 
                type='number'
                id='regular-price'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs '>($ / month)</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <input 
                type='number'
                id='disconted-price'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Disconted Price</p>
                <span className='text-xs '>($ / month)</span>
              </div>
            </div>

          </div>

        </div>

        <div className='flex flex-col flex-1 gap-2'>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          
          <div className='flex gap-4'>
            <input 
              type='file'
              id='images'
              accept='image/*'
              multiple
              className='p-3 border border-gray-300 rounded w-full'
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              disabled={loading}
              className='p-3 text-green-700 border border-green-700 rouded uppercase hover:shadow-lg disabled:opacity-80'
              type='button'
              onClick={handleImgSubmit}
            >
              {loading ? 'Loading...' : 'Upload'}
            </button>
          </div>
            <p className='text-red-700 self-center'>{errorUpload && errorUpload}</p>
            {
              formData.imagesUrls.length > 0 && formData.imagesUrls.map((url, index) => (
                <div key={url} className='flex justify-between p-3 border items-center'>
                  <img
                    src={url}
                    alt='img'
                    className='w-24 h-24 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImg(index)}
                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                  </button>
                </div>
              ))
            }
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-5'
          >
            Create List
          </button>
        </div>
      </form>
    </main>
  )
}
