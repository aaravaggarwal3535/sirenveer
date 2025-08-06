 

import { Outlet, Link } from "react-router-dom";
import "./App.css"

function App() {

  return (
    <div >
      <nav className="space-x-4">
        {/* <Link to="/" className="text-blue-500">Login</Link>
        <Link to="/About" className="text-blue-500">About</Link> */}
        {/* <Link to="/Login" className="text-blue-500">Login</Link> */}

      </nav>
      <Outlet />
    </div>
  );
}

export default App;
