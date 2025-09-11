import './App.css'
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className='App'>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Hero />} />
          <Route path="/communaute" element={<Home />} />
          <Route path="/reglages" element={<Home />} />
          <Route path="/accueil" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
