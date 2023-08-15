import SidebarWithHeader from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Flex,
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
  chakra,
  Box,
  Stack,
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

  const [isLoading, setIsLoading] = useState(false);

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
          console.log(data2);
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

  const chosenCourses = async () => {
    setIsLoading(true);
    let coursesWithCheckboxTrue = [];
    let amountOfUnits = 0;
    let firstSemesterUnits = 0;
    let secondSemestertUnits = 0;
    let thirdSemesterUnits = 0;

    let firstSemesterCourses = [];
    let secondSemestertCourses = [];
    let thirdSemesterCourses = [];

    for (const course of deptData.courses) {
      if (course.checked === true) {
        coursesWithCheckboxTrue.push(course);
        amountOfUnits += course.units;
      } else {
        if (course.compulsory) {
          toast({
            title: "Select all compulsory courses",
            description: "",
            status: "warning",
            duration: 4000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }
      }
    }

    for (const course of coursesWithCheckboxTrue) {
      if (course.semester === "First") {
        firstSemesterUnits += Number(course.units);
        firstSemesterCourses.push(course);
      } else if (course.semester === "Second") {
        secondSemestertUnits += Number(course.units);
        secondSemestertCourses.push(course);
      } else if (course.semester === "Third") {
        thirdSemesterUnits += Number(course.units);
        thirdSemesterCourses.push(course);
      }
    }
    console.log(
      firstSemesterUnits,
      deptData?.maxUnits,
      secondSemestertUnits,
      thirdSemesterUnits
    );

    if (firstSemesterUnits < deptData?.maxUnits[0]) {
      toast({
        title:
          "Chosen courses units doesnt meet the required number for first semester",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
    if (secondSemestertUnits < deptData?.maxUnits[1]) {
      toast({
        title:
          "Chosen courses units doesnt meet the required number for second semester",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    if (thirdSemesterUnits < deptData?.maxUnits[2]) {
      toast({
        title:
          "Chosen courses units doesnt meet the required number for third semester",
        description: "",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await axios.put(`/api/User/${email}`, {
        coursesAdded: {
          firstSemester: firstSemesterCourses,
          secondSemester: secondSemestertCourses,
          thirdSemester: thirdSemesterCourses,
        },
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
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <SidebarWithHeader>
      <Flex>
        {deptData?.courses?.length === 0 ? (
          userRole === "Lecturer" ? (
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
              Contact Admin to update the courses
            </Flex>
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
              Contact your Lecturers / Admin to update the courses
            </Flex>
          )
        ) : userRole === "Lecturer" ? (
          <VStack mt={4} p={4} w="full" bg="white">
            <VStack w={{ base: "48", md: "full" }} gap="3" py="4">
              <Heading fontSize="lg">List Of Students</Heading>
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
                  <Th>Course Registered [1st, 2nd,3rd]</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userDataWithCourses?.map((student, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.email}</Td>
                    <Td>{student.matricno}</Td>
                    <Td>
                      <chakra.span px="3">
                        {" "}
                        {student.coursesAdded?.firstSemester?.length ?? 0},
                      </chakra.span>
                      <chakra.span px="3">
                        {" "}
                        {student.coursesAdded?.secondSemester?.length ?? 0},
                      </chakra.span>
                      <chakra.span px="3">
                        {student.coursesAdded?.thirdSemester?.length ?? 0}
                      </chakra.span>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        ) : userRole === "Student" ? (
          <>
            {userData?.coursesAdded?.firstSemester?.length > 0 ? (
              <VStack mt={4} p={4} w="full" bg="white">
                <Box
                  w="full"
                  overflowX="scroll"
                  sx={{
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <VStack w="full" gap="4">
                    <Heading fontSize="lg">CHOOSEN COURSES</Heading>
                    <Stack
                      w="full"
                      justifyContent="space-between"
                      px={{ base: "1", md: "10" }}
                      pb="4"
                      direction={{ base: "column", lg: "row" }}
                    >
                      <Text fontSize={{ base: "14px", md: "18px" }}>
                        <b>DEPARTMENT :</b> {deptData?.name}
                      </Text>
                      <Text fontSize={{ base: "14px", md: "18px" }}>
                        <b>MAX UNITS :</b>
                      </Text>
                      <Text fontSize={{ base: "14px", md: "18px" }}>
                        <b>First :</b> {deptData?.maxUnits[0]} Units
                      </Text>
                      <Text fontSize={{ base: "14px", md: "18px" }}>
                        <b>Second:</b> {deptData?.maxUnits[1]} Units
                      </Text>{" "}
                      <Text fontSize={{ base: "14px", md: "18px" }}>
                        <b>Third:</b> {deptData?.maxUnits[2]} Units
                      </Text>
                    </Stack>
                  </VStack>
                  <Text
                    py="3"
                    color="white"
                    bg="green.500"
                    w="full"
                    px="2"
                    fontWeight="700"
                    mt="2"
                  >
                    FIRST SEMESTER
                  </Text>
                  <Table variant="striped" colorScheme="blue" w="full">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th w="full">Course Name</Th>
                        <Th>Units</Th>
                        <Th>Semester</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {userData?.coursesAdded?.firstSemester?.map(
                        (course, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td w="full">{course.name}</Td>
                            <Td>{course.units}</Td>
                            <Td>{course.semester}</Td>
                            <Td>
                              {course.compulsory ? "Compulsory" : "Selective"}
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                  <Text
                    py="3"
                    color="white"
                    bg="green.500"
                    w="full"
                    px="2"
                    fontWeight="700"
                    mt="2"
                  >
                    SECOND SEMESTER
                  </Text>
                  <Table variant="striped" colorScheme="blue" w="full">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Course Name</Th>
                        <Th>Units</Th>
                        <Th>Semester</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {userData?.coursesAdded?.secondSemester?.map(
                        (course, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{course.name}</Td>
                            <Td>{course.units}</Td>
                            <Td>{course.semester}</Td>
                            <Td>
                              {course.compulsory ? "Compulsory" : "Selective"}
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>

                  <Text
                    py="3"
                    color="white"
                    bg="green.500"
                    w="full"
                    px="2"
                    fontWeight="700"
                    mt="2"
                  >
                    THIRD SEMESTER
                  </Text>
                  <Table variant="striped" colorScheme="blue" w="full">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Course Name</Th>
                        <Th>Units</Th>
                        <Th>Semester</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {userData?.coursesAdded?.thirdSemester?.map(
                        (course, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{course.name}</Td>
                            <Td>{course.units}</Td>
                            <Td>{course.semester}</Td>
                            <Td>
                              {course.compulsory ? "Compulsory" : "Selective"}
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            ) : (
              <VStack mt={4} p={4} w="full" bg="white">
                <HStack w="full" gap="10">
                  <Heading fontSize="lg">CHOOSE COURSES</Heading>
                  <Text>
                    {" "}
                    <b>DEPARTMENT :</b> {deptData?.name}
                  </Text>
                  <Text>
                    {" "}
                    <b>MAX UNITS :</b>
                  </Text>
                  <Text>
                    {" "}
                    <b>First :</b> {deptData?.maxUnits[0]} Units
                  </Text>
                  <Text>
                    <b>Second:</b> {deptData?.maxUnits[1]}Units
                  </Text>{" "}
                  <Text>
                    <b>Third:</b> {deptData?.maxUnits[2]} Units
                  </Text>
                </HStack>

                <Table variant="striped" colorScheme="blue" w="full">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Course Name</Th>
                      <Th>Units</Th>
                      <Th>Semester</Th>
                      <Th>Status</Th>
                      <Th>Check</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {deptData?.courses?.map((course, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{course.name}</Td>
                        <Td>{course.units}</Td>
                        <Td>{course.semester}</Td>
                        <Td>
                          {course.compulsory ? "Compulsory" : "Selective"}
                        </Td>
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
                  <Button
                    my={4}
                    colorScheme="green"
                    onClick={chosenCourses}
                    isLoading={isLoading}
                  >
                    Submit
                  </Button>
                </HStack>
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
