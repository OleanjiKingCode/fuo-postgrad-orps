import * as React from "react";
import Simple from "../components/pricings";
import { Flex } from "@chakra-ui/react";
import SimpleSidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <SimpleSidebar>
      <Flex>
        <Simple />
      </Flex>
    </SimpleSidebar>
  );
}
