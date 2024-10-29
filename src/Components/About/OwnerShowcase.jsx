import React from 'react';
import '../../Assets/Css/About/OwnerShowcase.scss';

const OwnerShowcase = () => {
  return (
    <section className="owner-showcase">
      <div className="owner-image">
        <img src="/images/maam.png" alt="Owner 1" />
      </div>
      <div className="owner-image">
        <img src="/images/sir.png" alt="Owner 2" />
      </div>
    </section>
  );
};

export default OwnerShowcase;