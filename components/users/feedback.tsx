import { Disclosure } from "@headlessui/react";
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  BugAntIcon,
  ChatBubbleLeftRightIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { FeedBack } from "@prisma/client";
import React, { useState } from "react";
import DisclosureComp from "../utils/disclosure";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  feedbacks: FeedBack[] | [];
};

export default function Feedback({ token, setIsOpen, feedbacks }: Props) {
  return (
    <div className="w-full md:w-[500px] px-2 py-5">
      <ul
        role="list"
        className="divide-y divide-gray-200 rounded-md border border-gray-200"
      >
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <DisclosureComp
              key={feedback.feedback_id}
              button={
                <div className="w-full flex items-center justify-start gap-x-4 py-2">
                  {" "}
                  <span>
                    {feedback.feedback_type === "Bug" ? (
                      <BugAntIcon className="w-5 h-5 text-red-500 font-medium" />
                    ) : feedback.feedback_type === "complaint" ? (
                      <HandThumbDownIcon className="w-5 h-5 text-amber-500 font-medium" />
                    ) : feedback.feedback_type === "compliment" ? (
                      <HandThumbUpIcon className="w-5 h-5 text-green-500 font-medium" />
                    ) : (
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500 font-medium" />
                    )}
                  </span>
                  <span>{feedback.feedback_type}</span>
                </div>
              }
              panel={<span>{feedback.feedback_details}</span>}
            />
          ))
        ) : (
          <div className="py-2 px-1 text-red-500 font-semibold text-sm">
            <span>no feedbacks from clients yet</span>
          </div>
        )}
      </ul>
    </div>
  );
}
