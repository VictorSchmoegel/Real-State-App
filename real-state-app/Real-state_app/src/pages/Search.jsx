import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Search() {
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', search);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    console.log(search)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
      setSearch(searchFromUrl);
    }

  }, [location.search])

  return (
    <main className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <div className='flex items-center gap-2'>
            <label
              htmlFor="search"
              className='whitespace-nowrap font-semibold'
            >
              Search:
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className='flex gap-2 flex-wrap items-center pt-6'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='all'
              />
              <label
                className='font-semibold'
                htmlFor='all'
              >
                Rent & Sale
              </label>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='rent'
              />
              <label
                htmlFor='rent'
                className='font-semibold'
              >
                Rent
              </label>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='sale'
              />
              <label
                className='font-semibold'
                htmlFor='sale'
              >
                Sale
              </label>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='offer'
              />
              <label
                className='font-semibold'
                htmlFor='offer'
              >
                Offer
              </label>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center pt-6'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='parking'
              />
              <label
                htmlFor='parking'
                className='font-semibold'
              >
                Parking
              </label>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='furnished'
              />
              <label
                className='font-semibold'
                htmlFor='furnished'
              >
                Furnished
              </label>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center pt-6'>
            <label className='font-semibold'>Sort:</label>
            <div className='flex gap-2 items-center'>
              <select id='sort-order' className="border rounded-lg p-3 w-full">
                <option value="price">Price high to low</option>
                <option value="price">Price low to high</option>
                <option value="date">Latest</option>
                <option value="date">Oldest</option>
              </select>
            </div>
          </div>

          <button
            type='submit'
            className='bg-slate-500 hover:bg-slate-600 text-white rounded-lg p-3 w-full mt-6 uppercase'
          >
            Search
          </button>

        </form>
      </div>
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700'>Listing Results</h1>
      </div>
    </main>
  )
}
