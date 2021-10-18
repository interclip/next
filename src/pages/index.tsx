import type { NextPage } from 'next';
import PageHead from '../components/Head';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <>
      <PageHead />
      <Layout></Layout>
    </>
  );
};

export default Home;
