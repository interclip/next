import { useWindowSize } from '@utils/hooks/useWindowSize';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import QRCode from 'react-qr-code';

const QRModal = (props: {
  url: string;
  setQrCodeZoom: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const [width, height] = useWindowSize();

  const { url, setQrCodeZoom } = props;
  const size = Math.min(520, width - width * 0.17, height - height * 0.17);
  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="text-center"
      initial={{ opacity: 0 }}
    >
      {/*@ts-ignore*/}
      <AnimatePresence>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="z-200 absolute top-0 left-0 flex h-screen w-screen items-center overflow-hidden backdrop-blur-sm backdrop-filter"
          exit={{ opacity: 0, scale: 0 }}
          initial={{ opacity: 0, scale: 0 }}
          key="modal"
          onClick={() => {
            setQrCodeZoom(false);
          }}
          transition={{ duration: 0.15 }}
        >
          <div className="shadow-custom m-auto rounded-2xl bg-white p-4">
            <QRCode level="M" size={size} value={url} />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
};

export default QRModal;
