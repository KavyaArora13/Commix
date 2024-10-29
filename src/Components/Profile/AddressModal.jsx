import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../Assets/Css/Profile/AddressNodal.scss';

const AddressModal = ({ isOpen, onClose, onSave, addressToEdit }) => {
  console.log("AddressModal rendered. isOpen:", isOpen);
  
  const [address, setAddress] = useState({
    street: '',
    state: '',
    house: '',
    postcode: '',
    location: '',
    country: ''
  });

  useEffect(() => {
    if (addressToEdit) {
      setAddress(addressToEdit);
    } else {
      setAddress({
        street: '',
        state: '',
        house: '',
        postcode: '',
        location: '',
        country: ''
      });
    }
  }, [addressToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(address);
    onClose();
  };

  if (!isOpen) return null;

  console.log("Rendering AddressModal content");

  return (
    <div className="address-modal-overlay">
      <div className="address-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{addressToEdit ? 'Edit Address' : 'Add New Address'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Street"
            required
          />
          <input
            type="text"
            name="house"
            value={address.house}
            onChange={handleChange}
            placeholder="House No."
            required
          />
          <input
            type="text"
            name="location"
            value={address.location}
            onChange={handleChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          <input
            type="text"
            name="postcode"
            value={address.postcode}
            onChange={handleChange}
            placeholder="Postcode"
            required
          />
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
          <button type="submit" className="save-btn">
            {addressToEdit ? 'Update Address' : 'Add Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
