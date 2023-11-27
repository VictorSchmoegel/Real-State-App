import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    search: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  console.log(listings);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('search');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebarData({
        search: searchFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };
    fetchListings();

  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({
        ...sidebarData,
        type: e.target.id
      });
    }

    if (e.target.id === 'search') {
      setSidebarData({
        ...sidebarData,
        search: e.target.value
      });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false
      })
    }

    if (e.target.id === 'sort-order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({
        ...sidebarData,
        sort,
        order
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams();
    urlParams.set('search', sidebarData.search);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

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
              value={sidebarData.search}
              onChange={handleChange}
            />
          </div>

          <div className='flex gap-2 flex-wrap items-center pt-6'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type="checkbox"
                id='all'
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
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
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
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
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
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
                onChange={handleChange}
                checked={sidebarData.offer}
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
                onChange={handleChange}
                checked={sidebarData.parking}
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
                onChange={handleChange}
                checked={sidebarData.furnished}
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
              <select
                className="border rounded-lg p-3 w-full"
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort-order'
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
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
