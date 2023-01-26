import './App.css';
import Header from './components/Header/Header.js';
import Transaction from './components/Transaction/Transaction.js';
import TxHistory from './components/TxHistory/TxHistory';

function App() {
  return (
    <div className="App" >
      <Header />
      <Transaction />
      <TxHistory />

    </div>
  );
}

export default App;
