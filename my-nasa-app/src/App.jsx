import React from 'react';
import './styles/App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';

function App() {
  return (
    <div className="App">
      <Header />
      <Main /> {/*project and about sections */}
      <Footer />
    </div>
  );
}

export default App;
