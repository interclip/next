import { Layout } from '@components/Layout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Error404: React.FC = () => {
  return (
    <Layout titlePrefix="Page not found">
      <main
        className="mt-[20%] flex h-[30em] w-full max-w-6xl items-center"
        id="maincontent"
      >
        <motion.div
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="relative h-full w-full"
          initial={{ rotate: 60, scale: 0.5, opacity: 0 }}
          transition={{
            ease: 'easeOut',
            duration: 0.4,
          }}
        >
          <Image
            alt="A paperplane"
            layout="fill"
            objectFit="contain"
            objectPosition="right"
            src="/images/paperplane.png"
          />
        </motion.div>
        <motion.div
          animate={{ opacity: 1 }}
          className="relative flex h-full w-full flex-col text-white"
          initial={{ opacity: 0 }}
          style={{
            textShadow:
              '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
          }}
          transition={{
            ease: 'easeOut',
            duration: 0.6,
          }}
        >
          <div className="absolute bottom-[50%] text-9xl font-bold">
            Offline
          </div>
          <div className="absolute top-[50%] mt-0 h-[40%] pt-0 text-6xl font-semibold">
            See you soon 🤞
          </div>
        </motion.div>
      </main>
    </Layout>
  );
};

export default Error404;
