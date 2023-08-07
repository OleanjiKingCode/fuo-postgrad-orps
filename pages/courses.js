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
            <VStack w="full" gap="3" py="4">
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
                      <b>MAX UNITS :</b> 23
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
