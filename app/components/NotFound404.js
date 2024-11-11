import React from "react";
import Link from "next/link";

export default function NotFound404() {
  return (
    <div className="flex flex-col justify-center items-center h-[400px] text-2xl font-bold">
      <div>404 - No Page Found</div>
      <p className="text-xl mt-16 text-center">
        Click here for a surprise:{" "}
        <Link
          href="https://moisestrejo.com/egg"
          className="text-blue-500 hover:underline"
        >
          moisestrejo.com/egg
        </Link>
      </p>
    </div>
  );
}
