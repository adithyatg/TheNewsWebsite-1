import {Component, } from "react";
import Newsitem from "./Newsitem";
import { Badge, Button, Spinner } from "react-bootstrap";
import axios from 'axios';
import PropTypes from 'prop-types'

const Axios = axios.create({
    baseURL: `http://localhost:5000`
  })

class NewsContainer extends Component
{
    static defaultProps = {
        country : 'in',
        category : 'general',
        type: 'head'
    }

    static propTypes = {
        country : PropTypes.string,
        category : PropTypes.string,
        type: PropTypes.string
    }

    constructor()
    {
        super()
        this.state = {
            isLoaded : false,
            items: [],
            page: 1,
            totalPages: 1,
            country:'in'
        }
    }

    apiCall = async (value) => {
        this.setState({
            isLoaded: false
        })
        // let url = `https://newsapi.org/v2/top-headlines?category=${this.props.category}&country=${this.props.country}&apiKey=${this.state.apiKey1}&page=${this.state.page + value}&pageSize=20`;
        // let body  = await axios.get(url);
        // console.log(body);
        const body = await Axios.get(`/${this.props.type}`, { params : { country: this.props.country, category: this.props.category, page: this.state.page + value }})
        // console.log(this.props.head);
        return body;
    }

    async componentDidMount()
    {
        let body = await this.apiCall(0);
        this.setState({
            isLoaded: true,
            items:body?.data?.articles,
            totalPages: Math.ceil(body?.data?.totalResults / 20)
        })  
        // console.log(body);
        // console.log(body);
    }

    prevPage = async () => {
        let body = await this.apiCall(-1);
        this.setState({
            page:this.state.page - 1,
            isLoaded: true,
            items:body.data.articles,
        }) 
        // console.log(body.data.articles);
    }

    nextPage = async () => {
        let body = await this.apiCall(+1);
        this.setState({
            page:this.state.page + 1,
            isLoaded: true,
            items:body.data.articles,
        })
        // console.log(body.data.articles);
    }

    render()
    {
        return(
            <div className="container pt-5">
                <h1>
                    <Badge className='m-3' bg="success">Top Headlines</Badge>   
                    <Badge bg="danger">{this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)}</Badge>
                </h1>
                <br/>
                <div className="row d-flex justify-content-around wrapper">
                {this.state.isLoaded ? this.state.items.map((ele) => {
                        return (
                            <div className="col-md-4" key = {ele.url} style = {{ paddingBottom: '40px'}}>
                                <Newsitem 
                                    url = {ele.url}
                                    title = {ele.title}
                                    url_image = {ele.urlToImage}
                                    description = {ele.description}
                                    content = {ele.content}
                                /> 
                            </div>
                        )
                    }) : <div className="d-flex justify-content-around">
                            <Button variant="primary" disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    />
                                Loading...
                            </Button>
                    </div>
                    }
                </div>
                <div className = 'd-flex justify-content-around '>
                    <Button disabled = {this.state.page <= 1} variant="dark" onClick={this.prevPage}>&larr; Previous</Button> 
                    <Button disabled = {this.state.page >= this.state.totalPages } variant="dark" onClick={this.nextPage}>Next &rarr;</Button> 
                </div>
            </div>
        )
    }
}

export default NewsContainer