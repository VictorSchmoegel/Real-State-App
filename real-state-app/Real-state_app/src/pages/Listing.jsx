import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const parametro = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${parametro.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  },[parametro.listingId]);
  console.log(listing)

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>There was an error</p>}
      {listing && !loading && !error && (
          <>
            <Swiper navigation>
              {listing.imageUrls.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className='h-[550px]'
                    style={{background: `url(${image}) center no-repeat`, backgroundSize: 'cover'}}>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
      )}
    </main>
  )
}
