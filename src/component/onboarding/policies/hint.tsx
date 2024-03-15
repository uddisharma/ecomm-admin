import React from 'react';
import { Text } from 'rizzui';

const Hint1 = () => {
  return (
    <div className="p-5">
      <iframe
        width={'100%'}
        height={'400px'}
        src={`https://www.youtube.com/embed/BWrgGQTwuMo`}
        title="YouTube Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Hint1;
