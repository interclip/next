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
    <div className="flex flex-row flex-wrap -mx-2 min-w-8 w-full">
      <div className="mb-4 px-2 w-full">
        <div className="relative bg-white dark:bg-dark-secondary rounded border w-full">
          <div className="p-4">
            <h3 className="text-lg font-bold">
              <a className="stretched-link" href="#" title="Card 1">
                {name}
              </a>
            </h3>
            <p className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
            {value}
            <p>{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
