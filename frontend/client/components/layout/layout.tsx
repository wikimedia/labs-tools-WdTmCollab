"use client";

import { type PropsWithChildren } from "react";
import Header from "./header";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <div className="w-full"> {children} </div>
    </div>
  )
}