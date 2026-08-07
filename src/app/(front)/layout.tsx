
import HeaderNavigation from "@/components/layout/Header/HeaderNavigation";
import header from "@/components/layout/Header/Header.module.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <div className={header.containerBarNav}>
          <HeaderNavigation role={1} />
        </div>
        <div>{children}</div>
      </>
  );
}
//IO
