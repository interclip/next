import { Layout } from '@components/Layout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Error404: React.FC = () => {
  return (
    <Layout>
      <section className="mt-[20%] flex h-[30em] w-full max-w-6xl items-center">
        <motion.div
          initial={{ rotate: 60, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{
            ease: 'easeOut',
            duration: 0.4,
          }}
          className="relative h-full w-full"
        >
          <Image
            src="/images/paperplane.png"
            layout="fill"
            objectFit="contain"
            objectPosition="right"
            alt="A paperplane"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: 'easeOut',
            duration: 0.6,
          }}
          className="relative flex h-full w-full flex-col text-white"
          style={{
            textShadow:
              '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          <div className="absolute bottom-[50%] text-9xl font-bold">500</div>
          <div className="absolute top-[50%] mt-0 h-[40%] pt-0 text-6xl font-semibold">
            Unexpected error
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Error404;
