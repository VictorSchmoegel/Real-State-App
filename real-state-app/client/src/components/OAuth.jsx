import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { singInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL
        })
      });
      const data = await res.json();
      dispatch(singInSuccess(data));
      navigate('/');
    } catch {
      console.log('error');
    }
  };

  return (
    <button  
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
      type="button"
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  )
}
