import { Input } from '@components/Input';
import { Dialog, Transition } from '@headlessui/react';
import { Switch } from '@headlessui/react';
import { User } from '@prisma/client';
import { deleteAccount } from '@utils/api/client/deleteUser';
import {
  maxNameAllowedLength,
  maxUsernameAllowedLength,
} from '@utils/constants';
import { recoverPersonalSignature } from 'eth-sig-util';
import { signOut } from 'next-auth/react';
import React, { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import { handleSettingsErrors } from 'src/pages/settings';
import isEthereumAddress from 'validator/lib/isEthereumAddress';
import Web3 from 'web3';

import SettingsCard from '../SettingsCard';

const GeneralSettings = ({
  user,
  setUser,
}: {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newUsername, setNewUsersname] = useState<string>(user.username || '');
  const [newName, setNewName] = useState<string>(user.name || '');
  const [signingEnabled, setClipSigningEnabled] = useState(user.clipSign);

  return (
    <>
      <Transition appear as={Fragment} show={isOpen}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              aria-hidden="true"
              className="inline-block h-screen align-middle"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-secondary dark:text-dark-text">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-text"
                >
                  Are you sure?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-dark-text">
                    There is no going back; once you delete your account, all of
                    your clips will be deasociated from your account.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={async () => {
                      await toast.promise(deleteAccount(user.email), {
                        loading: 'Deleting your account',
                        success: 'Successfully deleted your account',
                        error: "Couldn't delete your account",
                      });
                      signOut({ callbackUrl: '/' });
                    }}
                    type="button"
                  >
                    Go ahead, delete my account
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>{' '}
      <SettingsCard
        footerDescription={`Please use ${maxUsernameAllowedLength} characters at maximum.`}
        isDisabled={user.username === newUsername}
        onSave={async () => {
          const updatedDetails = await handleSettingsErrors({
            username: newUsername,
          });
          if (updatedDetails) {
            setUser({
              ...user,
              ...updatedDetails,
            });
          }
        }}
        title="Your Username"
      >
        <div className="max-w-[50%]">
          <Input
            maxLength={maxUsernameAllowedLength}
            onChange={(e) => setNewUsersname(e.target.value)}
            value={newUsername}
          />
        </div>
      </SettingsCard>
      <SettingsCard
        description="Please enter your full name, or a display name you are comfortable
              with."
        footerDescription={`Please use ${maxNameAllowedLength} characters at maximum.`}
        isDisabled={user.name === newName}
        onSave={async () => {
          const updatedDetails = await handleSettingsErrors({ name: newName });
          if (updatedDetails) {
            setUser({
              ...user,
              ...updatedDetails,
            });
          }
        }}
        title="Your Name"
      >
        <div className="max-w-[50%]">
          <Input
            maxLength={maxNameAllowedLength}
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
          />
        </div>
      </SettingsCard>{' '}
      <SettingsCard
        description={
          isEthereumAddress(user.email)
            ? 'Your attached wallet address cannot be changed'
            : 'Your email address cannot be changed.'
        }
        title={
          isEthereumAddress(user.email) ? 'Your wallet address' : 'Your Email'
        }
      >
        <div className="max-w-[50%]">
          <Input disabled value={user.email} />
        </div>
      </SettingsCard>{' '}
      {isEthereumAddress(user.email) && (
        <SettingsCard
          description="If you enable this, every clip you create will be cryptographically signed"
          isDisabled={user.clipSign === signingEnabled}
          onSave={async () => {
            if (signingEnabled) {
              if (!(window as any).ethereum) {
                toast.error('Please install Metamask to enable signing');
                return;
              }
              const web3 = new Web3((window as any).ethereum as any);
              const messageToSign = 'Setup clip signing';

              try {
                const msg = `0x${Buffer.from(messageToSign, 'utf8').toString(
                  'hex',
                )}`;

                const sign = await web3.eth.personal.sign(msg, user.email, '');
                if (sign) {
                  const recoveredAddress = recoverPersonalSignature({
                    data: msg,
                    sig: sign,
                  });
                  if (recoveredAddress === user.email) {
                    toast.success('Signing setup complete, saving');
                  }
                }
              } catch (error: any) {
                if (error.code === 4001) {
                  toast.error('Signature request rejected');
                  return;
                } else if (error.code === -32_602) {
                  toast.error(
                    'It looks like your wallet is locked, please unlock it before proceeding',
                  );
                  return;
                }
                toast.error(error as string);
              }
            }

            const updatedDetails = await handleSettingsErrors({
              clipSign: signingEnabled,
            });
            if (updatedDetails) {
              setUser({
                ...user,
                ...updatedDetails,
              });
            }
          }}
          title={'Sign your clips'}
        >
          <div className="max-w-[50%]">
            <Switch
              checked={signingEnabled}
              className={`${
                signingEnabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={setClipSigningEnabled}
            >
              <span
                className={`${
                  signingEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
          </div>
        </SettingsCard>
      )}
      <SettingsCard
        buttonText="Export"
        onSave={async () => {
          const exportRes = await fetch('/api/account/export', {
            method: 'POST',
          });

          if (exportRes.status === 429) {
            toast.error(
              'Too Many Requests. Please try again in a couple of seconds',
            );
            return;
          }

          const exportData = await exportRes.json();
          const exportElement = document.createElement('a');
          exportElement.download = `interclip_data_export${new Date().toISOString()}.json`;

          const dataBlob = new Blob([JSON.stringify(exportData)], {
            type: 'application/json',
          });
          exportElement.href = URL.createObjectURL(dataBlob);
          exportElement.click();
        }}
        title="Export personal data"
      >
        Download all data associated with your account. This includes your
        preferences and clips
      </SettingsCard>
      <SettingsCard
        buttonText="Delete Personal Account"
        dangerous
        onSave={async () => {
          setIsOpen(true);
        }}
        title="Delete Personal Account"
      >
        Permanently remove your account and all of its contents from Interclip.
        This action is not reversible, so please continue with caution.
      </SettingsCard>
    </>
  );
};

export default GeneralSettings;
