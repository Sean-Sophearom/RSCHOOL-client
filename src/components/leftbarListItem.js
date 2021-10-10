//mui icons
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const items = [
  {
    title: "Home",
    content: [
      {
        icon: <HomeIcon fontSize="small" />,
        name: "Homepage",
        link: "/home",
      },
    ],
  },
  {
    title: "Students",
    content: [
      {
        icon: <GroupIcon fontSize="small" />,
        name: "All Students",
        link: "/students",
      },
      {
        icon: <PersonAddAlt1Icon fontSize="small" />,
        name: "Add Student",
        link: "/students/add",
      },
    ],
  },
  {
    title: "Exercise",
    content: [
      {
        icon: <MenuBookIcon fontSize="small" />,
        name: "All Chapters",
        link: "/Chapters",
      },
    ],
  },
];
export default items;
