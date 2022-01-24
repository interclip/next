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
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.15 }}
          key="modal"
          className="z-200 absolute top-0 left-0 flex h-screen w-screen items-center overflow-hidden backdrop-blur-sm backdrop-filter"
          onClick={() => {
            setQrCodeZoom(false);
          }}
        >
          <div className="shadow-custom m-auto rounded-2xl bg-white p-4">
            <QRCode value={url} size={size} level="M" />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
};

export default QRModal;
