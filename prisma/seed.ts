import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
const prisma = new PrismaClient();
async function main() {
  const hash = await argon2.hash("1234", {
    hashLength: 10,
  });
  //create admin user always
  const checkAdminExists = await prisma.login.findUnique({
    where: {
      login_username: "",
    },
  });
  if (checkAdminExists) {
    return;
  }

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
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
