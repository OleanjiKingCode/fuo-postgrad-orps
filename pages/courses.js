import SidebarWithHeader from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  Flex,
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Courses = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();
  const [deptData, setDeptData] = useState();
  const [userRole, setUserRole] = useState("");
  const [userDept, setUserDept] = useState("");
  const toast = useToast();

  const [maxCourseNo, setMaxCourseNo] = useState(0);

  const [maxUnitsNo, setMaxUnitsNo] = useState(0);
  const [courseData, setCourseData] = useState([
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
    { name: "", units: "" },
  ]);

  const handleCourseChange = (index, value) => {
    const updatedCourseData = [...courseData];
    updatedCourseData[index].name = value;
    setCourseData(updatedCourseData);
  };

  const handleUnitsChange = (index, value) => {
    const updatedCourseData = [...courseData];
    updatedCourseData[index].units = value;
    setCourseData(updatedCourseData);
  };

  const email = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/User/${email}`);
      if (response) {
        const data = await response.data;
        setUserRole(data.role);
        setUserDept(data.department);
        setUserData(data);
        const response2 = await axios.get(`/api/Dept/${data.department}`);
        if (response2) {
          const data2 = await response2.data;
          setDeptData(data2);
        }
      }
    };
    fetchData();
  }, [email, session]);

  const submitCourses = async () => {
    if (maxCourseNo <= 8 || maxCourseNo > 16) {
      toast({
        title: "Maximum number of courses should be within 9-16",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (maxUnitsNo <= 10) {
      toast({
        title: "Maximum number of units to add is low",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Validate the input fields
    let isValid = true;

    // // Check the first 12 input fields
    // for (let i = 1; i < maxCourseNo; i++) {
    //   const { name, units } = courseData[i];
    //   if (name === "" || units === "") {
    //     isValid = false;
    //     break;
    //   }
    // }

    const minRequiredItems = 9;
    let validCourseData = [];

    for (let i = 1; i < maxCourseNo; i++) {
      const { name, units } = courseData[i];

      if (name.trim() !== "" && units.trim() !== "") {
        validCourseData.push(courseData[i]);
      }
    }

    if (validCourseData.length < minRequiredItems) {
      isValid = false;
    }

    if (isValid) {
      console.log("All input fields are valid");
      try {
        await axios.put(`/api/Dept/${deptData?.name}`, {
          courses: validCourseData,
          maxCourses: maxCourseNo,
          maxUnits: maxUnitsNo,
        });
        toast({
          title: "Successfully added Courses",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: "Input at least 9 courses ",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
  };

  return (
    <SidebarWithHeader>
      <Flex>
        {deptData?.courses?.length === 0 ? (
          userRole === "Lecturer" ? (
            <Box p={4} w="full" bg="white">
              <Heading fontSize="lg" w="full" py="5" textAlign="center">
                ADD COURSES
              </Heading>
              <Flex justifyContent="space-between" mb={4} gap={2} px="10%">
                <Flex alignItems="center" justifyContent="center">
                  <Text>{deptData?.name}</Text>
                </Flex>
                <Flex alignItems="center" justifyContent="center" gap={3}>
                  <Text>Maximum Number Of Courses</Text>
                  <Input
                    placeholder="Number"
                    onChange={(e) => setMaxCourseNo(e.target.value)}
                    value={maxCourseNo}
                    w="20%"
                  />
                </Flex>

                <Flex alignItems="center" justifyContent="center" gap={3}>
                  <Text>Maximum Number Of Units</Text>
                  <Input
                    placeholder="Number"
                    onChange={(e) => setMaxUnitsNo(e.target.value)}
                    value={maxUnitsNo}
                    w="20%"
                  />
                </Flex>
              </Flex>
              <VStack mt={4}>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 1)}</span>
                        <Input
                          id={`course-${index}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[index].name}
                          onChange={(e) =>
                            handleCourseChange(index, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${index}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[index].units}
                          onChange={(e) =>
                            handleUnitsChange(index, e.target.value)
                          }
                        />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 5)}</span>
                        <Input
                          id={`course-${index + 5}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[index].name}
                          onChange={(e) =>
                            handleCourseChange(index, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${index + 5}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[index].units}
                          onChange={(e) =>
                            handleUnitsChange(index, e.target.value)
                          }
                        />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 9)}</span>
                        <Input
                          id={`course-${index + 9}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[index].name}
                          onChange={(e) =>
                            handleCourseChange(index, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${index + 9}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[index].units}
                          onChange={(e) =>
                            handleUnitsChange(index, e.target.value)
                          }
                        />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, index) => (
                    <VStack key={index} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(index += 13)}</span>
                        <Input
                          id={`course-${index + 13}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[index].name}
                          onChange={(e) =>
                            handleCourseChange(index, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${index + 13}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[index].units}
                          onChange={(e) =>
                            handleUnitsChange(index, e.target.value)
                          }
                        />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
              </VStack>
              <Button my={4} colorScheme="green" onClick={submitCourses}>
                Save Changes
              </Button>
            </Box>
          ) : (
            <Box p={4} w="full" bg="white">
              <Text>Contact your Lecturers to Update the courses</Text>
            </Box>
          )
        ) : userRole === "Lecturer" ? (
          <span>List of students that have added the courses.</span>
        ) : (
          <span>List of the courses you added.</span>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default Courses;
