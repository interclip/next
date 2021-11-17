import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar';
import { useTheme } from 'next-themes';
import React from 'react';

import actions from './Actions';
import RenderResults from './RenderResults';

const Kbar: React.FC = ({ children }) => {
  const { setTheme } = useTheme();

  return (
    <KBarProvider actions={actions({ setTheme })}>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator className="max-w-[600px] w-full rounded-[8px] bg-white dark:bg-dark-secondary overflow-hidden shadow-xl text-black dark:text-dark-text">
            <KBarSearch className="px-[16px] py-[12px] text-[16px] w-full outline-none border-none " />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};

export default Kbar;
