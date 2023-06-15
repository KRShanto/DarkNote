import Link from "next/link";
import Search from "./Search";

export default function Navbar() {
  return (
    <nav id="navbar">
      <Link href="/" className="logo">
        Dark Note
      </Link>

      <Search />
    </nav>
  );
}
