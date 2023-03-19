import { Case, Hearing } from "@prisma/client";
import { formatRelative } from "date-fns";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React from "react";
import DashboardLayout from "../../../../components/layout/dashboard";
import prisma from "../../../../lib/prisma";
import { DecodedToken } from "../../../../types/types";
import parse from "html-react-parser";
import Button from "../../../../components/utils/button";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";

type Props = {
  data: Data;
};

export default function HearingNotes({ data }: Props) {
  const { hearing } = data;
  const exportToPdf = async (elementId: string, pdfName: string) => {
    const pdf = new JsPDF("portrait", "pt", "a4");
    //@ts-ignore
    const data = await html2canvas(document.querySelector(`#${elementId}`));
    const img = data.toDataURL("image/png");
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${pdfName}.pdf`);
  };
  return (
    <div className="w-full h-full flex items-center flex-col justify-center py-10">
      <div className="w-full flex items-center justify-end px-4 ">
        <div className="w-fit ">
          <Button
            type="button"
            text="export hearing"
            onClick={() =>
              exportToPdf("report", `${hearing?.hearing_case.case_name}`)
            }
          />
        </div>
      </div>
      <div id="report" className="mb-auto flex items-center flex-col py-2 px-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {hearing?.hearing_case.case_name}
        </h1>
        <h2 className="text-xl font-bold text-slate-900">
          {formatRelative(new Date(`${hearing?.hearing_date}`), new Date())}
        </h2>

        <div className="text-sm font-medium">
          {parse(`${hearing?.hearing_ongoing_notes}`)}
        </div>

        <p className="text-xs font-normal">
          <strong>outcome: </strong>
          {hearing?.hearing_outcome}
        </p>
      </div>
    </div>
  );
}
type Data = {
  user: any;
  token: string;
  hearing:
    | (Hearing & {
        hearing_case: Case;
      })
    | null;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const { req } = context;

  const access_token = req.cookies.access_token;
  if (!access_token || access_token.trim() === "") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const decodedToken: DecodedToken = jwtDecode(access_token);

  if (decodedToken.exp < Date.now() / 1000) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { id } = context.query;

  const user = await prisma.login.findUnique({
    where: {
      login_id: decodedToken.user_id,
    },
    select: {
      login_username: true,
      login_password: false,
      login_role: true,
    },
  });

  const hearing = await prisma.hearing.findUnique({
    where: {
      hearing_id: Number(id),
    },
    include: {
      hearing_case: true,
    },
  });

  return {
    props: {
      data: {
        token: access_token,
        user,
        hearing: JSON.parse(JSON.stringify(hearing)),
      },
    },
  };
};

HearingNotes.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
