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
            src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
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
            <Text>Level: 2</Text>
            <Text>Phone Number: 1234567890</Text>
          </Stack>
        </Flex>
      </Box>
    </Container>
  );
};

export default Simple;
