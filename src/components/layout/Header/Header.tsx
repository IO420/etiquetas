import Image from "next/image";
import Link from "next/link";
import header from "./Header.module.css";
import { cookies } from "next/headers";
// import { jwtVerify } from "jose";
import HeaderNavigation from "./HeaderNavigation";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function Header() {
  // const cookieStore = cookies();
  // const token = (await cookieStore).get("token")?.value;

  let role: number = 1;

  // if (token) {
  //   try {
  //     const { payload } = await jwtVerify(token, secret);
  //     role = payload.role as number;
  //   } catch (error) {
  //     role = 5;
  //   }
  // }

  return (
    <header className={header.header}>
      <div className={header.containerLink}>

        <Link
          href="https://www.unam.mx/"
          target="_blank"
          className={`${header.center} ${header.link}`}
        >
          <div className={header.logoContainerUnam}>

          </div>
        </Link>
        <Link
          href="https://www.acatlan.unam.mx/"
          target="_blank"
          className={`${header.center} ${header.link}`}
        >
          <div className={header.logoContainer}>
          </div>
        </Link>
      </div>

      <div className={header.yellowPart}></div>
      <div className={header.containerBarNav}>
        <HeaderNavigation role={role} />
      </div>
    </header>
  );
}
//IO