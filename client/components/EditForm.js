import React, { Component } from 'react';
import Form from './Form';

class EditForm extends Component {

  render() {

    if (!this.props.show) {
      return null
    }
    return (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit recipe</h4>
                <button type="button" className="close" onClick={this.props.toggleEditForm}>&times;</button>
              </div>
              <div className="modal-body">
                <Form
                    categories={this.props.categories}
                    recipeInfo={this.props.recipeInfo}
                    showEditForm={this.props.showEditForm}
                    showToast={this.props.showToast}
                    updateRecipes={this.props.updateRecipes}
                    toggleEditForm={this.props.toggleEditForm}/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default EditForm;