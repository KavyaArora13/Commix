import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import JobPosition from '../Components/Career/JobPosition'
import Touch from '../Components/Offer/Touch'
import '../Assets/Css/Career/Career.scss'

const Career = () => {
  return (
    <div>
      <Header/>
      <div className="container-fluid career-container ps-4">
        <div className="row">
          <div className="col-lg-10 col-md-11 col-sm-12">
            <h1 className="page-title">Career</h1>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / Career
            </div>
            
            <div className="special-offer-badge">
              <span role="img" aria-label="Special Offer">🎉</span> Special Offer
            </div>
            
            <h2 className="main-heading">From Catwalk to Sidewartless Elegance.</h2>
            <p className="main-content">
              Nullam sagittis efficitur lectus et placerat. Sed sed elit at diam faucibus faucibus. Suspendisse bibendum, elit in tincidunt maximus, ligula dui iaculis dolor, ut sagittis sem magna nec quam. Aliquam erat volutpat. Quisque ullamcorper lectus ut fermentum ultricies. Nam eget blandit augue, non tincidunt massa.
            </p>

            <div className="job-positions">
              <JobPosition 
                title="Senior Fashion Designer"
                location="California, US"
                type="Full-time"
                income="$30,000 - $35,000"
                deadline="August12, 2024"
              />

              <JobPosition 
                title="Quality Control Inspector"
                location="California, US"
                type="Full-time"
                income="$30,000 - $35,000"
                deadline="August12, 2024"
              />

              <JobPosition 
                title="Sales Associate"
                location="California, US"
                type="Full-time"
                income="$30,000 - $35,000"
                deadline="August12, 2024"
              />
              
              <JobPosition 
                title="Public Relations Specialist"
                location="California, US"
                type="Full-time"
                income="$30,000 - $35,000"
                deadline="August12, 2024"
              />

              <JobPosition 
                title="Brand Manager"
                location="California, US"
                type="Full-time"
                income="$30,000 - $35,000"
                deadline="August12, 2024"
              />
            </div>
          </div>
        </div>
      </div>
      <Touch/>
      <Footer/>
    </div>
  )
}

export default Career