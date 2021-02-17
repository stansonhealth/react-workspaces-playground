import React from 'react';
import './CompOne.css';

interface Props {
  name?: string;
}

const CompOne: React.FC<Props> = (props) => {

  console.log(props);

  return (
    <div className="Comp">
      <h3>
        <span role="img" aria-label="React Logo">
          ⚛️
        </span>
        {props.name}
      </h3>
    </div>
  );
};

export default CompOne;
