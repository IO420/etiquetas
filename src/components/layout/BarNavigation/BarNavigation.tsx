"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import "./BarNavigation.css";
import Image from "next/image";

const MENU_ITEMS = [
  // {
  //   title: "Reportes",
  //   items: [
  //     { label: "Reportes", path: "/Reportes" },
  //     { label: "Inscritos", path: "/Inscritos" },
  //   ],
  // },
  {
    title: "Etiquetas",
    path: "/labels",
  },
  {
    title: "Etiquetas de lapices",
    path: "/pencilLabel",
  },
  {
    title: "Portadas",
    path: "/covers",
  },
  {
    icon: "/heart.png",
    title: "Mis diseños",
    path: "/favorite",
  },
];

export default function BarNavigation() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const periodo = searchParams.get("periodo");

  const withPeriodo = (path: string) =>
    periodo ? `${path}?periodo=${periodo}` : path;

  const isActive = (path: string) => pathname.startsWith(path);

  const toggleMenu = () => setOpenMenu(!openMenu);

  const toggleSubMenu = (index: number) => {
    if (typeof window !== "undefined" && window.innerWidth <= 1000) {
      setOpenSubMenu(openSubMenu === index ? null : index);
    }
  };

  const closeAllMenus = () => {
    setOpenMenu(false);
    setOpenSubMenu(null);
  };

  return (
    <nav className="barNavigation">
      <div className={`menuToggle ${openMenu ? "" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={openMenu ? "active" : ""}>
        {MENU_ITEMS.map((item: any, index) => {
          if (item.items) {
            const hasActiveChild = item.items.some((sub: any) =>
              isActive(sub.path),
            );

            return (
              <li
                key={index}
                className={`subMenu ${openSubMenu === index ? "open" : ""} ${
                  hasActiveChild ? "active" : ""
                }`}
              >
                <span onClick={() => toggleSubMenu(index)}>{item.title}</span>
                <ul onClick={toggleMenu}>
                  {item.items.map((subItem: any) => (
                    <Link
                      key={subItem.path}
                      href={withPeriodo(subItem.path)}
                      className="links"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeAllMenus();
                      }}
                    >
                      <li>{subItem.label}</li>
                    </Link>
                  ))}
                </ul>
              </li>
            );
          }

          return (
            <li
              key={item.path}
              className={`subMenu ${isActive(item.path) ? "active" : ""}`}
              onClick={toggleMenu}
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={20}
                  height={20}
                />
              )}
              <Link
                href={withPeriodo(item.path)}
                className="links"
                onClick={(e) => {
                  e.stopPropagation();
                  closeAllMenus();
                }}
              >
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
//IO
