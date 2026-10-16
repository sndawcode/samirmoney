"use client";

import { useEffect } from "react";

type NetworkInformation = { saveData?: boolean };

/** Sets `data-save-data` on <html> when the visitor asked to save data: ambient effects switch off (§6). */
export function SaveDataFlag() {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData) document.documentElement.dataset.saveData = "";
  }, []);
  return null;
}
