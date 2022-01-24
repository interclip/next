import React from 'react';

const InfoCard = ({
  name,
  value,
  description,
  children,
}: {
  name: string;
  value?: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="min-w-8 -mx-2 flex w-full flex-row flex-wrap">
      <div className="mb-4 w-full px-2">
        <div className="relative w-full rounded border bg-white dark:bg-dark-secondary">
          <div className="p-4">
            <h3 className="text-lg font-bold">
              <a className="stretched-link" href="#" title={name}>
                {name}
              </a>
            </h3>
            <p className="mb-2 block text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
            <span>{value}</span>
            <p>{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
