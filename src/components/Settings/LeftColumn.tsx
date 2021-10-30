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
          key={option}
          className={`${
            option === settings ? 'font-semibold' : ''
          } text-xl cursor-pointer pb-2`}
          onClick={() => setSettings(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default LeftColumn;
