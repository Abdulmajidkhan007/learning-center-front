import { useQuery } from '@tanstack/react-query'
import { fetchStudentOptions } from '../api/invoiceApi'

/** Yangi hisob formasidagi o'quvchi ro'yxati. */
export function useStudentOptions(token: string) {
    const query = useQuery({
        queryKey: ['student', 'options'] as const,
        queryFn: () => fetchStudentOptions(token),
        staleTime: 5 * 60_000,
    })
    return query.data ?? []
}
