export default function Footer() {
  return (
    <footer className='bg-slate-200 shadow-md mt-auto'>
      <div className="max-w-6xl mx-auto p-3 ">
        <p className="text-center text-slate-700 text-sm ">
          &copy; {new Date().getFullYear()} Prestige Palaces. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
