import React, { Component } from 'react';
import '../css/Main.css';
import '../css/react-tabs.css';

import axios from 'axios';
import decode from 'jwt-decode';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Notifications, {notify} from 'react-notify-toast';

// children components
import ImageCard from './ImageCard';
import Modal from './Modal';
import Form from './Form';
import EditForm from './EditForm';
import SearchBar from './SearchBar';
import NavBar from './NavBar'

class Main extends Component {

  constructor() {
    super();
    const  USER_TOKEN = localStorage.getItem('jwtToken').split(' ')[1];
    this.state = {
      recipes: [],
      categories: [],
      currentUser: decode(USER_TOKEN),
      showModal: false,
      showEditForm: false,
      isSearching: false,
      modalInfo: null,
      recipeInfo: null
    }
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');

    //get all recipes from database
    axios.get('/recipes')
    .then(res => {
      this.setState({recipes: res.data});
    }).catch(err => {
      if(err.response.status === 401) {
        this.props.history.push('/')
      }
    });

    //get all categories from database
    axios.get('/categories')
    .then(res => {
      this.setState({categories: res.data});
    }).catch(err => {
      console.log(err);
    });
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

  updateRecipes = () => {
    axios.get('/recipes')
    .then(res => {
      this.setState({recipes: res.data});
    }).catch(err => {
      console.log(err);
    });
  };

  seachRecipe = (value) => {
    axios.get('/recipes', {
      params: {
        search: value
      }
    }).then(res => {
      this.setState({recipes: res.data, isSearching: true});
      if (!value) {
        this.setState({isSearching: false});
      }
    }).catch(err => {
      console.log(err);
    });
  };

  showToast = (message, type) => {
    notify.show(message, type, 2000)
  }

  handleLogout = () => {
    localStorage.removeItem('jwtToken');
    this.props.history.push('/');
    window.location.reload();
  }

  render() {
    const {recipes, categories, currentUser, showModal, showEditForm, isSearching, modalInfo, recipeInfo} = this.state;
    const displayedCategories = this.state.recipes
    .map((recipe) => recipe.category)
    .filter(
        (category,index, self) => index === self.indexOf(category)
    );

    const searchText = recipes.length == 1 ? `result found` : `results found`;

    return (
        <main>
          <Notifications />
          <NavBar currentUser={currentUser} handleLogout={this.handleLogout}/>
          <SearchBar searchRecipe={this.seachRecipe}/>

          <Tabs>
            <TabList>
              <Tab>Recipes</Tab>
              <Tab>Add</Tab>
            </TabList>
            <TabPanel>
              {recipes.length ?
                  <div className="App">
                    {isSearching &&
                      <h4 className="search-empty">{recipes.length} {searchText}</h4>}
                    {displayedCategories.map((category) => {
                      return (
                          <ul key={category} className="img-container">
                            <h2>{category}</h2>
                            {recipes.filter((recipe) => recipe.category === category)
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

                    {showModal &&
                    <Modal modalInfo={modalInfo}
                           show={showModal}
                           currentUser={currentUser}
                           toggleModal={this.toggleModal}
                           updateRecipes={this.updateRecipes}
                           editRecipe={this.toggleEditForm}
                           toggleEditForm={this.toggleEditForm}
                    />
                    }

                    {showEditForm &&
                    <EditForm show={showEditForm}
                              toggleEditForm={this.toggleEditForm}
                              recipeInfo={recipeInfo}
                              showEditForm={showEditForm}
                              categories={categories}
                              updateRecipes={this.updateRecipes}
                              showToast={this.showToast}
                    />
                    }
                  </div>
                  :
                  <h3 className="search-empty">There are no recipes found</h3>
              }
            </TabPanel>
            <TabPanel>
              <h2>Add a recipe</h2>
              <Form categories={categories}
                    currentUser={currentUser}
                    updateRecipes={this.updateRecipes}
                    showToast={this.showToast}/>
            </TabPanel>
          </Tabs>
        </main>
    );
  }
}

export default Main;
