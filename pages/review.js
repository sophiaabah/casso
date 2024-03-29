import {
  Box,
  Flex,
  Image,
  Wrap,
  WrapItem,
  Center,
  Spacer,
  Input,
  HStack,
  Button,
  useToast,
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
import Script from "next/dist/client/script";
import { useEffect, useState } from "react";
import password from "secure-random-password";
import { BsThreeDots } from "react-icons/bs";
import { migrateToDz } from "../lib/toDeezer";
import { addTracksToPlaylist, dzPlaylistRequest } from "../lib/toSpotify";
import { useRouter } from "next/router";
import { intervalToDuration } from "date-fns";

const uriArr = [];

export default function App() {
  const router = useRouter();
  const toast = useToast();

  const [platform, setPlatform] = useState("");
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [playlist, setPlaylist] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    console.log("query object", router.query.pid);
    if (router.query.inputPlatform === "deezer") {
      exportFromDz(router.query.pid)
        .then(() => {
          setError();
          setPlatform("spotify");
        })
        .catch((error) => {
          console.error(error);

          if (error.type && error.type === "OAuthException") {
            setError("Your playlist is private, please use a public playlist.");
            return;
          }

          setError(error.message);
        });
      setPlatform("spotify");
    } else if (router.query.inputPlatform === "spotify") {
      exportFromSpotify(router.query.pid)
        .then(() => {
          setError();
          setPlatform("deezer");
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }
  }, [router]);

  function dzScriptInit() {
    global.DZ.init({
      appId: process.env.NEXT_PUBLIC_DEEZER_APP_ID,
      channelUrl: process.env.NEXT_PUBLIC_DEEZER_CHANNEL_URL,
    });
    console.log("sdk load successful", process.env.NEXT_PUBLIC_DEEZER_APP_ID); //ive got some sdk issues here. why php
  }

  function onExport() {
    if (platform === "spotify") {
      migrateToSpotify(playlist.title, uriArr)
        .then(() => {
          toast({
            title: "Migration successful.",
            description: "We've created your playlist for you.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          toast({
            title: "Error.",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.log("the error", error.message);
        });
    } else if (platform === "deezer") {
      migrateToDz(playlist.tracks, playlist.title)
        .then(
          toast({
            title: "Migration successful.",
            description: "We've created your playlist for you.",
            status: "success",
            duration: 7000,
            isClosable: true,
          })
        )
        .catch((error) => {
          toast({
            title: "Error.",
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          }); //also invalid url. check the format for localhost setting
        }); //confirmation toast shows before user has a chance to authorize cassos access.
    }
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
        duration: intervalToDuration({ start: 0, end: track.duration * 1000 }), //track.duration
        picture: track.album.cover_small,
        album: track.album.title,
      })),
    };

    setPlaylist(playlistData);
    console.log("mine:", playlistData);

    const tracksArr = playlistData.tracks;
    console.log("mine:", tracksArr);
    const listOfIds = [];
    const accessToken = localStorage.getItem("session_token");

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

  async function exportFromSpotify(id) {
    const accessToken = localStorage.getItem("session_token");
    const resource = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const parsedResource = await resource.json();

    console.log(parsedResource);

    const playlistData = {
      owner: parsedResource.owner.display_name,
      title: parsedResource.name,
      picture: parsedResource.images[0].url,
      tracks: parsedResource.tracks.items.map((song) => ({
        title: song.track.name,
        artist: song.track.artists[0].name,
        duration: song.track.duration_ms,
        picture: song.track.album.images[2].url,
      })),
    };
    setPlaylist(playlistData);
    setSongsLoaded(true);
    console.log("mine:", playlistData);

    const tracksArr = playlistData.tracks;
    console.log("mine:", tracksArr);
  }

  async function migrateToSpotify(playlistTitle, uriArr) {
    const accessToken = localStorage.getItem("session_token");

    let userInfo = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("token", accessToken);
    let parsedUserInfo = await userInfo.json();
    if (parsedUserInfo.error) {
      throw Error("User authentication for Spotify failed");
    }
    console.log(parsedUserInfo.id);

    const newPlaylistInfo = await fetch(
      `https://api.spotify.com/v1/users/${parsedUserInfo.id}/playlists`, //user_id is the param here
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: playlistTitle,
          description: "Created with help from Casso", // can i write null here?
        }),
      }
    );
    const parsedPlaylistInfo = await newPlaylistInfo.json();
    const playlistId = parsedPlaylistInfo.id;
    console.log("playlist created", parsedPlaylistInfo); // get new playlist id from here
    console.log("this is it", playlistId);
    addTracksToPlaylist(playlistId, accessToken, uriArr);
  }

  return (
    <Container maxW="container.lg" pt={{ md: 12 }}>
      <div id="dz-root"></div>
      <Script
        src="https://e-cdn-files.dzcdn.net/js/min/dz.js"
        strategy="beforeInteractive"
        onLoad={dzScriptInit}
      ></Script>
      {songsLoaded ? (
        <Stack
          alignItems={{ md: "stretch" }}
          direction={{ base: "column", md: "row" }}
          p={{ base: 5, md: 4 }}
          pt={{ md: 16 }}
          spacing={{ base: 12, md: 20 }}
        >
          <Stack
            top={28}
            position={{ base: "none", md: "sticky" }}
            height="100%"
            flex={1}
            spacing={6}
            direction="column"
            align="left"
          >
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
              </VStack>
            </Stack>
            <Stack w="100%" direction="row" spacing={4}>
              <Button w="100%" colorScheme="blue" onClick={onExport}>
                Export
              </Button>
              <Button
                onClick={() => router.push("/")}
                w="100%"
                colorScheme="blue"
                variant="outline"
              >
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
                    {/* <Text fontWeight={400} fontSize="15">
                      {`${item.duration}`}
                    </Text> */}
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
      ) : !!error ? (
        <Stack spacing={4}>
          <Heading>Something went wrong.</Heading>
          <Text>{error}</Text>
        </Stack>
      ) : (
        <div>Loading playlist...</div>
      )}
    </Container>
  );
}
