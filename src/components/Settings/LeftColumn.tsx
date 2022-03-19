import React from 'react';

const LeftColumn = ({
  settings,
  setSettings,
}: {
  settings: string;
  setSettings: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const options = ['General', 'Appearance', 'Storage'];

  return (
    <div className="flex flex-col px-12">
      {options.map((option: string) => (
        <div
          className={`${
            option === settings ? 'font-semibold' : ''
          } cursor-pointer pb-2 text-xl`}
          key={option}
          onClick={() => setSettings(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default LeftColumn;
