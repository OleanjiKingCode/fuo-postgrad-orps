import React from "react";
import {
  Box,
  FormControl,
  Flex,
  Button,
  FormLabel,
  Input,
  Text,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = ({ email, password }) => {};
  return (
    <Flex
      w="full"
      h="100vh"
      alignItems="center"
      bgImage="url(/bg.jpg)"
      bgPos="center"
      bgSize="cover !important"
      bgBlendMode="overlay"
      bgColor="#5b5b5b"
    >
      <Flex
        flexDirection="column"
        gap="10"
        alignItems={{ md: "center" }}
        w="full"
      >
        <form
          // onSubmit={handleSubmit(submitHandler)}
          style={{ width: "inherit" }}
        >
          <Flex
            flexDirection="column"
            gap="10"
            alignItems={{ md: "center" }}
            w="full"
          >
            {/* <Box w={{ sm: "full", md: "50%" }}>
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
                  autoFocus
                />
                <FormErrorMessage>
                   {errors.email && errors.email.message} 
                </FormErrorMessage>
              </FormControl>
            </Box> */}
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="name">Matric Number</FormLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your Matric no"
                  {...register("name", {
                    required: "Please enter your Matric no",
                    minLength: {
                      value: 10,
                      message: "Matric no should be more than 10 chars",
                    },
                  })}
                  autoFocus
                />
                {/* {errors.name && (
                    <Text color="red.500" py="1">
                      {errors.name.message}
                    </Text>
                  )} */}
              </FormControl>
            </Box>
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  autoFocus
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Please enter password",
                    minLength: {
                      value: 6,
                      message: "password is more than 5 chars",
                    },
                  })}
                />
                <FormErrorMessage>
                  {/* {errors.password && errors.password.message} */}
                </FormErrorMessage>
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
        <Flex w={{ sm: "full", md: "50%" }}>
          <Text color="white">Not yet registered? &nbsp; </Text>
          <Link href="/register">
            <Text color="#4ed879" fontWeight="semibold">
              Register
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
