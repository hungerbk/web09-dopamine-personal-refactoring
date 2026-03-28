import IssueSummaryPage from '@/issues/components/summary/summary-page'

export default function Page({ params }: { params: Promise<{ issueId: string }> }) {
  return <IssueSummaryPage params={params} />
}