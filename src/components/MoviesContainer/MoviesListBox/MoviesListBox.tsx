import { useState } from 'react';

type MoviesListBoxProps = {
  children: React.ReactNode;
};

const MoviesListBox = ({ children }: MoviesListBoxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
};

export default MoviesListBox;
