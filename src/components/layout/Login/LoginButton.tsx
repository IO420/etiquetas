"use client";

import { useRouter } from "next/navigation";

import style from "./LoginButton.module.css";
import Image from "next/image";
export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {};

  return (
    <button type="button" onClick={handleLogin} className={style.loginButton}>
      <Image src="/tienda.png" height={15} width={15} alt="tienda" />
      Iniciar Sesion
    </button>
  );
}
