import type { NextPage } from 'next';
import React from 'react';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <section className="my-auto w-full">
        <h1 className="text-center font-semibold text-6xl font-sans">
          Paste your link here!
        </h1>
        <div className="max-w-5xl lg:w-full mx-5 lg:mx-auto">
          <input
            type="text"
            className="mt-12 text-3xl w-full text-black py-2 px-3 rounded-2xl"
            placeholder="https://www.histories.cc/krystofex"
          />
        </div>
      </section>
    </Layout>
  );
};

export default Home;
