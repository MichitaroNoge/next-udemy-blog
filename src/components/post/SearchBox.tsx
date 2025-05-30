"use client";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const [debuncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  // デバウンス
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // debouncedSearchが更新されたら実行
  useEffect(() => {
    if (debuncedSearch) {
      router.push(`/?search=${debuncedSearch.trim()}`);
    } else {
      router.push("/");
    }
  }, [debuncedSearch, router]);

  return (
    <div>
      <Input
        placeholder="記事を検索"
        className="w-[200px] lg:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
