import { Bars3Icon } from "@heroicons/react/24/outline";
import React, { JSXElementConstructor, useState } from "react";
import Container from "../utils/container";
import MenuOptions from "../utils/menu";

type Props = {
  children: React.ReactElement<any, string | JSXElementConstructor<any>>;
};

const navLinks = [
  {
    name: "settings",
    link: "/settings",
  },
];

export default function DashboardLayout({ children }: Props) {
  const [openNavigation, setOpenNavigation] = useState(true);
  return (
    <Container>
      <header className="h-16 w-full bg-white border-b border-slate-300 shadow flex items-center justify-between py-2 px-2">
        <button
          onClick={() => {
            setOpenNavigation(!openNavigation);
          }}
          className="w-24 h-full inline-flex items-center justify-center"
        >
          <Bars3Icon className="w-7 h-7 " />{" "}
        </button>
        <div>
          <MenuOptions navLinks={navLinks} profileLink="/profile" />
        </div>
      </header>
      <div className="w-full h-full flex items-center">
        <nav
          className={` ${
            !openNavigation && "hidden"
          } w-full top-0 bottom-0 left-0 right-0 border-r shadow border-slate-300 absolute  md:relative md:w-[20%]  bg-white h-full `}
        >
          <div className="md:hidden flex"> </div>
        </nav>
        {children}
      </div>
    </Container>
  );
}
