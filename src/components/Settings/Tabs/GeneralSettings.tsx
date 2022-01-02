import { Input } from '@components/Input';
import { Dialog, Transition } from '@headlessui/react';
import { APIError } from '@utils/api/requestClip';
import { setSettings } from '@utils/api/setSetting';
import React, { Fragment, useState } from 'react';
import toast from 'react-hot-toast';

import SettingsCard from '../SettingsCard';

const GeneralSettings = ({
  username,
  name,
  email,
}: {
  username?: string;
  name?: string;
  email?: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newUsername, setNewUsersname] = useState<string>(username || '');
  const [newName, setNewName] = useState<string>(name || '');

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
              className="inline-block h-screen align-middle"
              aria-hidden="true"
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl transition-all transform dark:bg-dark-secondary dark:text-dark-text rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium text-gray-900 leading-6 dark:text-dark-text"
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
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => setIsOpen(false)}
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
        title="Your Username"
        footerDescription="Please use 48 characters at maximum."
        onSave={async () => {
          try {
            await setSettings({ username: newUsername });
          } catch (e) {
            if (e instanceof APIError) {
              toast.error(e.message);
            } else {
              // @ts-ignore
              toast.error(e);
            }
          }
        }}
      >
        <div className="max-w-[50%]">
          <Input
            value={newUsername}
            onChange={(e) => setNewUsersname(e.target.value)}
            maxLength={48}
          />
        </div>
      </SettingsCard>
      <SettingsCard
        title="Your Name"
        description="Please enter your full name, or a display name you are comfortable
              with."
        footerDescription="Please use 32 characters at maximum."
        onSave={async () => {
          await setSettings({ name: newName });
        }}
      >
        <div className="max-w-[50%]">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={32}
          />
        </div>
      </SettingsCard>{' '}
      <SettingsCard
        title="Your Email"
        description="Your email address cannot be changed."
      >
        <div className="max-w-[50%]">
          <Input disabled value={email} />
        </div>
      </SettingsCard>{' '}
      <SettingsCard
        title="Delete Personal Account"
        dangerous
        buttonText="Delete Personal Account"
        onSave={async () => {
          setIsOpen(true);
        }}
      >
        Permanently remove your account and all of its contents from Interclip.
        This action is not reversible, so please continue with caution.
      </SettingsCard>
    </>
  );
};

export default GeneralSettings;
