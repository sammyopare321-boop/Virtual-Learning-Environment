"use client";

import { useCallback, useEffect, useState } from "react";
import { errorMessage, unwrap } from "@/utils/formatters";

export function useFetch(loader, deps = []) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await loader();
      setData(unwrap(response));
      setMeta({
        count: response?.data?.count,
        page: response?.data?.page,
        totalPages: response?.data?.totalPages
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, meta, loading, error, reload: load, setData };
}
