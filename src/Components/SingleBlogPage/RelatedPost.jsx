import React from 'react'
import '../../Assets/Css/SingleBlogPage/RelatedPost.scss'

const RelatedPost = ({imageSrc , title}) => {
  return (
    <div className='col-lg-3 col-md-4 col-12 related-post-card mt-5'>
        <div className="card h-100">
            <img src={imageSrc} alt="Related Post" className="card-img-top1 related-post-img1 "/>
            <div className="card-body">
                <p className="related-post-title">{title}</p>
            </div>
        </div>
    </div>
  )
}

export default RelatedPost;
