import {
  Box,
  FormControl,
  Flex,
  Button,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Spinner,
  useToast,
  Select,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn } from "next-auth/react";

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
    sex,
    dob,
    dept,
  }) => {
    try {
      const matricno = matric;
      const data = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        phoneNumber,
        sex,
        dob,
        matricno,
        dept,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: data?.data?.email,
        password: data?.data?.password,
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
          title: "Registered Successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: `${error.response.data.message}`,
        description: "",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);

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
      bgColor="#1d1e1f  "
      py="10"
    >
      <Heading color="white">Register</Heading>
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
              <FormControl isRequired>
                <FormLabel htmlFor="name" color="white">
                  Full Name
                </FormLabel>
                <Input
                  color="white"
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
              <FormControl isRequired>
                <FormLabel htmlFor="matric" color="white">
                  Matric Number
                </FormLabel>
                <Input
                  id="matric"
                  color="white"
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
              <FormControl isRequired>
                <FormLabel htmlFor="dob" color="white">
                  Date Of Birth
                </FormLabel>
                <Input
                  id="dob"
                  type="date"
                  color="white"
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
              <FormControl isRequired>
                <FormLabel htmlFor="phoneNumber" color="white">
                  Phone Number
                </FormLabel>
                <Input
                  id="phoneNumber"
                  color="white"
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
              <FormControl isRequired>
                <FormLabel htmlFor="sex" color="white">
                  Sex
                </FormLabel>
                <Select
                  placeholder="Select Sex"
                  {...register("sex", {
                    required: "Please select a valid option",
                  })}
                  color="white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
                {errors.sex && (
                  <Text color="red.500" py="1">
                    {errors.sex.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl isRequired>
                <FormLabel htmlFor="dept" color="white">
                  Department
                </FormLabel>
                <Select
                  placeholder="Select Department"
                  {...register("dept", {
                    required: "Please select a valid option",
                  })}
                  color="white"
                >
                  <option value="CPS">Computer Science</option>
                  <option value="MLS">Medical Laboratory Science</option>
                  <option value="MIB">Microbiology</option>
                </Select>
                {errors.dept && (
                  <Text color="red.500" py="1">
                    {errors.dept.message}
                  </Text>
                )}
              </FormControl>
            </Box>

            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl isRequired>
                <FormLabel htmlFor="email" color="white">
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  color="white"
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
                <FormLabel htmlFor="password" color="white">
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    color="white"
                    type={show ? "text" : "password"}
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
            <Box w={{ sm: "full", md: "50%" }}>
              <FormControl>
                <FormLabel htmlFor="confirmPassword" color="white">
                  Confirm Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    color="white"
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
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
                      {showConfirm ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
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
