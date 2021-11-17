import { KBarResults, useMatches } from 'kbar';
import React from 'react';

const RenderResults = () => {
  const groups = useMatches();
  const flattened = React.useMemo(
    () =>
      groups.reduce((acc, curr) => {
        // @ts-ignore
        acc.push(curr.name);
        // @ts-ignore
        acc.push(...curr.actions);
        return acc;
      }, []),
    [groups],
  );

  return (
    <KBarResults
      items={flattened}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="opacity-50 py-[8px] px-[16px] uppercase text-[12px]">
            {item}
          </div>
        ) : (
          <div
            className={`py-[12px] px-[16px] flex cursor-pointer items-center justify-between ${
              active ? 'bg-gray-200 dark:bg-[#3B3B3B]' : ''
            }`}
          >
            <div className="flex gap-[8px] text-[14px] items-center">
              {item.icon && item.icon}
              <div className="flex flex-col">
                <div>
                  <span>{item.name}</span>
                </div>
                {item.subtitle && (
                  <span className="text-[12px]">{item.subtitle}</span>
                )}
              </div>
            </div>
            {item.shortcut?.length ? (
              <div
                aria-hidden
                style={{ gridAutoFlow: 'column' }}
                className="grid gap-[4px]"
              >
                {item.shortcut.map((shortcut) => (
                  <kbd
                    key={shortcut}
                    className={`py-[4px] px-[6px] ${
                      active
                        ? 'bg-gray-300 dark:bg-gray-900'
                        : 'bg-gray-200 dark:bg-black'
                    } text-black dark:text-white text-[14px] rounded-[4px]`}
                  >
                    {shortcut}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
};

export default RenderResults;
