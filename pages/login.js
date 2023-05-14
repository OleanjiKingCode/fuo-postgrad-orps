import React, { useEffect } from "react";
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
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const submitHandler = async ({ matricno, password }) => {
    try {
      let matri = matricno.replace(/\//g, "");
      const response = await axios.get(`./api/User/${matri}`);
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
          console.log(router);
          toast({
            title: "Signed In Successfully",
            description: "",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
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
      bgColor="#5b5b5b"
    >
      <Flex
        flexDirection="column"
        gap="10"
        alignItems={{ md: "center" }}
        w="full"
      >
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
                <FormLabel htmlFor="matricno">Matric Number</FormLabel>
                <Input
                  id="matricno"
                  type="text"
                  placeholder="Enter your Matric no"
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
