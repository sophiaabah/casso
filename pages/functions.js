function onSubmit() {
  console.log("working with link");
  if (linkInput.includes("spotify")) {
    console.log("its a link from spotify", linkInput);
    const playlistId = linkInput.slice(
      linkInput.lastIndexOf("/") + 1,
      linkInput.indexOf("?")
    );
    localStorage.setItem("playlistId", playlistId);
    return spotifyInit();
  }
  if (linkInput.includes("deezer")) {
    console.log("its a link from deezer", linkInput);
    const playlistId = linkInput.slice(linkInput.lastIndexOf("/") + 1);
    console.log(playlistId);
    return dzRequest(playlistId);
  }
}

function migrateToSpotify() {
  async function findSongId() {
    const searchResult = await fetch(
      "https://api.spotify.com/v1/search?q=Pick%20up%3AAdekunle%20Gold&market=DE&type=track&limit=3", // add market before track when needed
      //url encode the song? wheres the method? it cant be done manually since all songs arent just one word
      // same for artist use the encodeURIComponent method
      {
        headers: {
          Authorization:
            "Bearer BQBfSBstHIbYeEhtJy5QCLB7C11durS3vaZNXWLW755QK3oS8RRETlKyLrJ7iOwHUYwdWIpNkKPnqmSRdTIFlm3fF4ZuIrvcEIRE_qR2cXjMO1c667EJMZjsaLCKHKyWeyRyRQxVCgrmw0CTIOhzCjYvv57vv4Ltj3mdIj1jhSp6eeQ2-4BRsKFAkl9wqAewY__tlg",
          "Content-Type": "application/json",
        },
      }
    );
    const parsedSearchResult = await searchResult.json();
    let songId = parsedSearchResult.tracks.items[0].id;
    // console.log(parsedSearchResult);
    // console.log(songId);
  }
  // findSongId(); // access songid in last function

  async function createPlaylist() {
    const newPlaylistInfo = await fetch(
      `https://api.spotify.com/v1/users/5w8g0c395c8meuyv2vko10cq3/playlists`, //user_id is the param here
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer BQBfSBstHIbYeEhtJy5QCLB7C11durS3vaZNXWLW755QK3oS8RRETlKyLrJ7iOwHUYwdWIpNkKPnqmSRdTIFlm3fF4ZuIrvcEIRE_qR2cXjMO1c667EJMZjsaLCKHKyWeyRyRQxVCgrmw0CTIOhzCjYvv57vv4Ltj3mdIj1jhSp6eeQ2-4BRsKFAkl9wqAewY__tlg",
        },
        body: JSON.stringify({
          name: "Jamsess",
          description: "some text sha", // can i write null here?
        }),
      }
    );
    const parsedPlaylistInfo = await newPlaylistInfo.json();
    const playlist_id = parsedPlaylistInfo.id;
    // console.log("playlist created", parsedPlaylistInfo); // get new playlist id from here
    // console.log("this is it", playlist_id);
  }
  // createPlaylist(); // access playlistid in last function

  async function addTracksToPlaylist() {
    const confirmation = await fetch(
      `https://api.spotify.com/v1/playlists/3x2VADfCEZaUcTu2dJ6G6L/tracks`, //playlist_id is the param here
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        },
        body: JSON.stringify({
          uris: [
            "spotify:track:5BFEc76XGgq7jvfUPZcgtr",
            "spotify:track:6dlqmyMVe5JN8WRPbY6BPJ",
          ],
          position: 0,
        }),
      }
    );
    const parsedConfirmation = await confirmation.json();
    console.log(
      "tracks have been added. heres the playlist snapshot",
      parsedConfirmation
    );
  }
  // addTracksToPlaylist();
}
