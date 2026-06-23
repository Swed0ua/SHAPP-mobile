import { useEffect, useState } from "react";

export function useDebouncedSearch<T>(
  query: string,
  search: (normalizedQuery: string) => Promise<T>,
  delayMs: number,
  initialValue: T,
): { readonly results: T; readonly isLoading: boolean } {
  const [results, setResults] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();
    let isCancelled = false;

    if (!normalizedQuery) {
      setResults(initialValue);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      void search(normalizedQuery)
        .then((items) => {
          if (!isCancelled) {
            setResults(items);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    }, delayMs);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [delayMs, initialValue, query, search]);

  return { results, isLoading };
}
