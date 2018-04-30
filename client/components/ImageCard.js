import React from 'react';

const ImageCard = (props) =>  {
  return (
      <div className="card">
        <img className="card-img-top" src={props.recipe.thumbnail} alt="Card" style={{width:'100%'}}/>
        <div className="card-body">
          <h4 className="card-title">{props.recipe.title}</h4>
          <p className="card-text posted-time">{props.recipe.time}</p>
          <p className="card-text">{props.recipe.details}</p>
          <button className="btn btn-primary" onClick={() => props.toggleModal(props.recipe)}>View recipe</button>
        </div>
      </div>
  );
}

export default ImageCard;

