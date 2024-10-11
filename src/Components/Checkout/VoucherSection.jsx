import React, { useState } from 'react';
import '../../Assets/Css/CheckOut/VoucherSection.scss';

const VoucherSection = () => {
  const [voucherCode, setVoucherCode] = useState('');

  const handleVoucherSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle voucher redemption
    console.log('Redeeming voucher:', voucherCode);
  };

  return (
    <div className="voucher-section">
      <p>Do you have a voucher? <span className='optional'>(Optional)</span></p>
      <form onSubmit={handleVoucherSubmit}>
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Enter the code"
        />
        <button type="submit">REDEEM</button>
      </form>
    </div>
  );
};

export default VoucherSection;