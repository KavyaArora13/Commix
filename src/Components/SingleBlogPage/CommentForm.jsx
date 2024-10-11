import React from 'react';
import '../../Assets/Css/SingleBlogPage/CommentForm.scss'; // Ensure the styling file is added

const CommentForm = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-8 col-12 comment-form-container my-3">
          <form>
            <div className="form-group">
              <textarea 
                className="form-control comment-input" 
                placeholder="Comment *" 
                required 
              ></textarea>
            </div>
            
            <div className="form-row d-flex justify-content-between mt-4">
              <div className="form-group col-md-6">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Name *" 
                  required 
                />
              </div>
              <div className="form-group col-md-6">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email *" 
                  required 
                />
              </div>
            </div>

            <div className="form-group text-center mt-4">
              <button type="submit" className="btn submit-btn">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
