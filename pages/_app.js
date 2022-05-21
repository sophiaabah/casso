import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const colors = {
  myblue: {
    900: "#7DB1E1",
    800: "#8EBAE2",
  },
  myorange: {
    900: "#C67039",
  },
  mygray: {
    900: "#6A6A6A",
  },
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
