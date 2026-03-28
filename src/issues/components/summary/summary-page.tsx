import { notFound } from 'next/navigation';
import { getReportSummaryByIssueId } from '@/lib/services/report.service';
import ConclusionSection from './conclusion/conclusion-section';
import RankingList from './ranking/ranking-list';
import VoteResult from './vote-result/vote-result';
import WordCloud from './word-cloud/word-cloud';
import styles from './summary-page.module.css';

export const dynamic = 'force-dynamic';

export default async function IssueSummaryPage({ params }: { params: Promise<{ issueId: string }> }) {
  const { issueId } = await params;
  const report = await getReportSummaryByIssueId(issueId);

  if (!report) notFound();

  const selectedIdeaTitle = report.selectedIdea?.content ?? '선택된 아이디어가 없습니다';
  const selectedIdeaVotes = report.selectedIdea?.voteCount ?? 0;
  const candidateCount = report.rankings.all.length;
  const memo = report.memo ?? undefined;

  const Ranking = {
    normal: report.rankings.all,
    byCategory: report.rankings.byCategory,
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <ConclusionSection
          title={selectedIdeaTitle}
          votes={selectedIdeaVotes}
          candidates={candidateCount}
          memo={memo}
        />
        <div className={styles.wordCloudAndVoteBox}>
          <div className={`${styles.componentBox} ${styles.componentBoxFlex2}`}>
            <WordCloud />
          </div>
          <div className={`${styles.componentBox} ${styles.componentBoxFlex1}`}>
            <VoteResult
              participants={report.statistics.totalParticipants}
              totalVotes={report.statistics.totalVotes}
              maxCommentCount={report.statistics.maxCommentCount}
            />
          </div>
        </div>
        <RankingList
          normalRankings={Ranking.normal}
          categorizedRankings={Ranking.byCategory}
        />
      </div>
    </div>
  );
}
