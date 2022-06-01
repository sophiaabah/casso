function dzLogin() {
  return new Promise(function (resolve, reject) {
    global.DZ.login(
      function (response) {
        resolve(response.authResponse.accessToken);
      },
      { perms: "basic_access,email,manage_library" }
    );
  });
}

export async function migrateToDz(tracksArr, title) {
  const accessToken = await dzLogin();
  const songsArr = [];
  for (let track of tracksArr) {
    const title = track.title;
    const artist = track.artist;

    const dzSongId = await getSongIdsDz(artist, title);

    songsArr.push(dzSongId);
  }
  console.log(songsArr.join());
  const playlistId = await newPlaylistDz(title);
  const response = await addSongsDz(playlistId, songsArr.join());
  console.log("the id:", playlistId);
  console.log("added?", response);
}

function getSongIdsDz(artist, track) {
  return new Promise(function (resolve, reject) {
    global.DZ.api(
      `search?q=artist:"${artist}" track:"${track}"`,
      function (response) {
        resolve(response.data[0].id);
      }
    );
  });
}

function newPlaylistDz(title) {
  return new Promise(function (resolve, reject) {
    global.DZ.api(
      "user/me/playlists",
      "POST",
      { title: title },
      function (response) {
        console.log("My new playlist ID", response.id);
        resolve(response.id);
      }
    );
  });
}

async function addSongsDz(id, songs) {
  return new Promise(function (resolve, reject) {
    DZ.api(
      `playlist/${id}/tracks`,
      "POST",
      { songs: songs }, // here songs.join(",")
      function (response) {
        console.log("added?", response);
        resolve(response);
      }
    );
  });
}
