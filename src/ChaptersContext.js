import { useState, createContext } from "react";

export const chaptersContext = createContext();

export const ChaptersProvider = ({ children }) => {
  const [chapters, setChapters] = useState([]);
  return <chaptersContext.Provider value={[chapters, setChapters]}>{children}</chaptersContext.Provider>;
};
