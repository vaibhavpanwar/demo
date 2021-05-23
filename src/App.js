import "./App.css";
import { useState, useEffect } from "react";
import API from "./api";
import { setAuthHeader } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [showCatItems, setShowCartItem] = useState(false);

  //fetch cart items (protected route)
  const fetchItems = async () => {
    try {
      const res = await API.get("/order-summary/");
      console.log(res, "res list item");
      setCartItems(res.data.cart_products);
    } catch (error) {
      const msg = error.response ? error.response.data : error.message;
      console.log(msg, "lol error agaya", error);
      setCartItems([]);
    }
  };

  //login user and set access token as header
  const login = async () => {
    setLoading(true);
    try {
      const res = await API.post("/dj-rest-auth/login/", {
        email: "vaibhavpanwar1402@gmail.com",
        password: "testtest12345",
      });

      localStorage.setItem("refreshToken", res.data.refresh_token);
      setLoading(false);

      setAuthHeader(res.data.access_token);
      setUser(res.data.user);
      console.log(res, "res aya login la");
    } catch (error) {
      const msg = error.response ? error.response.data : error.message;
      console.log(msg);
      setLoading(false);
    }
  };

  //func to maintain user session on refresh
  const auth = async () => {
    setLoading(true);
    const res = await API.get("/dj-rest-auth/user/");
    if (res) {
      console.log("user auto login", res);
      setUser(res.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!!refreshToken) {
      auth();
    }
  }, []);

  return (
    <div className="App">
      {loading && <p>Loading ....</p>}
      {!user && (
        <>
          {" "}
          <button onClick={login}> login</button>
        </>
      )}

      {user && (
        <>
          {" "}
          <h1>{user?.name}</h1> <br />{" "}
          <button onClick={fetchItems}> fetch cart item</button>{" "}
        </>
      )}

      {cartItems?.length > 0 && (
        <>
          <button onClick={() => setShowCartItem(!showCatItems)}>
            Show Cart Items{" "}
          </button>
          {showCatItems && (
            <div>
              {cartItems.map((i) => (
                <h1>{i?.id}</h1>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
