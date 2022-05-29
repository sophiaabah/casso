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
