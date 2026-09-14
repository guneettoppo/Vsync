import {
  QueryFunction,
  QueryKey,
  useQuery,
} from '@tanstack/react-query'

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  enabled?: boolean
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled,
  })
  return { data, isPending, isFetched, refetch, isFetching }
}
