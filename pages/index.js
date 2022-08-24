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
import { useEffect } from "react";
import password from "secure-random-password";
import { useState } from "react";
import PopupWindow, { toQuery } from "../lib/popup";
import { useRouter } from "next/router";

var spotifyOauth = {
  client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
  state: password.randomString({ length: 16 }),
  scope: "playlist-read-collaborative playlist-modify-public",
};

export default function App() {
  const router = useRouter();
  const [linkInput, setLinkInput] = useState("");
  const [platform, setPlatform] = useState();

  async function onSubmit() {
    console.log("working with link");
    if (linkInput.trim()) {
      const access_data = await spotifyLogin();
      localStorage.setItem("session_token", access_data.access_token);

      router.push({
        pathname: "/review",
        query: { pid: linkInput, inputPlatform: platform },
      });
    }
  }

  // async function dzLoad() {
  //   await fetch(
  //     "https://connect.deezer.com/oauth/auth.php?app_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&perms=basic_access,email"
  //   );
  // }

  const spotifyLogin = async () => {
    try {
      const data = await PopupWindow.open(
        "spotify-oauth-auth",
        `https://accounts.spotify.com/authorize?${toQuery({
          client_id: spotifyOauth.client_id,
          response_type: "token",
          redirect_uri: spotifyOauth.redirect_uri,
          scope: spotifyOauth.scope,
        })}`,
        {
          height: 800,
          width: 600,
        }
      );

      return data;
    } catch (e) {
      console.error(e);
    }
  };

  function dzScriptInit() {
    global.DZ.init({
      appId: process.env.NEXT_PUBLIC_DEEZER_APP_ID,
      channelUrl: process.env.NEXT_PUBLIC_DEEZER_CHANNEL_URL,
    });
  }

  function onType(e) {
    setLinkInput(e.target.value);
  }

  return (
    <Container maxW="container.xl">
      <div id="dz-root"></div>
      <Script
        src="https://e-cdn-files.dzcdn.net/js/min/dz.js"
        strategy="afterInteractive"
        onLoad={dzScriptInit}
      ></Script>
      <Stack height="100vh">
        <VStack
          width={{ md: "45%" }}
          spacing={6}
          justify="center"
          pt={{ base: 12, lg: 16 }}
          // pl={{ lg: "8rem" }}
        >
          <Text
            align="center"
            fontFamily="Abril Fatface, cursive"
            fontSize="52px"
            lineHeight="70px"
            letterSpacing="0.1rem"
          >
            The tool for migrating{" "}
            <span style={{ color: "#C67039" }}>playlists</span> easy-peasy.
          </Text>
          <Text align="center" pt={4} color="#635252" fontSize="22px">
            Copy your music directly from one streaming platform to another.
          </Text>
          <Text align="center" color="#635252" fontSize="22px">
            To fetch the songs, we need to know where your playlist is stored
            and a link to the playlist. {`You'd`} get it by navigating to the
            “share” option.{" "}
          </Text>
          <ButtonGroup pt={8} pb={8} spacing={8}>
            <IconButton
              variant="outline"
              colorScheme="blue"
              onClick={() => setPlatform("deezer")}
              borderRadius="full"
              p={9}
              isActive={platform === "deezer"}
              icon={<FaDeezer fontSize={32} />}
            ></IconButton>
            <IconButton
              variant="outline"
              colorScheme="blue"
              onClick={() => setPlatform("spotify")}
              borderRadius="full"
              p={9}
              isActive={platform === "spotify"}
              icon={<FaSpotify fontSize={32} />}
            ></IconButton>
          </ButtonGroup>
          <HStack width="100%" spacing={4}>
            <Input
              onChange={onType}
              focusBorderColor="blue.200"
              height={{ base: 12, lg: 16 }}
              placeholder="Paste your link..."
            ></Input>
            <Button
              isDisabled={!(platform === "spotify" || platform === "deezer")}
              onClick={onSubmit}
              colorScheme="blue"
              p={{ base: "6", lg: 8 }}
            >{`Let's go`}</Button>
          </HStack>
        </VStack>
        <chakra.div display={{ base: "none", md: "none", lg: "block" }}>
          <Image
            alt="taylor swift"
            src="/images/taylor.png"
            width="16%"
            transform="rotate(12deg)"
            position="fixed"
            right="28%"
            bottom="40%"
          ></Image>
          <Image
            alt="ed sheeran"
            src="/images/ed.png"
            transform="rotate(-25deg)"
            position="fixed"
            right={0}
            top={0}
          ></Image>
          <Image
            alt="lennon stella"
            src="/images/stella.png"
            transform="rotate(120deg)"
            position="fixed"
            right={0}
            bottom={0}
          ></Image>
        </chakra.div>
      </Stack>
    </Container>
  );
}
