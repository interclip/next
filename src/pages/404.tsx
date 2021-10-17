import React from 'react';
import { Layout } from '../components/Layout';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Error404: React.FC = () => {
  return (
    <Layout>
      <section className="flex h-[30em] items-center mt-[20%]">
        <motion.div
          initial={{ rotate: 60, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{
            ease: 'easeOut',
            duration: 0.4,
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/paperplane.png"
            layout="fill"
            objectFit="contain"
            objectPosition="right"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: 'easeOut',
            duration: 0.6,
          }}
          className="h-full w-full flex flex-col relative text-gray-700"
          style={{
            textShadow:
              '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          <div className="text-9xl font-bold absolute bottom-[50%]">404</div>
          <div className="font-semibold h-[40%] mt-0 pt-0 text-6xl absolute top-[50%]">
            Page not found
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Error404;
