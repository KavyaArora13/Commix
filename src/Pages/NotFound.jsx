import React from 'react';
import '../Assets/Css/404.scss'; 

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404</h1>
            <p>Page Not Found</p>
            <a href="/">Go Back Home</a>
        </div>
    );
};

export default NotFound;