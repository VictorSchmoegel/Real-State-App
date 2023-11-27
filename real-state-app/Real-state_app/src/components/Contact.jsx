import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

export default function Contact({ listing }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [listing.userRef]);
  
  return (
    <div>
      {owner && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{owner.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className='w-full border p-3 rounded-lg'
            name='message'
            id='message'
            rows='2'
            placeholder='Your message'
            value={message}
            onChange={onChange}
            ></textarea>

          <Link
            to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
            Send Message
          </Link>     

        </div>
      )}
    </div>
  )
}

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};