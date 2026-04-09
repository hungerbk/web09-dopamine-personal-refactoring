import { useParams } from 'next/navigation';

export const useIssueId = () => {
  const params = useParams<{ issueId: string }>();
  return params.issueId;
};
