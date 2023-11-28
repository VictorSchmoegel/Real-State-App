import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import PropTypes from 'prop-types';

export default function ListingCard({ listing }) {
  return (
    <main className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          className='h-[320px] sm:h-220px w-full object-cover hover:scale-105 transition-scale duration-300'
          src={listing.imageUrls[0]} alt='principal image from the house'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p
              className='text-sm text-gray-600 truncate'
            >
              {listing.address}
            </p>
          </div>
          <p
            className='text-sm text-gray-600 line-clamp-2'
          >
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold text'>
            $
            {listing.offer ? listing.discontedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}{' '}
            {listing.type === 'rent' ? '/month' : ''}
          </p>
          <div className='flex gap-3 font-semibold text-sm'>
            <div>
              {listing.bedrooms > 1 ? 'Beds' : 'Bed'}: {listing.bedrooms}
            </div>
            <div>
              {listing.bathrooms > 1 ? 'Baths' : 'Bath'}: {listing.bathrooms}
            </div>
          </div>
        </div>
      </Link>
    </main>
  )
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    discontedPrice: PropTypes.number.isRequired,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
  }).isRequired,
}

