export function dzPlaylistRequest(id) {
  return new Promise(function (resolve, reject) {
    console.log("playlist request", global.DZ);
    global.DZ.api(`/playlist/${id}`, function (response) {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
}

async function exportFromDz(id) {
  console.log("running deezer request");
  const songData = await dzPlaylistRequest(id);
  console.log("songData:", songData);
  const playlistData = {
    owner: songData.creator.name,
    duration: songData.duration,
    title: songData.title,
    picture: songData.picture_big,
    tracks: songData.tracks.data.map((track) => ({
      title: track.title,
      artist: track.artist.name,
      duration: track.duration,
      picture: track.album.cover_small,
      album: track.album.title,
    })),
  };
  setPlaylist(playlistData);
  console.log("mine:", playlistData);

  const tracksArr = playlistData.tracks;
  console.log("mine:", tracksArr);
  const listOfIds = [];
  const accessToken = localStorage.getItem("token");

  for (let i = 0; i < tracksArr.length; i++) {
    let searchResult = await fetch(
      `https://api.spotify.com/v1/search?q=track:${tracksArr[i].title}+artist:${tracksArr[i].artist}&type=track&limit=2`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    let parsedSearchResult = await searchResult.json();
    if (parsedSearchResult.error) {
      throw Error("This playlist contains song(s) that couldn't be found");
    }
    listOfIds.push(parsedSearchResult.tracks);
  }
  console.log("this is the list of ids", listOfIds);
  // initialize load:
  setSongsLoaded(true);
  for (let i = 0; i < listOfIds.length; i++) {
    uriArr.push(listOfIds[i].items[0].uri);
  }
  console.log("uriArr", uriArr);
}

export async function addTracksToPlaylist(playlistId, token, uriArr) {
  const confirmation = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, //playlist_id is the param here
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uris: uriArr,
        position: 0,
      }),
    }
  );
  const parsedConfirmation = await confirmation.json();
  if (parsedConfirmation.error) {
    throw Error("Migration failed.");
  }
  console.log(
    "tracks have been added. heres the playlist snapshot",
    parsedConfirmation
  );
}
