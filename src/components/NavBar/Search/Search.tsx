import { useEffect, useRef } from "react";
import "./search.css"

type SearchProps = {
  query: string;
  setQuery: (query: string) => void;
}

const Search = ({ query, setQuery }: SearchProps) => {

  const inputEl = useRef<HTMLInputElement>(null);

  /* Effects */
  // Siedeffect that focuses the input element when the component mounts
  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  }, []);

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
};

export default Search;
