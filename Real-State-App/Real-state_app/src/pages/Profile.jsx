import { useSelector } from "react-redux"

export default function Profile() {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'  src={currentUser.photo} alt="foto do perfil" />
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
      </form>
    </div>
  )
}
