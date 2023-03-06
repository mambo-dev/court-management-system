import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash("1234", {
    hashLength: 10,
  });
  //create admin user always
  const admin = await prisma.login.findUnique({
    where: {
      login_username: "zab",
    },
  });

  if (!admin) {
    await prisma.login.create({
      data: {
        login_password: hash,
        login_role: "admin",
        login_username: "zab",
        Admin: {
          create: {
            admin_email: "zab@email.com",
            admin_dob: "2/22/2023",
            admin_full_name: "zabbron maina",
            admin_gender: "male",
            admin_national_id: "37459290",
            admin_phone_number: "074939239",
          },
        },
      },
    });
  }

  const judgeA = await prisma.login.findUnique({
    where: {
      login_username: "Brenda",
    },
  });

  if (!judgeA) {
    await prisma.login.create({
      data: {
        login_password: hash,
        login_role: "judge",
        login_username: "Brenda",
        Judge: {
          create: {
            judge_email: "Brenda@email.com",
            judge_dob: "2/22/2023",
            judge_full_name: "Brenda Githinji",
            judge_gender: "female",
            judge_national_id: "37459291",
            judge_phone_number: "+254741882041",
          },
        },
      },
    });
  }

  const judgeB = await prisma.login.findUnique({
    where: {
      login_username: "Michael",
    },
  });

  if (!judgeB) {
    await prisma.login.create({
      data: {
        login_password: hash,
        login_role: "judge",
        login_username: "Michael",
        Judge: {
          create: {
            judge_email: "Michael@email.com",
            judge_dob: "2/22/2023",
            judge_full_name: "Michael Mambo",
            judge_gender: "male",
            judge_national_id: "37459293",
            judge_phone_number: "+254741882041",
          },
        },
      },
    });
  }

  const citizenA = await prisma.login.findUnique({
    where: {
      login_username: "Remmy",
    },
  });
  if (!citizenA) {
    await prisma.login.create({
      data: {
        login_password: hash,
        login_role: "citizen",
        login_username: "Remmy",
        Citizen: {
          create: {
            citizen_email: "Remmy@email.com",
            citizen_dob: "2/22/2023",
            citizen_full_name: "Remmy Martins",
            citizen_gender: "male",
            citizen_national_id: "37451860",
            citizen_phone_number: "+254741882042",
          },
        },
      },
    });
  }

  const citizenB = await prisma.login.findUnique({
    where: {
      login_username: "Gladys",
    },
  });
  if (!citizenB) {
    await prisma.login.create({
      data: {
        login_password: hash,
        login_role: "citizen",
        login_username: "Gladys",
        Citizen: {
          create: {
            citizen_email: "Gladys@email.com",
            citizen_dob: "2/22/2023",
            citizen_full_name: "Gladys Chepkorir",
            citizen_gender: "female",
            citizen_national_id: "37459292",
            citizen_phone_number: "+254741882041",
          },
        },
      },
    });
  }

  const lawyer = await prisma.login.findUnique({
    where: {
      login_username: "Lidsy",
    },
  });
  if (!lawyer) {
    await prisma.login.create({
      data: {
        login_password: hash,
        login_role: "lawyer",
        login_username: "Lidsy",
        Lawyer: {
          create: {
            lawyer_email: "Brenda@email.com",
            lawyer_dob: "2/22/2023",
            lawyer_full_name: "Lidsy Gathoni",
            lawyer_gender: "female",
            lawyer_national_id: "37451864",
            lawyer_phone_number: "+254741882043",
          },
        },
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
