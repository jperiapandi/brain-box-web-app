import type { PropsWithChildren } from "react";
import { Link } from "react-router";
import Profile from "../Profile";

type PageHeaderProps = PropsWithChildren & {
  title: string;
  subTitle?: string;
  navBack?: boolean;
  profile?: boolean;
};
export default function PageHeader({
  title,
  subTitle,
  navBack,
  profile = true,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      {navBack && (
        <nav className="nav-left-container">
          <Link to={"/"}>
            <span className="material-symbols-rounded">arrow_back</span>
          </Link>
        </nav>
      )}

      <div className="title-container">
        <h1 className="title">{title}</h1>
        {subTitle && subTitle != "" && (
          <h2 className="sub-title">{subTitle}</h2>
        )}
      </div>
      {profile && (
        <div>
          <Profile />
        </div>
      )}
    </header>
  );
}
