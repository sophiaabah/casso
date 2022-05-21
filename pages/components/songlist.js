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
} from "@chakra-ui/react";
import Head from "next/head";
import { BsThreeDots } from "react-icons/bs";

export default function SongList() {
  return (
    <>
      <HStack spacing={6}>
        {/* <div> */}
        <Image alt="song cover" src="/images/song_cover.jpg"></Image>
        {/* </div> */}

        <VStack spacing={1} align="left">
          <Text fontWeight={600} fontSize="16">
            Purple Honey
          </Text>
          <Text color="mygray.900" fontWeight={400} fontSize="15">
            Strawberry Milk Cult
          </Text>
        </VStack>
        <Text fontWeight={400} fontSize="15">
          3:11
        </Text>
        <IconButton
          marginLeft="auto !important"
          variant="ghost"
          fontSize="20px"
          icon={<BsThreeDots />}
        />
      </HStack>
      {/* <HStack spacing={6}>
        <Image alt="song cover" src="/images/song_cover.jpg"></Image>
        <VStack pr={80} spacing={1} align="left">
          <Text fontWeight={600} fontSize="16">
            Purple Honey
          </Text>
          <Text color="mygray.900" fontWeight={400} fontSize="15">
            Strawberry Milk Cult
          </Text>
        </VStack>
        <Text fontWeight={400} fontSize="15">
          3:11
        </Text>
        <IconButton variant="ghost" fontSize="20px" icon={<BsThreeDots />} />
      </HStack>
      <HStack spacing={6}>
        <Image alt="song cover" src="/images/song_cover.jpg"></Image>
        <VStack pr={80} spacing={1} align="left">
          <Text fontWeight={600} fontSize="16">
            Purple Honey
          </Text>
          <Text color="mygray.900" fontWeight={400} fontSize="15">
            Strawberry Milk Cult
          </Text>
        </VStack>
        <Text fontWeight={400} fontSize="15">
          3:11
        </Text>
        <IconButton variant="ghost" fontSize="20px" icon={<BsThreeDots />} />
      </HStack>
      <HStack spacing={6}>
        <Image alt="song cover" src="/images/song_cover.jpg"></Image>
        <VStack pr={80} spacing={1} align="left">
          <Text fontWeight={600} fontSize="16">
            Purple Honey
          </Text>
          <Text color="mygray.900" fontWeight={400} fontSize="15">
            Strawberry Milk Cult
          </Text>
        </VStack>
        <Text fontWeight={400} fontSize="15">
          3:11
        </Text>
        <IconButton variant="ghost" fontSize="20px" icon={<BsThreeDots />} />
      </HStack>
      <HStack spacing={6}>
        <Image alt="song cover" src="/images/song_cover.jpg"></Image>
        <VStack pr={80} spacing={1} align="left">
          <Text fontWeight={600} fontSize="16">
            Purple Honey
          </Text>
          <Text color="mygray.900" fontWeight={400} fontSize="15">
            Strawberry Milk Cult
          </Text>
        </VStack>
        <Text fontWeight={400} fontSize="15">
          3:11
        </Text>
        <IconButton variant="ghost" fontSize="20px" icon={<BsThreeDots />} />
      </HStack>
      <HStack spacing={6}>
        <Image alt="song cover" src="/images/song_cover.jpg"></Image>
        <VStack pr={80} spacing={1} align="left">
          <Text fontWeight={600} fontSize="16">
            Purple Honey
          </Text>
          <Text color="mygray.900" fontWeight={400} fontSize="15">
            Strawberry Milk Cult
          </Text>
        </VStack>
        <Text fontWeight={400} fontSize="15">
          3:11
        </Text>
        <IconButton variant="ghost" fontSize="20px" icon={<BsThreeDots />} />
      </HStack> */}
    </>
  );
}
