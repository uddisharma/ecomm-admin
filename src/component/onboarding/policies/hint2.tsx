import React from 'react';
import { Text } from 'rizzui';

const Hint2 = () => {
  return (
    <div className="p-0">
      <iframe
        width={'100%'}
        height={'400px'}
        src={`https://www.youtube.com/embed/BWrgGQTwuMo`}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Hint2;
