import {
  BanknotesIcon,
  Bars3Icon,
  BuildingLibraryIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  Square2StackIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
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

const sideLinks = [
  {
    name: "dashboard",
    link: "/dashboard",
    icon: (
      <PresentationChartBarIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
  {
    name: "users",
    link: "/dashboard/users",
    icon: (
      <UsersIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
  {
    name: "cases",
    link: "/dashboard/cases",
    icon: (
      <DocumentTextIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
  {
    name: "hearings",
    link: "/dashboard/hearings",
    icon: (
      <Square2StackIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
  {
    name: "court proceedings",
    link: "/dashboard/proceeds",
    icon: (
      <BuildingLibraryIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
  {
    name: "fines",
    link: "/dashboard/fines",
    icon: (
      <BanknotesIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
  {
    name: "reports",
    link: "/dashboard/reports",
    icon: (
      <DocumentChartBarIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600 " />
    ),
  },
];

export default function DashboardLayout({ children }: Props) {
  const [openNavigation, setOpenNavigation] = useState(false);
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
          } w-full py-5 flex flex-col gap-y-3  px-2 top-0 bottom-0 left-0 right-0 border-r shadow border-slate-300 absolute  md:relative md:w-[20%]  bg-white h-full `}
        >
          <button
            onClick={() => setOpenNavigation(false)}
            className="md:hidden flex ml-auto"
          >
            <XMarkIcon className="w-7 h-7" />{" "}
          </button>
          <ul className="flex flex-col items-center justify-center gap-y-2 ">
            {sideLinks.map(
              (
                link: {
                  name: string;
                  link: string;
                  icon: any;
                },
                index: number
              ) => {
                return (
                  <div key={index} className="w-full">
                    <Link href={`${link.link}`}>
                      <li
                        onClick={() => {
                          window.innerWidth <= 780 && setOpenNavigation(false);
                        }}
                        className="py-3 group flex items-center  gap-x-2 justify-start  w-full rounded px-2 hover:bg-blue-100 focus:bg-blue-100 "
                      >
                        {link.icon}
                        <span className="font-semibold text-slate-500  group-hover:text-blue-500 group-focus:text-blue-600">
                          {link.name}{" "}
                        </span>
                      </li>
                    </Link>
                  </div>
                );
              }
            )}
          </ul>
        </nav>
        {children}
      </div>
    </Container>
  );
}
