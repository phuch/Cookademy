import React, { Component } from 'react';
import axios from 'axios';

class Modal extends Component {

  handleDelete = () => {
    const url = '/recipes/' + this.props.modalInfo._id;
    axios.delete(url)
    .then((res) => {
      this.props.toggleModal();
      this.props.deleteRecipe();
    })
    .catch((error) => {console.log(error);});
  };

  handleEdit = () => {
    this.props.toggleModal();
    this.props.toggleEditForm(this.props.modalInfo);
  };

  render() {

    if (!this.props.show) {
      return null
    }
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{this.props.modalInfo.title}</h4>
              <button type="button" className="close" onClick={this.props.toggleModal}>&times;</button>
            </div>
            <div className="modal-body">
              <img className="recipe-img" src={this.props.modalInfo.image} alt="thumb" width="200px"/>
              <h4>Ingredients</h4>
              <ul>
                {this.props.modalInfo.ingredients.map(ingredient => {
                  return (
                    <li key={ingredient.id}>
                      &#9670; {ingredient.quantity} {ingredient.name}
                    </li>
                  )
                })}
              </ul>
              <h4>Instruction</h4>
              <pre>{this.props.modalInfo.instruction}</pre>
            </div>
            {this.props.currentUser._id === this.props.modalInfo.user._id &&
              <div className="modal-footer">
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.handleEdit}
                >
                  Edit
                </button>
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.handleDelete}
                >
                  Delete
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;