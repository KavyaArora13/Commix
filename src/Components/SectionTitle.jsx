import React from 'react'
import '../Assets/Css/SectionTitle.scss'


const SectionTitle = ({title}) => {
  return (
    <div className='section-title-component text-canter mt-5'>
        <div className='d-flex justify-content-center align-items-center'>
            <img src="/images/bloomLeft.png" alt="Decorative Left Broom" className="decorative-broom"/>
            <h2 className="section-title-text mx-3">{title}</h2>
            <img src="/images/bloomRight.png" alt="Decorative Right Broom" className="decorative-broom"/>
        </div>
    </div>
  )
}

export default SectionTitle;
