import {
  Box,
  FormControl,
  Flex,
  Button,
  FormLabel,
  Input,
  Text,
  Spinner,
  useToast,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

const register = () => {
  const router = useRouter();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async ({
    name,
    email,
    matric,
    password,
    phoneNumber,
    level,
    sex,
    dob,
  }) => {
    try {
      const matricno = matric;
      await axios.post("/api/User/signup", {
        name,
        email,
        password,
        phoneNumber,
        level,
        sex,
        dob,
        matricno,
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        description: "",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      w="full"
      h="100vh"
      bgImage="url(/bg.jpg)"
      bgPos="center"
      bgSize="cover !important"
      bgBlendMode="overlay"
      bgColor="#5b5b5b"
    >
      <Heading>Register</Heading>
      <Flex height="100vh" overflowY="scroll" w="full" direction="column">
        <form
          onSubmit={handleSubmit(submitHandler)}
          style={{ width: "inherit" }}
        >
          <Flex
            flexDirection="column"
            gap="5"
            alignItems={{ md: "center" }}
            w="full"
            pb="6"
          >
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your Full name"
                  {...register("name", {
                    required: "Please enter your Full name",
                    minLength: {
                      value: 6,
                      message: "Full name should be more than 6 chars",
                    },
                  })}
                  autoFocus
                />
                {errors.name && (
                  <Text color="red.500" py="1">
                    {errors.name.message}
                  </Text>
                )}
              </FormControl>
            </Box>
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="matric">Matric Number</FormLabel>
                <Input
                  id="matric"
                  type="text"
                  placeholder="Enter your Matric no"
                  {...register("matric", {
                    required: "Please enter your Matric no",
                    minLength: {
                      value: 10,
                      message: "Matric no should be more than 10 chars",
                    },
                  })}
                />
                {errors.matric && (
                  <Text color="red.500" py="1">
                    {errors.matric.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter your Phone Number"
                  {...register("phoneNumber", {
                    required: "Please enter your Phone Number",
                    minLength: {
                      value: 10,
                      message: "Phone Number should be more than 10 chars",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <Text color="red.500" py="1">
                    {errors.phoneNumber.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="level">Level</FormLabel>
                <Input
                  id="level"
                  type="text"
                  placeholder="Enter your Level"
                  {...register("level", {
                    required: "Please enter your Level",
                    minLength: {
                      value: 3,
                      message: "Level should be more than 3 chars",
                    },
                  })}
                />
                {errors.level && (
                  <Text color="red.500" py="1">
                    {errors.level.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="sex">Sex</FormLabel>
                <Input
                  id="sex"
                  type="text"
                  placeholder="Enter your Sex"
                  {...register("sex", {
                    required: "Please enter your Sex",
                  })}
                />
                {errors.sex && (
                  <Text color="red.500" py="1">
                    {errors.sex.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="dob">Date Of Birth</FormLabel>
                <Input
                  id="dob"
                  type="date"
                  placeholder="choose your Date Of Birth"
                  {...register("dob", {
                    required: "Please choose your Date Of Birth",
                  })}
                />
                {errors.dob && (
                  <Text color="red.500" py="1">
                    {errors.dob.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Please enter email",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                      message: "Please enter valid email",
                    },
                  })}
                />
                {errors.email && (
                  <Text color="red.500" py="1">
                    {errors.email.message}
                  </Text>
                )}
              </FormControl>
            </Box>
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Please enter password",
                    minLength: {
                      value: 6,
                      message: "password is more than 5 chars",
                    },
                  })}
                />
                {errors.password && (
                  <Text color="red.500" py="1">
                    {errors.password.message}
                  </Text>
                )}
              </FormControl>
            </Box>
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Enter Confirm password"
                  {...register("confirmPassword", {
                    required: "Please enter confirm password",
                    validate: (value) => value === getValues("password"),
                    minLength: {
                      value: 6,
                      message: "password is more than 5 chars",
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <Text color="red.500" py="1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
                {errors.confirmPassword &&
                  errors.confirmPassword.type === "validate" && (
                    <Text color="red.500" py="1">
                      Passwords do not match
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
                {isSubmitting ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Register"
                )}
              </Text>
            </Button>
          </Flex>
        </form>
        <Flex
          w="full"
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          pb="20"
        >
          <Text color="white">Already registered? &nbsp; </Text>
          <Link href="/">
            <Text color="#4ed879" fontWeight="semibold">
              Login{" "}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default register;
