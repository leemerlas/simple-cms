import './App.css';
import './rich-editor.css'
import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className='container'>
        <Switch>
          <Route exact path="/" >
            <Home />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
