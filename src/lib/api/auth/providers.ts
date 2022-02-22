import { createUser } from '@utils/api/createUser';
import { IS_PROD, StorageProvider } from '@utils/constants';
import { db } from '@utils/prisma';
import { getDefaultProvider, utils } from 'ethers';
import { name } from 'faker';
import CredentialsProvider from 'next-auth/providers/credentials';
import isEmail from 'validator/lib/isEmail';

export const DemoProvider = CredentialsProvider({
  id: 'devlogin',
  name: 'a demo account',
  credentials: {
    email: {
      label: 'Email address',
      type: 'text',
      placeholder: 'admin@example.org',
    },
  },
  async authorize(credentials) {
    if (credentials?.email && isEmail(credentials.email)) {
      const existingUser = await db.user.findUnique({
        where: {
          email: credentials.email,
        },
      });
      return (
        existingUser ||
        (await createUser({
          email: credentials.email,
          name: name.firstName(),
          isStaff: true,
          storageProvider: StorageProvider.S3,
        }))
      );
    }

    // Return null if user data could not be retrieved
    return null;
  },
});

export const Web3Provider = CredentialsProvider({
  name: 'Web3',
  id: 'web3',
  authorize: async (credentials) => {
    if (!(credentials?.address && credentials.nonce && credentials.signature)) {
      return null;
    }

    const address = utils.verifyMessage(
      credentials.nonce,
      credentials.signature,
    );

    if (address.toLowerCase() !== credentials.address.toLowerCase()) {
      console.error(
        `Adresses don't match: ${address} vs ${credentials.address}`,
      );
      return null;
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: credentials.address,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const provider = getDefaultProvider();
    const ensName = await provider.lookupAddress(address);

    let name, avatar;
    if (ensName) {
      const resolver = await provider.getResolver(ensName);
      if (resolver) {
        avatar = (await resolver.getAvatar())?.url || undefined;
        name = (await resolver.getText('name')) || undefined;
      }
    }

    return await createUser({
      email: credentials.address,
      username: ensName || credentials.address.slice(2, 18),
      image: avatar,
      isStaff: !IS_PROD,
      name,
      storageProvider: StorageProvider.IPFS,
    });
  },
  type: 'credentials',
  credentials: {
    address: {
      label: 'Web3 address',
      type: 'text',
    },
    nonce: {
      type: 'text',
    },
    signature: {
      type: 'text',
    },
  },
});
