
type MoviesContainerProps = {
  children: React.ReactNode;
};

const MoviesContainer = ({ children }: MoviesContainerProps) => {
  return <main className='main'>{children}</main>;
};

export default MoviesContainer;
