import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
// import fetch from 'node-fetch';
import Loading from "../Assets/Eclipse-1s-200px.gif";
import NotImage from "../Assets/images.jpeg";
import { LazyLoadImage } from "react-lazy-load-image-component";


import { Component } from 'react'
import { Modal } from 'react-bootstrap';
// import { Modal } from 'react-bootstrap';


export class Newsitem extends Component {

  constructor() 
  {
    super();
    this.state = { 
      time: 0,
      open : false,
    }
  }

  componentDidMount() {
    setInterval(() => {
      if(this.state.time <= 5) {
        this.setState({
          time: this.state.time + 1
        }) 
      }
    }, 1000)
  }
  
  openModal = () => {
    this.setState({
     open:true
    })
  }

  closeModal = () => {
    this.setState({
      open:false
    })
  }
  
  render() {
    let {title, url_image, description, url, content } = this.props;
    // console.log(title);
    return (
          <>
            <Card className = 'card' onClick={this.openModal}>
              {/* <Card.Img variant="top" src= {url_image} alt = 'Image Not Available' height = '250px'/> */}
              <LazyLoadImage src = {url_image} width = '350px' height = '250px' alt='Image Not Available' 
                        placeholderSrc={ this.state.time <= 5 ? Loading : NotImage } />
              <Card.Body>
                    <Card.Title >{title ? title.slice(0,60) + "..." : ""}</Card.Title>
                    <Card.Text >
                      {description ? description.slice(0,80)+"...":""}
                    </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item >{content ? content.slice(0,140) + "..." : ""}</ListGroup.Item>
                <ListGroup.Item><Button variant="primary" href = {url} target = "_blank">Read Full News</Button></ListGroup.Item>
              </ListGroup>
            </Card>
            <Modal
              show={this.state.open}
              onHide={this.closeModal}
              keyboard={true} 
              size='lg'
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title ? title : ""}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                      <ListGroup>
                        <ListGroup.Item>Description: {description ? description : ""}</ListGroup.Item>
                        <ListGroup.Item>Content: {content ? content : ""}</ListGroup.Item>
                      </ListGroup>
                {/* <h4>Centered Modal</h4> */}
                {/* <p>
                  Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                  dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                  consectetur ac, vestibulum at eros.
                </p> */}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" href = {url} target = "_blank">Read Full News</Button>
                <Button onClick={this.closeModal}>Close</Button>
              </Modal.Footer>
            </Modal>
         </>
        );    

  }
}

export default Newsitem;
