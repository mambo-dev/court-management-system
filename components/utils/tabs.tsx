import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TabProp = {
  tabs: any;
};

export default function Tabs({ tabs }: TabProp) {
  return (
    <div className="w-full sm:px-0">
      <Tab.Group>
        <Tab.List className="flex  space-x-1 rounded bg-white shadow border border-slate-300 p-1">
          {Object.keys(tabs).map((title) => (
            <Tab
              key={title}
              className={({ selected }) =>
                classNames(
                  "w-full rounded py-2.5 text-sm font-medium leading-5 text-teal-500",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-200 focus:outline-none focus:ring-1",
                  selected
                    ? "bg-slate-100  rounded"
                    : "text-teal-500 font-bold hover:bg-white/[0.12] hover:text-teal-800"
                )
              }
            >
              {title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 w-full ">
          {Object.values(tabs).map((tab: any, index: number) => {
            return (
              <Tab.Panel key={index} className="w-full">
                {tab.component}
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
