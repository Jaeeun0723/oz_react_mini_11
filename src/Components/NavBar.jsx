import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

export default function NavBar() {
  const [movieList, setMovieList] = useState([]);
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setMovieList([]);
      setSearchParams({});
      return;
    }

    setSearchParams({ query: debouncedInput });

    const fetchSearchResults = async () => {
      const token = import.meta.env.VITE_API_TOKEN;
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${apiUrl}search/movie?query=${debouncedInput}&language=ko-KR&page=1`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setMovieList(data);
    };

    fetchSearchResults();
  }, [debouncedInput]);

  return (
    <div className="flex items-center bg-white h-[40px] px-4">
      {/* 왼쪽: 로고 */}
      <div className="flex-1">
        <Link to="/" className="text-sm" onClick={() => setInput("")}>
          잼은TV
        </Link>
      </div>

      {/* 가운데: 검색창 */}
      <div className="flex-2 relative">
        <input
          className="w-full h-[25px] text-white bg-gray-800 rounded-[10px] px-2 text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {movieList.results && movieList.results.length > 0 && (
          <ul className="absolute top-[33px] left-0 w-full bg-gray-800 text-white rounded-b-md shadow-md z-10 text-xs">
            {movieList.results.map((movie) => (
              <li key={movie.id} className="p-2 hover:bg-gray-700">
                <Link
                  to={`/detail/${movie.id}`}
                  className="block w-full h-full"
                  onClick={() => setMovieList([])}
                >
                  {movie.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex-1 flex justify-end gap-3 text-sm">
        <div>로그인</div>
        <div>회원가입</div>
      </div>
    </div>
  );
}
