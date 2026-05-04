export const queryKeys = {
  projects: {
    all: () => ['projects'] as const,
    detail: (projectId: string) => ['project', projectId] as const,
  },
  issues: {
    detail: (issueId: string) => ['issues', issueId] as const,
    ideas: (issueId: string) => ['issues', issueId, 'ideas'] as const,
    ideaDetail: (issueId: string, ideaId: string) => ['issues', issueId, 'ideas', ideaId] as const,
    categories: (issueId: string) => ['issues', issueId, 'categories'] as const,
    members: (issueId: string) => ['issues', issueId, 'members'] as const,
    selectedIdea: (issueId: string) => ['issues', issueId, 'selected-idea'] as const,
  },
  topics: {
    detail: (topicId: string) => ['topics', topicId] as const,
    issues: (topicId: string) => ['topics', topicId, 'issues'] as const,
    nodes: (topicId: string) => ['topics', topicId, 'nodes'] as const,
    connections: (topicId: string) => ['topics', topicId, 'connections'] as const,
  },
  comments: {
    list: (issueId: string, ideaId: string) => ['comments', issueId, ideaId] as const,
  },
};
