import React, { Component } from 'react';
import axios from 'axios';
import MdModeEdit from 'react-icons/lib/md/mode-edit';
import MdClear from 'react-icons/lib/md/clear';
import MdCheck from 'react-icons/lib/md/check';
import UniqueId from 'react-html-id';

class Form extends Component {
  constructor(props) {
    super(props);
    UniqueId.enableUniqueIds(this);
    this.state = {
      file: '',
      ingredients: [],
      requiredImg: true,
      isIngredientEditing: null
    }
  }

  componentDidMount(){
    if (this.props.showEditForm) {
      const ingredients = Object.assign([], this.props.recipeInfo.ingredients);
      this.setState({
        ingredients: ingredients,
        requiredImg: false
      });
    }
  }

  toggleIngredientEdit = (id) => {
    this.setState({
      isIngredientEditing: id
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('ingredients', JSON.stringify(this.state.ingredients));
    console.log(JSON.stringify(this.state.ingredients));
    formData.append('user', this.props.currentUser._id);

    this.uploadImageToCloudinary(this.state.file)
      .then((res) => {
        // When uploading image succeeded, upload data to server, inlcuding
        // the image url and image public id from Cloudinary
        formData.append('imageUrl', res.data.url);
        formData.append('imagePublicId', res.data.public_id);
        formData.append('secureImageUrl', res.data.secure_url);
        this.addRecipe(formData);
      });
  };

  handleEditRecipe = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('ingredients', JSON.stringify(this.state.ingredients));

    if (this.state.file) {
      this.uploadImageToCloudinary(this.state.file)
          .then((res) => {
            // When uploading image succeeded, upload data to server, inlcuding
            // the image url and image public id from Cloudinary
            formData.append('imageUrl', res.data.url);
            formData.append('imagePublicId', res.data.public_id);
            formData.append('secureImageUrl', res.data.secure_url);
            this.updateRecipe(formData);
          })
    } else {
      this.updateRecipe(formData);
    }
  };

  uploadImageToCloudinary = (file) => {
    // Since Heroku cannot handle large file uploading (>4MB) and some issues,
    // we try to upload the image to Cloudinary first
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("upload_preset", "wfvppycb");
    cloudinaryFormData.append("file", this.state.file);

    return axios({
      method: 'post',
      url: 'https://api.cloudinary.com/v1_1/syris/image/upload',
      data: cloudinaryFormData,
      transformRequest: [(data, headers) => {
        // This must be done, otherwise cannot upload image to Cloudinary
        delete headers.common.Authorization
        return data
      }],
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .catch((error) => {
      this.props.showToast("Fail to upload image", "error");
    });
  }

  addRecipe = (formData) => {
    axios({
      method: 'post',
      url: '/recipes',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then((res) => {
      this.props.showToast("Recipe added", "success");
      this.refreshForm();
      this.props.updateRecipes();
    })
    .catch((error) => {
      this.props.showToast("Fail to add recipe", "error");
    });
  }

  updateRecipe = (formData) => {
    const url = '/recipes/' + this.props.recipeInfo._id;
    axios({
      method: 'put',
      url: url,
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then((res) => {
      this.props.showToast("Recipe saved", "success");
      this.props.updateRecipes();
      this.props.toggleEditForm();
    })
    .catch((error) => {
      this.props.showToast("Fail to save recipe", "error");
    });
  }

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

  addIngredient = () => {
    const newIngredient = {
      id: Date.now(),
      name: this.ingredient.value,
      quantity: this.quantity.value
    }
    this.setState({
      ingredients: [...this.state.ingredients, newIngredient]
    });

    this.ingredient.value = '';
    this.quantity.value = '';
  }

  editIngredient = (index) => {
    const ingredients = Object.assign([], this.state.ingredients);
    const ingredient = Object.assign({}, ingredients[index]);

    ingredient.name = this.editedIngredient.value;
    ingredient.quantity = this.editedQuantity.value;

    ingredients[index] = ingredient;

    this.setState({
      ingredients: ingredients,
      isIngredientEditing: null
    })

  }

  deleteIngredient = (index) => {
    const ingredients = Object.assign([], this.state.ingredients);
    ingredients.splice(index,1);
    this.setState({
      ingredients: ingredients
    });
  }

  refreshForm = () => {
    document.getElementById("form").reset();
    if (!this.props.showEditForm) {
      this.setState({
        ingredients: []
      });
    }
  }

  renderIngredientList = (ingredient, index) => {
    if(this.state.isIngredientEditing === ingredient.id) {
      return (
        <li key={ingredient.id}>
          &#9670;
          <input type="text"
                 required
                 placeholder="Ingredient"
                 defaultValue={ingredient.name}
                 ref={input => this.editedIngredient = input}/>
          <input style={{width:'100px'}}
                 type="text"
                 required
                 placeholder="Quantity"
                 defaultValue={ingredient.quantity}
                 ref={input => this.editedQuantity = input}/>
          <button type="button"
                  className="inline-btn"
                  onClick={() => this.editIngredient(index)}>
            <MdCheck color="#5CB3FD"/>
          </button>
          <button type="button"
                  className="inline-btn"
                  onClick={() => this.setState({isIngredientEditing: null})}
          >
            <MdClear color="#5CB3FD"/>
          </button>
        </li>
      );
    } else {
      return (
        <li key={ingredient.id}>
          &#9670; {ingredient.quantity} {ingredient.name} |
          <button type="button" className="inline-btn" onClick={() => this.toggleIngredientEdit(ingredient.id)}>
            <MdModeEdit color="#5CB3FD"/>
          </button>
          <button type="button" className="inline-btn" onClick={() => this.deleteIngredient(index)}>
            <MdClear color="#5CB3FD"/>
          </button>
        </li>
      );
    }
  }

  render() {
    const {ingredients, requiredImg} = this.state
    return (
      <form id="form" className="img-form"
            onSubmit={!this.props.showEditForm ? (e) => this.handleSubmit(e): (e) => this.handleEditRecipe(e)}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select ref={select => this.category = select}
                  className="select-box"
                  name="category"
                  defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.category}` : ''}>
            {this.props.categories.map((category) => {
              return (
                  <option key={category._id}
                          value={category.name}>
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

        <div className="form-group ingredient-form">
          <label htmlFor="desc">Ingredient</label>
          <input type="text"
                 placeholder="Ingredient"
                 ref={input => this.ingredient = input}/>
          <input style={{width:'100px'}}
                 type="text"
                 placeholder="Quantity"
                 ref={input => this.quantity = input}/>
          <button type="button" className="btn btn-primary" onClick={this.addIngredient}>Add</button>
        </div>

        <div className="added-ingredients">
          <ul>
            {
              ingredients.map((ingredient, index) => {
                return this.renderIngredientList(ingredient, index);
              })
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="instruction">Instruction</label>
          <textarea className="form-control instruction"
                    required
                    id="instruction"
                    name="instruction"
                    defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.instruction}`: ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">{this.props.showEditForm ? `Change image` : `Image`}</label>
          <input type="file"
                 required={requiredImg}
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

