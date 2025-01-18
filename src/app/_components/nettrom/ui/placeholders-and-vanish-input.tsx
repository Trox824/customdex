"use client";

import { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";

interface Props {
  placeholders: string[];
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className,
}: Props) {
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [value, setValue] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setPlaceholder(placeholders[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onSubmit={onSubmit}
      className={className}
    />
  );
}
