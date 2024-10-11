import React, { useState } from 'react';
import '../../Assets/Css/CheckOut/PersonalInfoForm.scss';

const PersonalInfoForm = () => {
  const [title, setTitle] = useState();
  const [shippingDifferent, setShippingDifferent] = useState(false);

  return (
    <div className="personal-info-form ms-5">
      <div className="title-selection">
        <button 
          className={`title-btn ${title === 'Mrs.' ? 'active' : ''}`}
          onClick={() => setTitle('Mrs.')}
        >
          Mr.
        </button>
        <button 
          className={`title-btn ${title === 'Mr.' ? 'active' : ''}`}
          onClick={() => setTitle('Mr.')}
        >
          Mrs.
        </button>
      </div>
      
      <input type="text" placeholder="First name*" className="form-input" />
      <input type="text" placeholder="Last name*" className="form-input" />
      <input type="email" placeholder="E-Mail" className="form-input" />
      
      <div className="address-inputs">
        <input type="text" placeholder="Street*" className="form-input street" />
        <input type="text" placeholder="Houses*" className="form-input houses" />
      </div>
      
      <div className="address-inputs">
        <input type="text" placeholder="PostCode*" className="form-input postcode" />
        <input type="text" placeholder="Location*" className="form-input location" />
      </div>
      
      <select className="form-input">
        <option value="">Select Country</option>
        <option value="India">India</option>
        <option value="Turkey">Turkey</option>
        <option value="USA">USA</option>
        <option value="England">England</option>
        <option value="France">France</option>
        <option value="Germany">Germany</option>
      </select>
      
      <input type="tel" placeholder="Phone Number" className="form-input" />
      
      <p className="required-field-note">*Required field</p>

      <div className="checkbox-container">
        <input 
          type="checkbox" 
          id="createAccount" 
          className="custom-checkbox" 
        />
        <label htmlFor="createAccount">
          Create a customer account now and benefit from many advantages.
        </label>
      </div>
      <p className="info-text">The password will be sent to you by email</p>
      
      <div className="checkbox-container">
        <input 
          type="checkbox" 
          id="shippingDifferent" 
          className="custom-checkbox"
          checked={shippingDifferent}
          onChange={() => setShippingDifferent(!shippingDifferent)}
        />
        <label htmlFor="shippingDifferent">
          Shipping Address is Different
        </label>
      </div>
      
      {shippingDifferent && (
        <div className="shipping-address">
          <input type="text" placeholder="First name*" className="form-input" />
          <input type="text" placeholder="Last name*" className="form-input" />
          <div className="address-inputs">
            <input type="text" placeholder="Street*" className="form-input street" />
            <input type="text" placeholder="Houses*" className="form-input houses" />
          </div>
          <div className="address-inputs">
            <input type="text" placeholder="Post Code*" className="form-input postcode" />
            <input type="text" placeholder="Location*" className="form-input location" />
          </div>
          <select className="form-input">
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="Turkey">Turkey</option>
            <option value="USA">USA</option>
            <option value="England">England</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;