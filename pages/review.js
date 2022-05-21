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
  Heading,
  VStack,
  Grid,
  GridItem,
  ButtonGroup,
  IconButton,
  Stack,
  chakra,
  Container,
} from "@chakra-ui/react";
import Head from "next/head";
import { BsThreeDots } from "react-icons/bs";
import SongList from "./components/songlist";

export default function App() {
  return (
    <Container maxW="container.lg" pt={{ md: 12 }}>
      <Stack
        direction={{ base: "column", md: "row" }}
        p={{ base: 5, md: 4 }}
        pt={{ md: 16 }}
        spacing={{ base: 12, md: 20 }}
      >
        <Stack flex={1} spacing={6} direction="column" align="left">
          <chakra.div>
            <Image
              width="100%"
              alt="playlist cover"
              src="/images/playlist_cover.jpg"
            ></Image>
          </chakra.div>

          <Stack direction="column" align="left">
            <VStack spacing={1} align="left">
              <Text fontWeight="300" color="mygray.900" fontSize="24">
                Playlist Review
              </Text>
              <Text fontWeight="500" fontSize="36">{`Angie's Rock`}</Text>
              <Text fontWeight="400" fontSize="17">
                By Sandra
              </Text>
              <Text fontWeight="300" fontSize="15">
                2hrs
              </Text>
            </VStack>
          </Stack>
          <Stack w="100%" direction="row" spacing={4}>
            <Button w="100%" colorScheme="blue">
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
          {Array.from({ length: 5 }).map((item, index) => {
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
                      alt="song cover"
                      src="/images/song_cover.jpg"
                    ></Image>
                  </chakra.div>
                  <Stack spacing={0}>
                    <Text fontWeight={600} fontSize="16">
                      Purple Honey
                    </Text>
                    <Text color="mygray.900" fontWeight={400} fontSize="15">
                      Strawberry Milk Cult
                    </Text>
                  </Stack>
                </Stack>
                <Stack align="center" direction="row">
                  <Text fontWeight={400} fontSize="15">
                    3:11
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
  );
}
