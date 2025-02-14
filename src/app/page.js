"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Loading from "./loading.gif"

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Image src={Loading} alt="Loading..."  priority/>
    </div>
  );
}

export default Page;
