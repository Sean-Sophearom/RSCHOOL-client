//mui icons
import HomeIcon from "@mui/icons-material/Home";
import FlagIcon from "@mui/icons-material/Flag";
import DraftsIcon from "@mui/icons-material/Drafts";
import BookIcon from "@mui/icons-material/Book";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import HelpIcon from "@mui/icons-material/Help";

const items = [
  {
    title: "home",
    content: [
      {
        icon: <HomeIcon fontSize="small" />,
        name: "home",
        link: "/home",
      },
    ],
  },
  {
    title: "notifications",
    content: [
      {
        icon: <FlagIcon fontSize="small" />,
        name: "notifications",
        link: "/notifications",
      },
      {
        icon: <DraftsIcon fontSize="small" />,
        name: "tickets",
        link: "/tickets",
      },
    ],
  },
  {
    title: "learning area",
    content: [
      {
        icon: <BookIcon fontSize="small" />,
        name: "courses",
        link: "/courses",
      },
      {
        icon: <LibraryBooksIcon fontSize="small" />,
        name: "tests",
        link: "/tests",
      },
    ],
  },
  {
    title: "information",
    content: [
      {
        icon: <LocalLibraryIcon fontSize="small" />,
        name: "learning policy",
        link: "/policy",
      },
      {
        icon: <HelpIcon fontSize="small" />,
        name: "help",
        link: "/help",
      },
    ],
  },
];
export default items;
