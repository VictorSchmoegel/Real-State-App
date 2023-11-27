import { useSelector, useDispatch } from "react-redux"
import { useRef, useState, useEffect } from "react"
import imgtest from '../assets/images/profile.jpg'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  userDeletedStart,
  userDeletedSuccess,
  userDeletedFailure,
  userSingOutStart,
  userSingOutSuccess,
  userSingOutFailure,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [singOut, setSingOut] = useState(false);
  const [showlistingsError, setShowlistingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

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
        console.log(error);
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, photo: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(userDeletedStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userDeletedFailure(data.message));
        return;
      }
      dispatch(userDeletedSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(userDeletedFailure(error.message));
    }
  };

  const handleSingOut = async () => {
    try {
      dispatch(userSingOutStart());
      const res = await fetch('/api/auth/singout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(userSingOutFailure(data.message));
        return;
      }
      dispatch(userSingOutSuccess(data));
      setSingOut(true);
    } catch (error) {
      dispatch(userSingOutFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowlistingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setShowlistingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowlistingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          className='border p-3 rounded-lg'
          type="email"
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          className='border p-3 rounded-lg'
          type="password"
          placeholder='password'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          to={'/create-list'}
          className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 text-center"
        >
          {loading ? 'Loading...' : 'CreateList'}
        </Link>
      </form>
      <div className='flex justify-between mt-3'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer '
        >
          Delete Account
        </span>
        <span
          onClick={handleSingOut}
          className='text-red-700 cursor-pointer '
        >
          Sign Out
        </span>
      </div>
      <p className='text-red-700'>{error ? error : ''}</p>
      <p className='text-green-700'>{updateSuccess ? 'Successfully updated!' : ''}</p>
      <p className='text-green-700'>{singOut ? 'Successfully sign out!' : ''}</p>
      <button
        onClick={handleShowListings}
        className="text-green-700 cursor-pointer w-full text-center"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5">{showlistingsError ? 'Error showing listings' : ''}</p>
      
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
