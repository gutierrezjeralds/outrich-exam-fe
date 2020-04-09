import React from 'react'
import ReactDOM from 'react-dom'
// import App from './App.js'
import Main from './components/Main'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import './components/assets/sass/screen.scss'
import * as serviceWorker from './serviceWorker'

ReactDOM.render( <Main />, document.getElementById('root') );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
