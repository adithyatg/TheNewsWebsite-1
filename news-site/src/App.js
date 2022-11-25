import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import StyledLink from './style';
import NewsContainer from './Components/NewsContainer';
import Home from './Components/Home';
import NavBar from './Components/Navbar';
import {Component} from 'react';
// import Login from '../server/login';
// import SideBar from './Components/Sidebar'
import { setToken, getToken } from './Login/useToken.js'
import Login from './Login/login';

export class App extends Component {
  constructor() {
    super();
      this.state = {
          token:getToken()
      }
  }
  handle = userToken => {
    setToken(userToken);
    this.setState({
      token:getToken()
    })
  }

  logOut = () => {
    sessionStorage.clear()
    this.setState({
      token:false
    })
  }

  render() {
    if(!this.state.token) {
      return <Login setToken = {this.handle}/>
    }
    return (
      <Router>
              <NavBar logOut = {this.logOut} />
              {/* <div style={{marginTop:'40px'}}>

              <SideBar/>
              </div> */}
        {/* <StyledLink to='/'>Home</StyledLink>
        <StyledLink to='/Comp'>Component</StyledLink> */}
              <Routes>
                    <Route exact path = '/login' element = {<Login setToken = {this.handle}/>} />
                    <Route exact path = '/' element = {<Home/>} />
                    <Route exact path = '/head' element = {<NewsContainer/>} />
                    <Route exact path = '/head/business' element = {<NewsContainer key = 'business' country = 'in' category = 'business' />} />
                    <Route exact path = '/head/tech' element = {<NewsContainer key = 'tech' country = 'in' category = 'technology' />} />
                    <Route exact path = '/head/entertainment' element = {<NewsContainer key = 'entertainment' country = 'in' category = 'entertainment' />} />
                    <Route exact path = '/head/sports' element = {<NewsContainer key = 'sports' country = 'in' category = 'sports' />} />
                    <Route exact path = '/head/health' element = {<NewsContainer key = 'health' country = 'in' category = 'health' />} />
                    <Route exact path = '/head/sci' element = {<NewsContainer key = 'sci' country = 'in' category = 'science' />} />
              </Routes> 
      </Router>
    )
      
  }
}

export default App

