import { db } from '@utils/prisma';
import { NextApiRequest } from 'next';

const Redirect = () => {
  return <></>;
};

export async function getServerSideProps({
  query,
}: {
  query: NextApiRequest['query'];
}) {
  const userCode = query.code;
  if (userCode && typeof userCode === 'object') {
    return { notFound: true };
  }

  try {
    const selectedClip = await db.clip.findUnique({
      where: { code: userCode },
    });
    if (!selectedClip) {
      return { notFound: true };
    }
    return {
      redirect: {
        destination: selectedClip.url,
        permanent: true,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default Redirect;
