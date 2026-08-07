"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import style from "./searchLabel.module.css";

interface UrlProp {
  value: string | null;
}

export default function SearchLabels({ value }: UrlProp) {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearch(value ?? "");
  }, [value]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.searchBox}>
        <Image
          src="/buscar.png"
          alt="Buscar"
          width={18}
          height={18}
          className={style.icon}
        />

        <input
          type="text"
          className={style.search}
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className={style.clear}
            onClick={() => setSearch("")}
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
//IO