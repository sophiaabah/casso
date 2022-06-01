import { useEffect, useState } from "react";

var dzOauth = {
  app_id: process.env.NEXT_PUBLIC_DEEZER_APP_ID,
  redirect_uri: process.env.NEXT_PUBLIC_DEEZER_REDIRECT_URI,
  secret: process.env.NEXT_PUBLIC_SECRET,
};

export default function App() {
  const [playlist, setPlaylist] = useState({});

  useEffect(() => {
    console.log("working on dz oauth");
    setPlaylist(JSON.parse(localStorage.getItem("songs")));
    const pageUrl = window.location.href;
    const accessToken = pageUrl.slice(
      pageUrl.indexOf("token=") + 6,
      pageUrl.indexOf("&expires")
    );
    console.log(accessToken);
    localStorage.setItem("dz_token", accessToken);
    // searchForTracks();
  }, []);

  async function searchForTracks() {
    const accessToken = localStorage.getItem("dz_token");
    const response = await fetch(
      `https://api.deezer.com/search?q=artist:"aloe blacc" track:"i need a dollar"`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const parsedResponse = await response.json();
    console.log(parsedResponse);
  }

  return <div>Loading...</div>;
}
