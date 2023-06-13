import SidebarWithHeader from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Flex } from "@chakra-ui/react";
import axios from "axios";

const Courses = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();
  const [deptData, setDeptData] = useState();
  const [userRole, setUserRole] = useState("");
  const [userDept, setUserDept] = useState("");
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

  return (
    <SidebarWithHeader>
      <Flex>
        {deptData?.courses?.length === 0 ? (
          userRole === "lecturer" ? (
            <span>You can add courses as there are no courses available.</span>
          ) : (
            <span>
              You cannot add courses as the lecturer hasn't added any yet.
            </span>
          )
        ) : userRole === "lecturer" ? (
          <span>List of students that have added the courses.</span>
        ) : (
          <span>List of the courses you added.</span>
        )}
      </Flex>
    </SidebarWithHeader>
  );
};

export default Courses;
