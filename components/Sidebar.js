import React, { useState, useEffect, useRef } from "react";
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
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
} from "react-icons/fi";

import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { dataAttr } from "@chakra-ui/utils";

import { usePathname } from "next/navigation";

const LinkItems = [
  { name: "Home", icon: FiHome, route: "/dashboard" },
  { name: "Courses", icon: FiCompass, route: "/courses" },
  { name: "Results", icon: FiStar, route: "/result" },
  { name: "Profile Settings", icon: FiSettings, route: "/settings" },
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
          Fountain University Postrgraduate
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} route={link.route}>
          {link.name}
        </NavItem>
      ))}
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
  const { status, data: session } = useSession();
  const router = useRouter();

  const toast = useToast();
  const logOutUser = async () => {
    const signOutsUser = await signOut({ redirect: false });
    toast({
      title: "Signed Out Successfully",
      description: "",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    router.push("/login");
  };
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(session?.user.name);
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
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"} px="5">
          <HStack cursor="pointer">
            <Avatar
              size={"md"}
              src={
                "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              }
            />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
            >
              <Text fontSize="sm" fontWeight="semibold">
                {username}
              </Text>
              <Text fontSize="xs" fontWeight="normal" color="gray.600">
                Student
              </Text>
            </VStack>
          </HStack>
        </Flex>
      </HStack>
    </Flex>
  );
};
