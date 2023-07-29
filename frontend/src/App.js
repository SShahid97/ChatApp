import React from 'react';
import {Route} from "react-router-dom";
import "./App.css"
import Loader from './components/Miscellaneous/Loader';
// import Home from "../src/Pages/Home";
// import Chat from "../src/Pages/Chat";
const Home = React.lazy(() => import('../src/Pages/Home'));
const Chat = React.lazy(() => import('../src/Pages/Chat'));


function App() {
  return (
    <React.Suspense fallback={<Loader/>}>
      <div className='App' >
        <Route path="/" component={ Home} exact/>
        <Route path="/chats" component={Chat}/>
      </div>
    </React.Suspense>
    
  );
}

export default App;
