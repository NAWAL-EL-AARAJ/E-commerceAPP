"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "../../components/icons";

export default function Dialog({
  titre,
  onClose,
  children,
  size = "md",
}: {
  titre: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-espresso/40 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`my-8 w-full rounded-2xl border border-line bg-white shadow-xl ${
          size === "lg" ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl text-espresso">{titre}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-taupe transition-colors hover:bg-cream hover:text-espresso"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
