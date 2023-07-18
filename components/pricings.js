import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  HStack,
  chakra,
} from "@chakra-ui/react";

const Simple = () => {
  return (
    <Container maxW={"7xl"}>
      <Box
        bg="white"
        py="3"
        px={8}
        boxShadow="md"
        borderRadius="md"
        width="full"
      >
        <Flex
          direction="column"
          align="center"
          // justify="center"
          minHeight="100vh"
        >
          <Image
            src="pfp.png"
            alt="Student Image"
            boxSize="200px"
            borderRadius="full"
            mb={4}
          />
          <Stack spacing={4} w="full">
            <HStack w="full" fontWeight="bold">
              <chakra.span>Name:</chakra.span>{" "}
              <chakra.div
                py={3}
                px={5}
                borderRadius="2xl"
                borderWidth="2px"
                w="full"
              >
                {" "}
                John Doe
              </chakra.div>
            </HStack>
            <Text>Age: 20</Text>
            <Text>Sex: Male</Text>
            <Text>Matric Number: ABC123</Text>
            <Text>Phone Number: 1234567890</Text>
          </Stack>
        </Flex>
      </Box>
    </Container>
  );
};

export default Simple;
