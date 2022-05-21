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

export default function App() {
  return (
    <Container maxW="container.xl">
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
              borderRadius="full"
              p={9}
              icon={<FaDeezer fontSize={32} />}
            ></IconButton>
            <IconButton
              borderRadius="full"
              p={9}
              icon={<FaSpotify fontSize={32} />}
            ></IconButton>
          </ButtonGroup>
          <HStack width="100%" spacing={4}>
            <Input
              focusBorderColor="blue.200"
              height={{ base: 12, lg: 16 }}
              placeholder="Paste your link..."
            ></Input>
            <Button
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
