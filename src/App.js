import Header from "./components/header";
import BetsUsers from "./components/betsUsers";
import Main from "./components/Main/main";
// import "./App.scss";

function App() {
  return (
    <div className="main-container">
      <Header />
      <div className="game-container">
        <BetsUsers />
        <Main />
      </div>
    </div>
  );
}

export default App;
