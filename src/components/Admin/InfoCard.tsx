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
    <div className="flex flex-row flex-wrap w-full -mx-2 min-w-8">
      <div className="w-full px-2 mb-4">
        <div className="relative w-full bg-white border rounded dark:bg-dark-secondary">
          <div className="p-4">
            <h3 className="text-lg font-bold">
              <a className="stretched-link" href="#" title={name}>
                {name}
              </a>
            </h3>
            <p className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
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
