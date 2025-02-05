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
  useToast,
  Heading,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn } from "next-auth/react";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setisLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const submitHandler = async ({ matricno, password }) => {
    try {
      setisLoading(true);
      let matri = matricno.replace(/\//g, "");
      const message = "password";
      const config = {
        headers: {
          "X-Message": message,
        },
      };
      const response = await axios.get(`/api/User/${matri}`, config);
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
          setisLoading(false);
          return;
        }
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
        setisLoading(false);
      }
    } catch (error) {
      toast({
        title: `${error.response.data.msg ?? " Error"}`,
        description: "",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setisLoading(false);
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
        pt="20"
        flexDirection="column"
        gap="10"
        alignItems={{ md: "center" }}
        w="full"
      >
        <VStack w="full" py={{ base: "10px" }}>
          <Heading fontSize="xl" color="white">
            LOGIN PAGE
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
              px={{ base: "10" }}
            >
              <Box w={{ sm: "full", md: "70%", lg: "50%" }}>
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
              <Box w={{ sm: "full", md: "70%", lg: "50%" }}>
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
                w={{ sm: "full", md: "70%", lg: "50%" }}
                bg="#4ed879"
                _hover={{ bg: "gray", color: "black" }}
                color="white"
                isLoading={isLoading}
              >
                <Text>Login</Text>
              </Button>
            </Flex>
          </form>
        </VStack>
        <Flex
          justifyContent="space-between"
          w={{ sm: "full", md: "70%", lg: "50%" }}
          px={{ base: "10", md: "5" }}
          alignItems={{ md: "center" }}
          direction={{ base: "column", sm: "row", md: "row" }}
        >
          <Flex w={{ base: "full", md: "fit-content" }}>
            <Text
              color="white"
              fontSize={{ base: "12px", md: "16px", lg: "18px" }}
            >
              Not yet registered? &nbsp;{" "}
            </Text>
            <Link href="/register">
              <Text
                color="#4ed879"
                fontWeight="semibold"
                fontSize={{ base: "12px", md: "16px", lg: "18px" }}
              >
                Register
              </Text>
            </Link>
          </Flex>
          <Flex
            w={{ base: "full", md: "fit-content" }}
            py={{ base: "4", sm: "0" }}
          >
            <Link href="/register">
              <Text
                color="#4ed879"
                fontWeight="semibold"
                fontSize={{ base: "12px", md: "16px", lg: "18px" }}
              >
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
