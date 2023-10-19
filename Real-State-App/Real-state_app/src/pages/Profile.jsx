import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import imgtest from '../assets/images/profile.jpg'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})


  /* firebase storage
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
  */

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercent(Math.round(progress));
    },
      (error) => {
        setFileError(true);
        console.log(error);
      },
       () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
          setFormData({ ...formData, photo: downloadURL })
        );
      }
    );
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          className='hidden'
          type='file'
          accept='image/*'
        />
        <img
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={currentUser.photo || formData.photo || imgtest}
          alt="foto do perfil"
          onClick={() => fileRef.current.click()}
        />
        <p className='text-center'>
          {fileError ? (
            <span className='text-red-700'>Error image upload</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className='text-green-700'>Successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          className='border p-3 rounded-lg'
          type="text"
          placeholder='Username'
          id='username'
        />
        <input
          className='border p-3 rounded-lg'
          type="email"
          placeholder='email'
          id='email'
        />
        <input
          className='border p-3 rounded-lg'
          type="password"
          placeholder='password'
          id='password'
        />
        <button
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          Update
        </button>
      </form>
      <div className='flex justify-between mt-3'>
        <span className='text-red-700 cursor-pointer '>Delete Account</span>
        <span className='text-red-700 cursor-pointer '>Sing Out</span>
      </div>
    </div>
  )
}
