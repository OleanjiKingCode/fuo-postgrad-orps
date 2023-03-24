import { useRouter } from "next/router";
import React, { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, [router]);
  return <></>;
};

export default HomePage;
