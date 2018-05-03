import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import IoAndroidExit from 'react-icons/lib/io/android-exit';
import FaBook from 'react-icons/lib/fa/book';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">Cookademy</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Hello {this.props.currentUser.name}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <FaBook color="#5CB3FD"/>
                      &nbsp;
                      Your recipes
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.props.handleLogout}>
                      <IoAndroidExit color="#5CB3FD"/>
                      &nbsp;
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
    );
  }
}

export default NavBar;
