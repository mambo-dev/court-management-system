## Getting started

Start by opening terminal and run npm install:
npm install

Create a .env file with the following environment variables:

DATABASE_URL=<your_database_url_here>
NEXT_PUBLIC_URL=<your_next_public_url_here>
NODE_ENV=<your_node_env_here>
JWT_SECRET=<your_jwt_secret_here>
SUPABASE_URL=<your_supabase_url_here>
SUPABASE_ANON_KEY=<your_supabase_anon_key_here>

Push the database using Prisma:

npx prisma db push
Seed the database using Prisma:

npx prisma db seed
Generate the Prisma client:

npx prisma generate

After completing these steps, you can run your program using the command below and navigate to .

npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
