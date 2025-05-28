import React from 'react';

export type Practice = {
  id: string | number;
  name: string;
  description: string;
};

type Props = {
  practices: Practice[];
};

const SEPracticesList: React.FC<Props> = ({ practices }) => {
  if (!practices.length) {
    return <div>No practices available</div>;
  }
  return (
    <div>
      {practices.map((practice) => (
        <div key={practice.id}>{practice.name}</div>
      ))}
    </div>
  );
};

export default SEPracticesList;