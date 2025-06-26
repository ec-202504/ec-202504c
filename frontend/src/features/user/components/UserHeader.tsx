import { Link } from "@tanstack/react-router";
import { TAB_VALUES } from "../../product/types/constants";

function UserHeader() {
  return (
    <Link
      to="/product"
      search={{ tab: TAB_VALUES.PC }}
      className="flex flex-col items-center group"
    >
      <img src="/icon.svg" alt="Tech Mate" className="w-56" />
    </Link>
  );
}

export default UserHeader;
