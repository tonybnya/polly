"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function SuccessNotification() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && searchParams.get("success") === "true") {
      toast.success("Poll created successfully!", {
        description: "Your poll has been created and is ready for voting.",
      });
    }
  }, [searchParams, isMounted]);

  return null;
}
