import { ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TAB_VALUES } from "../../product/types/constants";

function UserHeader() {
  return (
    <div className="mb-8">
      <Link
        to="/product"
        search={{ tab: TAB_VALUES.PC }}
        className="flex flex-col items-center group"
      >
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="h-8 w-8 text-orange-500 group-hover:text-orange-600 transition-colors" />
          <span className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
            TechMate
          </span>
        </div>
      </Link>
    </div>
  );
}

export default UserHeader;
