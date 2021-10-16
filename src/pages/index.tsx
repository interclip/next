import type { NextPage } from "next";
import PageHead from "../components/Head";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <PageHead />

      <Layout>
        <h1>test</h1>
      </Layout>
    </>
  );
};

export default Home;
