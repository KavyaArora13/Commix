import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import JobPosition from '../Components/Career/JobPosition';
import Touch from '../Components/Touch';
import '../Assets/Css/Career/Career.scss';
import axios from 'axios';
import { API_URL } from '../config/api';
import { FaExclamationTriangle } from 'react-icons/fa';

const Career = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const response = await axios.get(`${API_URL}/careers/all`);
        setJobPositions(response.data); // Assuming the response data is an array of job positions
      } catch (err) {
        setError('Failed to fetch job positions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPositions();
  }, []);

  return (
    <div>
      <Header />
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
              {loading ? (
                <p>Loading job positions...</p>
              ) : error ? (
                <p>{error}</p>
              ) : jobPositions.length > 0 ? (
                jobPositions.map((job, index) => (
                  <JobPosition 
                    key={index}
                    title={job.name}
                    location={job.location}
                    type={job.job_type}
                    income={job.income}
                    deadline={new Date(job.deadline).toLocaleDateString()} // Format the date
                  />
                ))
              ) : (
                <div className="no-job-positions">
                  <FaExclamationTriangle className="no-job-icon" />
                  <p className='font-bold'>No job positions available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Touch />
      <Footer />
    </div>
  );
}

export default Career;