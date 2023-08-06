import React from "react";
import {
  Box,
  FormControl,
  Flex,
  Button,
  FormLabel,
  InputRightElement,
  InputGroup,
  Input,
  Text,
  Spinner,
  useToast,
  Heading,
  VStack,
  chakra,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const submitHandler = async ({ matricno, password }) => {
    try {
      console.log(matricno);
      let matri = matricno.replace(/\//g, "");
      const response = await axios.get(`./api/User/${matri}`);
      console.log(":sdcnjbsdhcbj", response);
      if (response) {
        const data = await response.data;
        if (data.password !== password) {
          toast({
            title: `Wrong Password`,
            description: "",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
        console.log(response);
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (result.error) {
          toast({
            title: `${result.error}`,
            description: "",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Signed In Successfully",
            description: "",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }

        router.push("/dashboard");
      } else {
        toast({
          title: "Sorry, you are not Registered",
          description: "",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex
      w="full"
      h="100vh"
      alignItems="center"
      bgImage="url(/bg.jpg)"
      bgPos="center"
      bgSize="cover !important"
      bgBlendMode="overlay"
      bgColor="#1d1e1f  "
      direction="column"
      py="10"
    >
      <Heading color="white" fontSize="2xl" textAlign="center">
        Fountain University Postrgraduate
      </Heading>
      <Flex
        pt="8%"
        flexDirection="column"
        gap="10"
        alignItems={{ md: "center" }}
        w="full"
      >
        <VStack w="full">
          <Heading fontSize="xl" color="white">
            LOGIN
          </Heading>
          <form
            onSubmit={handleSubmit(submitHandler)}
            style={{ width: "inherit" }}
          >
            <Flex
              flexDirection="column"
              gap="10"
              alignItems={{ md: "center" }}
              w="full"
            >
              <Box w={{ sm: "full", md: "50%" }}>
                <FormControl>
                  <FormLabel htmlFor="matricno" color="white">
                    User Id
                  </FormLabel>
                  <Input
                    id="matricno"
                    type="text"
                    placeholder="Enter your Matric no"
                    color="white"
                    {...register("matricno", {
                      required: "Please enter your Matric no",
                      minLength: {
                        value: 10,
                        message: "Matric no should be more than 10 chars",
                      },
                    })}
                    autoFocus
                  />
                  {errors.matricno && (
                    <Text color="red.500" py="1">
                      {errors.matricno.message}
                    </Text>
                  )}
                </FormControl>
              </Box>
              <Box w={{ sm: "full", md: "50%" }}>
                <FormControl>
                  <FormLabel htmlFor="password" color="white">
                    Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      type={show ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      color="white"
                      {...register("password", {
                        required: "Please enter password",
                        minLength: {
                          value: 6,
                          message: "password is more than 5 chars",
                        },
                      })}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500" py="1">
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>
              </Box>
              <Button
                type="submit"
                w={{ sm: "full", md: "50%" }}
                bg="#4ed879"
                _hover={{ bg: "gray", color: "black" }}
                color="white"
              >
                <Text>
                  {isSubmitting ? <Spinner size="sm" color="white" /> : "Login"}
                </Text>
              </Button>
            </Flex>
          </form>
        </VStack>
        <Flex justifyContent="space-between" w={{ sm: "full", md: "50%" }}>
          <Flex>
            <Text color="white">Not yet registered? &nbsp; </Text>
            <Link href="/register">
              <Text color="#4ed879" fontWeight="semibold">
                Register
              </Text>
            </Link>
          </Flex>
          <Flex>
            <Link href="/register">
              <Text color="#4ed879" fontWeight="semibold">
                Forgot password?
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
