import React, { Component } from 'react';
import '../css/Main.css';
import '../css/react-tabs.css';

import axios from 'axios';
import decode from 'jwt-decode';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// children components
import ImageCard from './ImageCard';
import Modal from './Modal';
import Form from './Form';
import EditForm from './EditForm';
import SearchBar from './SearchBar';

class Main extends Component {

  constructor() {
    super();
    this.state = {
      recipes: [],
      categories: [],
      showModal: false,
      showEditForm: false,
      modalInfo: null,
      recipeInfo: null
    }
  }

  componentDidMount() {
    //const userToken = localStorage.getItem('jwtToken').split(' ')[1];
    //console.log(decode(userToken));
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');

    //get all recipes from database
    axios.get('http://localhost:8000/recipes/')
    .then(res => {
      this.setState({recipes: res.data});
    }).catch(err => {
      if(err.response.status === 401) {
        this.props.history.push('/')
      }
    });

    //get all categories from database
    axios.get('http://localhost:8000/categories/')
    .then(res => {
      this.setState({categories: res.data});
    }).catch(err => {
      console.log(err);
    });
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  toggleModal = (info) => {
    this.setState({
      showModal: !this.state.showModal,
      modalInfo: info
    });
  };

  toggleEditForm = (info) => {
    this.setState({
      showEditForm: !this.state.showEditForm,
      recipeInfo: info
    })
  };

  deleteRecipe = () => {
    axios.get('http://localhost:8000/recipes/')
    .then(res => {
      this.setState({recipes: res.data});
    }).catch(err => {
      console.log(err);
    });
  };

  seachRecipe = (value) => {
    axios.get('http://localhost:8000/recipes/', {
      params: {
        search: value
      }
    }).then(res => {
      console.log(res);
      this.setState({recipes: res.data});
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    const categories = this.state.recipes
    .map((recipe) => recipe.category)
    .filter(
        (category,index, self) => index === self.indexOf(category)
    );
    return (
        <main>
          <SearchBar searchRecipe={this.seachRecipe}/>
          <button onClick={this.logout}>Logout</button>
          <Tabs>
            <TabList>
              <Tab>Recipes</Tab>
              <Tab>Add</Tab>
            </TabList>
            <TabPanel>
              {this.state.recipes.length ?
                  <div className="App">
                    {categories.map((category) => {
                      return (
                          <ul key={category} className="img-container">
                            <h2>{category}</h2>
                            {this.state.recipes.filter((recipe) => recipe.category === category)
                            .map((recipe)=> {
                              return (
                                  <li className="img-card" key={recipe._id}>
                                    <ImageCard toggleModal={this.toggleModal} recipe={recipe}/>
                                  </li>
                              );
                            })
                            }
                          </ul>
                      );
                    })}

                    {this.state.showModal &&
                    <Modal modalInfo={this.state.modalInfo}
                           show={this.state.showModal}
                           toggleModal={this.toggleModal}
                           deleteRecipe={this.deleteRecipe}
                           editRecipe={this.toggleEditForm}
                           toggleEditForm={this.toggleEditForm}
                    />
                    }

                    {this.state.showEditForm &&
                    <EditForm show={this.state.showEditForm}
                              toggleEditForm={this.toggleEditForm}
                              recipeInfo={this.state.recipeInfo}
                              showEditForm={this.state.showEditForm}
                    />
                    }
                  </div>
                  :
                  <h3 className="search-empty">There are no recipes found</h3>
              }
            </TabPanel>
            <TabPanel>
              <h2>Add a recipe</h2>
              <Form categories={this.state.categories}/>
            </TabPanel>
          </Tabs>
        </main>
    );
  }
}

export default Main;
