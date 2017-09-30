import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GiphyApi from './Services/api';

class App extends Component {

  state = {
    giphs: []
  }
  componentDidMount(){
    GiphyApi.getTrending().then((response) => {
      this.setState({giphs : response.data})
    });
  }

  render() {
    return (
      <Router>
         <div className="container-fluid">
            <div className="starter-template">
              <h4>Search into giphy</h4>
              <SearchInput />
            </div>
            <ResultsContainer giphs={this.state.giphs}/>
          </div>
      </Router>
    );
  }
}

const SearchInput = () => (
  <input type="text" className="form-control search-input" />  
);

const ResultsContainer = (props) => (
  <div className="results-container">
   <Results giphs={props.giphs}/>
  </div>
);

const Results = (props) => (
  <ul className="results-list">
     {props.giphs.map( giph => <li><Giph url={giph.images.fixed_height.url} /></li> )}
  </ul>
);

const Giph = (props) => (
  <img src={props.url} className="rounded" alt="..." />
)


export default App;