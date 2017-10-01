import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GiphyApi from './Services/api';
import {DebounceInput} from 'react-debounce-input';


class App extends Component {

  state = {
    giphs: [],
    pagination: {
      count: 0,
      offset: 0,
      total_count: 0
    }
  }

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);   
  }

  componentDidMount(){
    GiphyApi.getTrending().then((response) => {
      this.setState({giphs : response.data, pagination: response.pagination})
    });
  }

  handleSearch(e){
    let q = e.target.value;
    this.search(q);
  }

  search(q){
    let offset = this.state.pagination.offset;
    GiphyApi.searchGifs(q, offset).then((response) => {
      this.setState({giphs : response.data, pagination: response.pagination})
    });
  }

  render() {
    return (
      <Router>
         <div className="container-fluid">
            <div className="starter-template">
              <h4>Search into giphy</h4>
              <SearchInput onKeyUp={this.handleSearch}/>
            </div>
            <ResultsContainer giphs={this.state.giphs} pagination={this.state.pagination} />
          </div>
      </Router>
    );
  }
}

const SearchInput = (props) => (
  <DebounceInput className="form-control search-input" onChange={props.onKeyUp} debounceTimeout={300} />
);

const ResultsContainer = (props) => {
  let content = <Results giphs={props.giphs} />;

  if(props.giphs.length == 0){
    content = <Giph className="center" url="https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif" />;    
  }

  return(
    <div className="results-container">
      <Pager pagination={props.pagination} />
      {content}
    </div>
  )
};

const Results = (props) => (
  <ul className="results-list">
     {props.giphs.map( (giph) => {
       
       if(!giph.images.preview_gif){
         console.warn('giph broken ', giph);
         return;
       }

       return(
          <li key={giph.id} ><Giph url={giph.images.preview_gif.url} key={giph.id} /></li>
        )
       }
     )}
  </ul>
);

const Giph = (props) => {
  const c = props.className || '';  
  return (
    <img src={props.url} className={`rounded ${c}`} alt="..." />
  )
}
const Pager = (props) => {
  console.log(props.pagination);

  return (
    <div></div>
  );
}

export default App;