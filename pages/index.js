import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router, session]);
  return <></>;
};

export default HomePage;
