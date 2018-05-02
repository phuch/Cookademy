import React, { Component } from 'react';
import axios from 'axios';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
    }
  }

  handleSubmit = (e) => {
    console.log('handle uploading');
    const formData = new FormData(e.target);
    formData.append('file', this.state.file);

    axios({
      method: 'post',
      url: '/recipes',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then((res) => {console.log(res);})
    .catch((error) => {console.log(error);});
  };

  handleEdit = (e) => {
    console.log('start editing');
    const formData = new FormData(e.target);
    formData.append('file', this.state.file);

    const url = '/recipes/' + this.props.recipeInfo._id;
    axios({
      method: 'put',
      url: url,
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then((res) => {console.log(res);})
    .catch((error) => {console.log(error);});
  };


  handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
      });
    };
    reader.readAsDataURL(file);
  };

  render() {
    return (
        <form className="img-form" onSubmit={!this.props.showEditForm ? (e) => this.handleSubmit(e): (e) => this.handleEdit(e)}>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select ref={select => this.category = select}
                    className="select-box"
                    name="category"
                    defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.category}` : ''}>
              {this.props.categories.map((category) => {
                return (
                    <option key={category._id}
                            value={category.name}
                            selected={this.props.showEditForm &&
                                (this.props.recipeInfo.category == category.name) ? 'selected' : undefined}
                    >
                      {category.name}
                    </option>
                )
              })}
            </select>
          </div>



          <div className="form-group">
            <label htmlFor="title">Dish's name</label>
            <input type="text"
                   required
                   className="form-control"
                   id="title"
                   placeholder="Enter the name of the dish"
                   name="title"
                   defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.title}`: ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desc">Description</label>
            <textarea className="form-control"
                      required
                      id="desc"
                      name="details"
                      defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.details}`: ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">{this.props.showEditForm ? `Change image` : `Image`}</label>
            <input type="file"
                   onChange={(e) => this.handleImageChange(e)}
                   className="form-control"
                   ref={(input) => this.input = input}
                   id="image"
            />
          </div>
          <button type="submit" className="btn btn-primary submit-btn">{this.props.showEditForm ? `Save` : `Submit`}</button>
        </form>

    );
  }
}

export default Form;

