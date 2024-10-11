import React from 'react';
import '../../Assets/Css/Career/JobPosition.scss';

const JobPosition = ({ title, location, type, income, deadline }) => {
  return (
    <div className="job-position">
      <div className="job-info">
        <h3 className="job-title">{title}</h3>
        <div className="job-details">
          <span data-label="Location:">
            {location}
          </span>
          <span data-label="Type:">
            {type}
          </span>
          <span data-label="Income:">
            {income}
          </span>
          <span data-label="Deadline:">
            {deadline}
          </span>
        </div>
      </div>
      <button className="view-details">VIEW DETAILS</button>
    </div>
  );
};

export default JobPosition;