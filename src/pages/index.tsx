import Head from "next/head";

import useForm from "../../components/hooks/form";
import Box from "../../components/utils/box";
import Container from "../../components/utils/container";
import TextInput from "../../components/utils/input";

export default function Home() {
  const initialState = {
    username: "",
    password: "",
  };

  function handleLogin(values: any) {}
  const { values, handleChange, handleSubmit } = useForm(
    initialState,
    handleLogin
  );
  return (
    <>
      <Head>
        <title>judicial system</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container centered>
        <Box>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
            <TextInput
              label="username"
              type="text"
              handleChange={handleChange}
              name="username"
              value={values.username}
            />
            <TextInput
              label="password"
              type="password"
              handleChange={handleChange}
              name="password"
              value={values.password}
            />
          </form>
        </Box>
      </Container>
    </>
  );
}
