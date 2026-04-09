import { STATUS_LABEL } from '@/constants/issue';
import { IssueStatus } from '@/issues/types';
import * as S from './sidebar';

interface SidebarItemProps {
  isTopic?: boolean;
  title: string;
  href: string;
  status?: IssueStatus;
}

export default function SidebarItem({ isTopic, title, href, status }: SidebarItemProps) {
  return (
    <S.SidebarListItem>
      <S.ListItemLink href={href}>
        {isTopic && <S.Bullet />}
        <span>{title.length > 12 ? title.slice(0, 10) + '...' : title}</span>
        {status && <S.StatusLabel status={status}>{STATUS_LABEL[status]}</S.StatusLabel>}
      </S.ListItemLink>
    </S.SidebarListItem>
  );
}
