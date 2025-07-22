import type { PropsWithChildren } from "react";
import { Link } from "react-router";

type PageHeaderProps = PropsWithChildren & {
  title: string;
  subTitle?: string;
  navBack?: boolean;
};
export default function PageHeader({
  title,
  subTitle,
  navBack,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      {navBack && (
        <nav className="nav-back-container">
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
    </header>
  );
}
