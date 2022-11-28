import { Component, createRef, PureComponent } from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput
  }
  from 'mdb-react-ui-kit';
import Image from '../Assets/The News Website.png'
import './index.css'
import Styles from './snackbar.module.css'
import { Button } from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom";


const Axios = axios.create({
  baseURL: `http://localhost:5000`
})


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: true,
            passwd: '',
            user: '',
            email:'',
            passKey: false,
        }
        this.snackbarRef = createRef();
    }

    componentDidMount() {
      sessionStorage.clear()
    }

    _showSnackbarHandler = (message) => {
      this.snackbarRef.current.openSnackBar(message);
    }

    onSignIn = async (e) => {
      e.preventDefault();
      const body = {
        user:this.state.user, 
        passwd:this.state.passwd,
        email:this.state.email
      };
      // console.log(body);
      // const response = await axios({
      //   method: "post",
      //   url: 'http://localhost:4100/login',
      //   data: JSON.stringify(body),
      //   // json: true,
      // })
      const response = await Axios.post('/login', body, { 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      this.props.setToken(response.data);
      // console.log(response.data.token);
      if(!response.data.token) {
        this._showSnackbarHandler(response.data.error)
      }

      this.setState({
        user:'',
        passwd:'',
        email:'',
        passKey:response.data.token
      })
    }
    
    onSignUp = async (e) => {
      e.preventDefault();
      const body = {
        user:this.state.user, 
        passwd:this.state.passwd,
        email:this.state.email
      };
      console.log(body);
      // const response = await axios({
      //   method: "post",
      //   url: 'http://localhost:4100/login',
      //   data: JSON.stringify(body),
      //   // json: true,
      // })
      const response = await Axios.post('/signup', body, { 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log('response ',response.data.error.toString());
      // this.props.setToken(response.data);
      if(response.data.error) {
        this._showSnackbarHandler(response.data.error.toString())
      }
      this.setState({
        isLogin:response.data.error ? false : true,
        email:'',
        user:'',
        passwd:''
      })
    }

    onChange = (e) => {
      // console.log(e.currentTarget.name);
      e.currentTarget.name === 'email' ? 
        this.setState({
          email:e.currentTarget.value
      }) :
        e.currentTarget.name === 'user' ? 
        this.setState({
          user:e.currentTarget.value
        }) :
          this.setState({
            passwd:e.currentTarget.value
          })
    }

    onPress = () => {
      console.log("HI");
      this.setState({
        isLogin:!this.state.isLogin,
        user:'',
        passwd:'',
        email:''
      })
    }
    
    // handleClose = () => {
    //   this.setState({
    //       open:true
    //   })
    // }
    
    render() {
        if(this.state.passKey) {
          return <Navigate replace to='/' />
        }
        else if(this.state.isLogin) {
          return (
              <div >
                <Snackbar ref = {this.snackbarRef} />

                <SignIn onChange={this.onChange} onPress={this.onPress} onSignIn={this.onSignIn} />
              </div>
          )
        }
        else {
          return (
            <div>
              <Snackbar ref = {this.snackbarRef} />

              <SignUp onChange={this.onChange} onPress={this.onPress} onSignUp={this.onSignUp} />
            </div>
          )
        }
    }
}
const SignIn = ({ onChange, onSignIn, onPress }) => {
  return (
    <MDBContainer className="my-5 gradient-form">
  
    <MDBRow>

      <MDBCol col='6' className="mb-5">
        <div className="d-flex flex-column ms-5">

          <div className="text-center">
            <img src={Image}
              style={{width: '185px'}} alt="logo" />
            <h4 className="mt-1 mb-5 pb-1">News Website</h4>
          </div>

          <form onSubmit={onSignIn}>
              <div className="d-flex justify-content-center">
                <p>Please login to your account</p>
              </div>
              <div className="d-flex justify-content-center">
                <MDBInput wrapperClass='mb-4 w-75' label='Email address' name="email" autoFocus onChange={onChange} required type='email'/>
              </div>
              <div className="d-flex justify-content-center">
                <MDBInput wrapperClass='mb-4 w-75' label='User Name' name="user" onChange={onChange} required type='text'/>
              </div>
              <div className="d-flex justify-content-center">
                <MDBInput wrapperClass='mb-4 w-75' label='Password' name="passwd" onChange={onChange} required type='password'/>
              </div>
              <div className="text-center pt-1 mb-5 pb-1">
              {/* <MDBBtn className="mb-4 w-100 gradient-custom-2" type="submit">Sign in</MDBBtn> */}
                <Button className="mb-4 w-25 gradient-custom-2" type='submit'>Sign in </Button>
                <br/>
                <a className="text-muted" href="#!">Forgot password?</a>
              </div>
          </form>

          

          <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
            <pre className="mb-0">Don't have an account?  </pre>
            <Button className='mb-4 w-25 gradient-custom-2' color='danger' onClick={onPress}>
              Sign Up
            </Button>
          </div>

        </div>

      </MDBCol>

      <MDBCol col='6' className="mb-5">
        <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">

          <div className="text-white px-3 py-4 p-md-5 mx-md-4">
            <h4 className="mb-4">Login to our website</h4>
            <p className="small mb-0"></p>
          </div>

        </div>

      </MDBCol>

    </MDBRow>

  </MDBContainer>
  )
}
const SignUp = ({ onChange, onSignUp, onPress}) => {
    return (
      <MDBContainer className="my-5 gradient-form">
    
      <MDBRow>
  
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
  
            <div className="text-center">
              <img src={Image}
                style={{width: '185px'}} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">News Website</h4>
            </div>
  
            <form onSubmit={onSignUp}>
                <div className="d-flex justify-content-center">
                  <p>Register for an account</p>
                </div>
                <div className="d-flex justify-content-center">
                  <MDBInput wrapperClass='mb-4 w-75' label='Email address' name="email" autoFocus onChange={onChange} required type='email'/>
                </div>
                <div className="d-flex justify-content-center">
                <MDBInput wrapperClass='mb-4 w-75' label='User Name' name="user" onChange={onChange} required type='text'/>
              </div>
                <div className="d-flex justify-content-center">
                  <MDBInput wrapperClass='mb-4 w-75' label='Password' name="passwd" onChange={onChange} required type='password'/>
                </div>
                <div className="text-center pt-1 mb-5 pb-1">
                {/* <MDBBtn className="mb-4 w-100 gradient-custom-2" type="submit">Sign in</MDBBtn> */}
                  <Button className="mb-4 w-25 gradient-custom-2" type='submit'>Sign Up</Button>
                  {/* <br/> */}
                  {/* <a className="text-muted" href="#!">Forgot password?</a> */}
                </div>
            </form>
  
            
  
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <pre className="mb-0">Have an account?  </pre>
              <br/>
              <Button className='mb-4 w-25 gradient-custom-2' color='danger' onClick={onPress}>
                Sign In
              </Button>
            </div>
  
          </div>
  
        </MDBCol>
  
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
  
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Sign up to our website</h4>
              <p className="small mb-0"></p>
            </div>
  
          </div>
  
        </MDBCol>
  
      </MDBRow>
  
    </MDBContainer>
    )
}

class Snackbar extends PureComponent {
  message = ''

  state = {
    isActive: false,
  }

  openSnackBar = (message = 'Something went wrong...') => {
    this.message = message;
    this.setState({ isActive: true }, () => {
      setTimeout(() => {
        this.setState({ isActive: false });
      }, 3000);
    });
  }

  render() {
    const { isActive } = this.state;
    return (
      <div className = {isActive ? [Styles.snackbar, Styles.show].join(" ") : Styles.snackbar}>
        {this.message}
      </div>
    )
  }
}