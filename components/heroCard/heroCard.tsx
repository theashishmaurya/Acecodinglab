"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";

export function ThreeDHeroCard() {
  return (
    <CardContainer className="inter-var w-screen">
      <CardBody className="bg-gray-500 w-screen relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1]  sm:w-4/5 rounded-xl p-6 border  ">
       
        <CardItem translateZ="100" className="mt-4 ">
          <Image
            src="assets/heroArea.svg"
            height="1024"
            width="1024"
            className=" w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
