import {
  Box,
  Flex,
  Image,
  Center,
  Spacer,
  Input,
  HStack,
  Button,
  Text,
  Stack,
  Heading,
  VStack,
  Grid,
  GridItem,
  ButtonGroup,
  IconButton,
  Container,
  chakra,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaSpotify } from "react-icons/fa";
import { FaDeezer } from "react-icons/fa";
import Script from "next/dist/client/script";
import { useEffect, useState } from "react";
import password from "secure-random-password";
import { useRouter } from "next/router";
import { BsThreeDots } from "react-icons/bs";

function dzRequest(id) {
  return new Promise(function (resolve, reject) {
    global.DZ.api(`/playlist/${id}`, function (response) {
      resolve(response);
    });
  });
}

const uriArr = [];

export default function App() {
  const [platform, setPlatform] = useState(true);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [playlist, setPlaylist] = useState({});
  const [newPlaylistId, setNewPlaylistId] = useState("");

  useEffect(() => {
    const pageUrl = window.location.href;
    const accessToken = pageUrl.slice(
      pageUrl.indexOf("token=") + 6,
      pageUrl.indexOf("&token_type")
    );

    localStorage.setItem("token", accessToken);
    console.log("this is the access token", accessToken);
  }, []);

  function dzScriptInit() {
    global.DZ.init({
      appId: process.env.NEXT_PUBLIC_DEEZER_APP_ID,
      channelUrl: process.env.NEXT_PUBLIC_DEEZER_CHANNEL_URL,
    });
    console.log("sdk load successful");

    if (platform) {
      const playlistId = localStorage.getItem("playlistId");
      exportFromDz(playlistId);
    } else {
      // the function to fetch from spotify and start export to deezer
    }
  }

  async function getPlaylistFromSpotify() {
    const resource = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const parsedResource = await resource.json();
    console.log(parsedResource);
  }

  async function exportFromDz(id) {
    console.log("running deezer request");
    const songData = await dzRequest(id);
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

  async function migrateToSpotify() {
    const accessToken = localStorage.getItem("token");

    let userInfo = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    let parsedUserInfo = await userInfo.json();
    console.log(parsedUserInfo.id);

    async function createPlaylist() {
      const newPlaylistInfo = await fetch(
        `https://api.spotify.com/v1/users/${parsedUserInfo.id}/playlists`, //user_id is the param here
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: playlist.title,
            description: "Created with help from Casso", // can i write null here?
          }),
        }
      );
      const parsedPlaylistInfo = await newPlaylistInfo.json();
      const playlistId = parsedPlaylistInfo.id;
      console.log("playlist created", parsedPlaylistInfo); // get new playlist id from here
      console.log("this is it", playlistId);
      addTracksToPlaylist(playlistId);
    }
    createPlaylist();

    async function addTracksToPlaylist(playlistId) {
      const confirmation = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, //playlist_id is the param here
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            uris: uriArr,
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
  }

  return songsLoaded ? (
    <Container maxW="container.lg" pt={{ md: 12 }}>
      <div id="dz-root"></div>
      <Script
        src="https://e-cdn-files.dzcdn.net/js/min/dz.js"
        strategy="afterInteractive"
        onLoad={dzScriptInit}
      ></Script>
      <Stack
        direction={{ base: "column", md: "row" }}
        p={{ base: 5, md: 4 }}
        pt={{ md: 16 }}
        spacing={{ base: 12, md: 20 }}
      >
        <Stack flex={1} spacing={6} direction="column" align="left">
          <chakra.div>
            <Image
              borderRadius={4}
              width="100%"
              alt="playlist cover"
              src={playlist.picture}
            ></Image>
          </chakra.div>

          <Stack direction="column" align="left">
            <VStack spacing={1} align="left">
              <Text fontWeight="300" color="mygray.900" fontSize="24">
                Playlist Review
              </Text>
              <Text fontWeight="500" fontSize="36">
                {playlist.title}
              </Text>
              <Text fontWeight="400" fontSize="17">
                {`By ${playlist.owner}`}
              </Text>
              <Text fontWeight="300" fontSize="15">
                {`${playlist.duration}mins`}
              </Text>
            </VStack>
          </Stack>
          <Stack w="100%" direction="row" spacing={4}>
            <Button w="100%" colorScheme="blue" onClick={migrateToSpotify}>
              Export
            </Button>
            <Button w="100%" colorScheme="blue" variant="outline">
              Cancel
            </Button>
          </Stack>
        </Stack>

        <Stack
          flex={2}
          w="100%"
          // p={{ base: "0rem", lg: "1rem" }}
          spacing={5}
          // justify={{ base: "center" }}
          // align={{ base: "center", md: "left" }}
        >
          {playlist.tracks.map((item, index) => {
            return (
              <Stack
                w="100%"
                direction="row"
                align="center"
                key={index}
                spacing={6}
                justify="space-between"
              >
                <Stack direction="row" spacing={3} align="center">
                  <chakra.div>
                    <Image
                      borderRadius={4}
                      alt="song cover"
                      src={item.picture}
                    ></Image>
                  </chakra.div>
                  <Stack spacing={0}>
                    <Text fontWeight={600} fontSize="16">
                      {item.title}
                    </Text>
                    <Text color="mygray.900" fontWeight={400} fontSize="15">
                      {item.artist}
                    </Text>
                  </Stack>
                </Stack>
                <Stack align="center" direction="row">
                  <Text fontWeight={400} fontSize="15">
                    {item.duration}
                  </Text>
                  <IconButton
                    variant="ghost"
                    fontSize="sm"
                    icon={<BsThreeDots />}
                  />
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  ) : (
    <Container maxW="container.lg" pt={{ md: 12 }}>
      <div id="dz-root"></div>
      <Script
        src="https://e-cdn-files.dzcdn.net/js/min/dz.js"
        strategy="afterInteractive"
        onLoad={dzScriptInit}
      ></Script>
      <div>Nothing here yet</div>
    </Container>
  );
}

//  what do i do about the variables i need to grab within another scope?
