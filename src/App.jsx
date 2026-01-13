import { useContext, useState } from "react";

import { Link } from "react-router-dom";
import Signin from "./components/Signin";
import Home from "./pages/clinetPages/Home"
import { UserAuth } from "./context/AuthContext";

function App() {
  const { user } = UserAuth();

  console.log(user);

  return (
    <>
      <Home />
    </>
  );
}

export default App;