import React from 'react';

const ImageCard = (props) =>  {
  return (
      <div className="card">
        <img className="card-img-top" src={props.image.thumbnail} alt="Card" style={{width:'100%'}}/>
        <div className="card-body">
          <h4 className="card-title">{props.image.title}</h4>
          <p className="card-text posted-time">{props.image.time}</p>
          <p className="card-text">{props.image.details}</p>
          <button className="btn btn-primary" onClick={() => props.toggleModal(props.image)}>View recipe</button>
        </div>
      </div>
  );
}

export default ImageCard;

