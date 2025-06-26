import App from "next/app";
import "../styles/global.scss";

// Import FontAwesome in a safer way
if (typeof window !== 'undefined') {
  require("@fortawesome/fontawesome-free/js/fontawesome.min");
  require("@fortawesome/fontawesome-free/js/solid.min");
}

export default App;
