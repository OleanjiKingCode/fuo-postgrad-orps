import React, { useState, useEffect } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { FiHome, FiCompass, FiStar, FiSettings, FiMenu } from "react-icons/fi";
import { MdExitToApp } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { dataAttr } from "@chakra-ui/utils";
import { usePathname } from "next/navigation";

const LinkItems = [
  {
    name: "Home",
    icon: FiHome,
    route: "/dashboard",
    role: ["Student", "Lecturer", "Admin"],
  },
  {
    name: "Courses",
    icon: FiCompass,
    route: "/courses",
    role: ["Student", "Lecturer"],
  },
  {
    name: "Results",
    icon: FiStar,
    route: "/result",
    role: ["Student", "Lecturer"],
  },
  { name: "Students", icon: FiStar, route: "/students", role: ["Admin"] },
  { name: "Lecturers", icon: FiStar, route: "/lecturers", role: ["Admin"] },
  {
    name: "Departments",
    icon: FiStar,
    route: "/departments",
    role: ["Admin"],
  },
  {
    name: "Profile Settings",
    icon: FiSettings,
    route: "/settings",
    role: ["Student", "Lecturer"],
  },
];

const SidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <chakra.div w="full" display={{ base: "none", md: "flex" }}>
        <SidebarContent onClose={() => onClose} />
      </chakra.div>

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent display={{ base: "flex", md: "none" }}>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: "280px" }} p="4">
        {children}
      </Box>
    </Box>
  );
};
export default SidebarWithHeader;

const SidebarContent = ({ onClose }) => {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  const getData = async (email) => {
    const response = await axios.get(`./api/User/${email}`);
    if (response) {
      const data = await response.data;
      setUserRole(data.role);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      setUsername(session?.user.name);
      getData(session?.user?.email);
    }
  }, [session?.user?.email]);

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "280px" }}
      pos="fixed"
      h="full"
    >
      <Flex
        h="32"
        alignItems="center"
        mx="8"
        mb="3"
        textAlign="center"
        justifyContent="space-between"
      >
        <Text fontSize="xl" w="full" fontFamily="monospace" fontWeight="bold">
          Fountain University Postgraduate
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        return (
          <>
            {link.role.includes(userRole) && (
              <NavItem key={link.name} icon={link.icon} route={link.route}>
                {link.name}
              </NavItem>
            )}
          </>
        );
      })}
    </Box>
  );
};

const NavItem = ({ icon, children, route }) => {
  const pathname = usePathname();
  return (
    <Link
      href={route}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        mt="2"
        align="center"
        py="4"
        px="8"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "green.200  ",
          color: "white",
        }}
        data-active={dataAttr(pathname === route)}
        _active={{
          bg: "green.600",
          color: "white",
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  const toast = useToast();
  const logOutUser = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Signed Out Successfully",
      description: "",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    router.push("/");
  };

  const getData = async (email) => {
    const response = await axios.get(`./api/User/${email}`);
    if (response) {
      const data = await response.data;
      setUserRole(data.role);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      setUsername(session?.user.name);
      getData(session?.user?.email);
    }
  }, [session?.user?.email]);

  return (
    <Flex
      ml={{ base: 0, md: "280px" }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="18px"
        fontFamily="monospace"
        fontWeight="semibold"
        textAlign="center"
      >
        FUO POSTGRADUATE
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"} px="5">
          <HStack cursor="pointer">
            <Avatar size={"md"} src={"pfp.png"} />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
            >
              <Text fontSize="sm" fontWeight="semibold">
                {session?.user?.email}
              </Text>
              <Text fontSize="xs" fontWeight="normal" color="gray.600">
                {userRole}
              </Text>
            </VStack>
          </HStack>
        </Flex>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<MdExitToApp />}
          onClick={logOutUser}
        />
      </HStack>
    </Flex>
  );
};
