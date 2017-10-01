import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GiphyApi from './Services/api';
import {DebounceInput} from 'react-debounce-input';


class App extends Component {

  state = {
    giphs: [],
    search: undefined,
    pagination: {
      count: 25,
      offset: 0,
      total_count: 0
    }
  }

  constructor(props) {
    super(props);
    this.handleSearch          = this.handleSearch.bind(this);   
    this.handleNextNavigation  = this.handleNextNavigation.bind(this);   
    this.handlePrevNavigation  = this.handlePrevNavigation.bind(this);   
  }

  componentDidMount(){
   this.showTrending(0);
  }

  showTrending(offset){
    GiphyApi.getTrending(offset).then((response) => {
      this.setState({giphs : response.data, pagination: response.pagination})
    });
  }

  handleSearch(e){
    let q = e.target.value;
    this.setState({search:q});
    this.search(q, 0);
  }

  search(q, offset){
    GiphyApi.searchGifs(q, offset).then((response) => {
      this.setState({giphs : response.data, pagination: response.pagination})
    });
  }

  handleNextNavigation(e){
    console.log('next', this.state.pagination)

    const newOffset = this.state.pagination.offset + this.state.pagination.count;
    if(this.state.search === undefined){
      this.showTrending(newOffset);
      return;
    }
    this.search(this.state.search, newOffset)
  }

  handlePrevNavigation(e){
    console.log('prev', this.state.pagination)

    if(this.state.pagination.offset <= 0){
      return;
    }

    const newOffset = this.state.pagination.offset - this.state.pagination.count;
    if(this.state.search === undefined){
      this.showTrending(newOffset);
      return;
    }
    this.search(this.state.search, newOffset)
  }

  render() {
    return (
      <Router>
         <div className="container-fluid">
            <div className="starter-template">
              <SearchInput onKeyUp={this.handleSearch}/>
              <a href="#" onClick={this.handlePrevNavigation}>Prev</a>--
              <a href="#" onClick={this.handleNextNavigation}>Next</a>
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


export default App;