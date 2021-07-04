import Link from "next/link"
import Navigation from "./header.nav"

const Header = () => (
  <header className="col-start-2 mb:row-start-1 mt-1 mb:pl-4 mb:pr-4 mb:mt-3">
    <h2 className="text-3xl font-medium">
      <Link href="/">
        <a>Joey</a>
      </Link>
    </h2>
    <Navigation />
  </header>
)

export default Header