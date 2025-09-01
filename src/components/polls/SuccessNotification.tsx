"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function SuccessNotification() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Poll created successfully!", {
        description: "Your poll has been created and is ready for voting.",
      });
    }
  }, [searchParams]);

  return null;
}
