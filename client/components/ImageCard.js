import React from 'react';
import {Image, CloudinaryContext, Transformation} from 'cloudinary-react';

const ImageCard = (props) =>  {
  return (
      <div className="card">
        <div className="card-header">
          <p className="card-text user-name">{props.recipe.user.name}</p>
          <p className="card-text posted-time">{props.recipe.time}</p>
        </div>
        <CloudinaryContext cloudName="syris">
          <Image className="card-img-top" publicId={props.recipe.imagePublicId}>
            <Transformation gravity="auto" width="770" height="720" crop="thumb"/>
          </Image>
        </CloudinaryContext>
        <div className="card-body">
          <h4 className="card-title">{props.recipe.title}</h4>
          <p className="card-text">{props.recipe.details}</p>
          <button className="btn btn-primary" onClick={() => props.toggleModal(props.recipe)}>View recipe</button>
        </div>
      </div>
  );
}

export default ImageCard;

