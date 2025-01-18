import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  href: string;
  name: string;
  position: number;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <ul
      className="mb-2 inline-flex items-center gap-4"
      itemType="http://schema.org/BreadcrumbList"
    >
      {items.map((item, index, arr) => {
        const isLast = index === arr.length - 1;
        return (
          <React.Fragment key={index}>
            <li
              itemProp="itemListElement"
              itemType="http://schema.org/ListItem"
            >
              <Link
                href={item.href}
                className="text-[#2980b9] transition hover:text-web-titleLighter"
              >
                <span itemProp="name">{item.name}</span>
              </Link>
              <meta itemProp="position" content={item.position.toString()} />
            </li>
            {!isLast && (
              <li className="text-muted-foreground" key={"divider_" + index}>
                /
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default Breadcrumb;
