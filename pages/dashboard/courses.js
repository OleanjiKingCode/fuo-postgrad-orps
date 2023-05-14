import SidebarWithHeader from "@/components/Sidebar";
import Simple from "@/components/pricings";
import { Flex } from "@chakra-ui/react";
import React from "react";

const Courses = () => {
  return (
    <SidebarWithHeader>
      <Flex>
        <Simple />
      </Flex>
    </SidebarWithHeader>
  );
};

export default Courses;
