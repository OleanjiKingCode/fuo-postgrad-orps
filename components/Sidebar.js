import React from "react";
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
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  chakra,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

import { dataAttr } from "@chakra-ui/utils";

import { usePathname } from "next/navigation";

const LinkItems = [
  { name: "Home", icon: FiHome, route: "/dashboard" },
  { name: "Courses", icon: FiCompass, route: "/dashboard/courses" },
  { name: "Results", icon: FiStar, route: "/dashboard/result" },
  { name: "Fees", icon: FiTrendingUp, route: "/dashboard/fees" },
  { name: "Settings", icon: FiSettings, route: "/dashboard/settings" },
];

const SidebarWithHeader = ({ children }) => {
  const pathname = usePathname();
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
        h="20"
        alignItems="center"
        mx="8"
        mb="3"
        justifyContent="space-between"
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children }) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        py="4"
        px="8"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "#4ed879",
          color: "white",
        }}
        data-active={dataAttr(pathname === item.route)}
        _active={{
          bg: "#4ed879",
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
                Justina Clark
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
