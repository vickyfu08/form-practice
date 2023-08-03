import { Link } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avertro demo",
  description: "Coding challenge",
};
const Home = () => {
  return <Link href="/security-strategy">Settings</Link>;
};
export default Home;
