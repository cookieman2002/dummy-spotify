import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import tokenContext from "./tokenContext";

function App() {
  const CLIENT_ID = "b85facc3edf64b4dbe90078275075248";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, SetToken] = useState("");
  const [searchKey, SetSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  
  useEffect(() => {

    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

        

      window.location.hash = "";

      window.localStorage.setItem("token", token);
    }
    SetToken(token);
  }, []);

  const logout = () => {
    SetToken("");
    window.location.reload()
    window.localStorage.removeItem("token");
  };
  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: searchKey,
        type: "track",
        market: "US",
      },
    });

    console.log(data.tracks.items);
    setArtists(data.tracks.items);
  };
  const Artistslists = () => {
    return artists.map((artist) => (
      <div key={artist.id} className="song">
        {console.log(artist.artists[0].name)}

        {/* {artist.images.length ? <img src={artist.images[0].url} width={"100px"} alt="" /> : <div>no images</div> } */}
        {artist.album.images.length ? (
          <img
            src={artist.album.images[0].url}
            height="80px"
            width="80px"
            alt=""
          />
        ) : (
          <img src="https://thumbs.dreamstime.com/b/error-message-creative-design-48389035.jpg" alt="" />
        )}
        <div className="names">
          <h1>{artist.name}</h1>
          <span>{artist.artists[0].name}</span>
        </div>
      </div>
    ));
  };

  return (
    
    <tokenContext.Provider value={{token, SetToken}}>

    <div className="App">
      <h1>spotify react</h1>
      {!token ? (
        <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          login to spotify
        </a>
      ) : (
        <button onClick={logout}>Log out</button>
        )}

      {token ? (
        <form onSubmit={searchArtists}>
          <input
            type="text"
            
            onChange={(e) => SetSearchKey(e.target.value)}
            />
          <button type={"submit"}>Search</button>
        </form>
      ) : (
        <h2>Please login</h2>
      )}
      {Artistslists()}
    </div>
        </tokenContext.Provider>
  );
}

export default App;
