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
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const Courses = () => {
  const { data: session } = useSession();
  const [refetchData, setRefetchData] = useState(false);
  const [userData, setUserData] = useState();
  const [userDataWithCourses, setUserDataCourses] = useState();
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

  const handleCheckboxChange = (index) => {
    const updatedCourseData = [...deptData.courses];
    updatedCourseData[index].checked = !updatedCourseData[index].checked;
    setDeptData({ ...deptData, courses: updatedCourseData });
  };

  const checkAllBoxes = () => {
    const updatedCourseData = deptData.courses.map((course) => ({
      ...course,
      checked: true,
    }));
    setDeptData({ ...deptData, courses: updatedCourseData });
  };

  const unCheckAllBoxes = () => {
    const updatedCourseData = deptData.courses.map((course) => ({
      ...course,
      checked: false,
    }));
    setDeptData({ ...deptData, courses: updatedCourseData });
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
        const response4 = await axios.get(`/api/User`);
        if (response4) {
          const dptUsers = response4.data.filter(
            (obj) =>
              obj.department === data.department && obj.role === "Student"
          );
          setUserDataCourses(dptUsers);
        }
      }
    };
    fetchData();
  }, [session, refetchData]);

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

    const minRequiredItems = 9;
    let validCourseData = [];

    for (let i = 0; i < maxCourseNo; i++) {
      const { name, units } = courseData[i];

      if (name.trim() !== "" && units.trim() !== "") {
        validCourseData.push(courseData[i]);
      }
    }

    if (validCourseData.length < minRequiredItems) {
      isValid = false;
    }

    if (isValid) {
      try {
        const result = await axios.put(`/api/Dept/${deptData?.name}`, {
          courses: validCourseData,
          maxCourses: maxCourseNo,
          maxUnits: maxUnitsNo,
        });
        if (result) {
          setRefetchData((prevValue) => !prevValue);
          setRefetchData(true);
          toast({
            title: "Successfully added Courses",
            description: "",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
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

  const chosenCourses = async () => {
    let coursesWithCheckboxTrue = [];
    let amountOfUnits = 0;

    for (const course of deptData.courses) {
      if (course.checked === true) {
        coursesWithCheckboxTrue.push(course);
        amountOfUnits += course.units;
      }
    }

    if (amountOfUnits < deptData?.maxUnits) {
      toast({
        title: "Maximum number of units added is low",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await axios.put(`/api/User/${email}`, {
        coursesAdded: coursesWithCheckboxTrue,
      });
      if (result) {
        setRefetchData((prevValue) => !prevValue);
        toast({
          title: "Successfully added Courses",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
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
                  {[...Array(4)].map((_, ind) => (
                    <VStack key={ind} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(ind += 5)}</span>
                        <Input
                          id={`course-${ind + 5}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[ind].name}
                          onChange={(e) =>
                            handleCourseChange(ind, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${ind + 5}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[ind].units}
                          onChange={(e) =>
                            handleUnitsChange(ind, e.target.value)
                          }
                        />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, i) => (
                    <VStack key={i} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(i += 9)}</span>
                        <Input
                          id={`course-${i + 9}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[i].name}
                          onChange={(e) =>
                            handleCourseChange(i, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${i + 9}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[i].units}
                          onChange={(e) => handleUnitsChange(i, e.target.value)}
                        />
                      </Flex>
                    </VStack>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {[...Array(4)].map((_, inde) => (
                    <VStack key={inde} spacing={2} align="center">
                      <Flex gap="1" alignItems="center" justifyContent="center">
                        <span>{(inde += 13)}</span>
                        <Input
                          id={`course-${inde + 13}`}
                          placeholder="Course"
                          flex="8"
                          mr={2}
                          value={courseData[inde].name}
                          onChange={(e) =>
                            handleCourseChange(inde, e.target.value)
                          }
                        />
                        <Input
                          id={`course-${inde + 13}`}
                          placeholder="Number"
                          flex="2"
                          value={courseData[inde].units}
                          onChange={(e) =>
                            handleUnitsChange(inde, e.target.value)
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
            <Flex
              p={4}
              w="full"
              minH="80vh"
              bg="white"
              fontWeight="semibold"
              fontSize="lg"
              justifyContent="center"
              alignItems="center"
            >
              Contact your lecturers to update the courses
            </Flex>
          )
        ) : userRole === "Lecturer" ? (
          <VStack mt={4} p={4} w="full" bg="white">
            <VStack w="full" gap="3" py="4">
              <Heading fontSize="lg">STUDENTS WHO REGISTERED </Heading>
              <HStack w="full" px="10" justifyContent="space-between">
                <Text>
                  {" "}
                  <b>DEPARTMENT :</b> {deptData?.name}
                </Text>
                <Text>
                  {" "}
                  <b>MAX UNITS :</b> {deptData?.maxUnits}
                </Text>
              </HStack>
            </VStack>
            <Table variant="striped" colorScheme="blue" w="full" py="20">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Student Name</Th>
                  <Th>Email</Th>
                  <Th>Matric No</Th>
                  <Th>Course Registered</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userDataWithCourses?.map((student, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.email}</Td>
                    <Td>{student.matricno}</Td>
                    <Td>{student.coursesAdded.length}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        ) : userData?.coursesAdded ? (
          <>
            {userData?.coursesAdded.length === 0 ? (
              <VStack mt={4} p={4} w="full" bg="white">
                <HStack w="full" gap="10">
                  <Heading fontSize="lg">CHOOSE COURSES</Heading>
                  <Text>
                    {" "}
                    <b>DEPARTMENT :</b> {deptData?.name}
                  </Text>
                  <Text>
                    {" "}
                    <b>MAX UNITS :</b> {deptData?.maxUnits}
                  </Text>
                </HStack>

                <Table variant="striped" colorScheme="blue" w="full">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Course Name</Th>
                      <Th>Units</Th>
                      <Th>Check</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {deptData?.courses?.map((course, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{course.name}</Td>
                        <Td>{course.units}</Td>
                        <Td>
                          <Checkbox
                            isChecked={course.checked}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <HStack w="full" gap="10">
                  <Button my={4} colorScheme="blue" onClick={checkAllBoxes}>
                    Check All
                  </Button>
                  <Button my={4} colorScheme="blue" onClick={unCheckAllBoxes}>
                    Un-Check All
                  </Button>
                  <Button my={4} colorScheme="green" onClick={chosenCourses}>
                    Submit
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <VStack mt={4} p={4} w="full" bg="white">
                <VStack w="full" gap="4">
                  <Heading fontSize="lg">CHOOSEN COURSES</Heading>
                  <HStack w="full" justifyContent="space-between" px="10">
                    <Text>
                      {" "}
                      <b>DEPARTMENT :</b> {deptData?.name}
                    </Text>
                    <Text>
                      {" "}
                      <b>MAX UNITS :</b> {deptData?.maxUnits}
                    </Text>
                  </HStack>
                </VStack>

                <Table variant="striped" colorScheme="blue" w="full">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Course Name</Th>
                      <Th>Units</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userData?.coursesAdded?.map((course, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{course.name}</Td>
                        <Td>{course.units}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            )}
          </>
        ) : (
          <Flex
            p={4}
            w="full"
            minH="80vh"
            bg="white"
            fontWeight="semibold"
            fontSize="lg"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner />
          </Flex>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default Courses;
