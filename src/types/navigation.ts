export type NavNode = {
  id: string;
  title: string;
  content: string;
  links: string[];
};

export type HistoryEntry = {
  nodeId: string;
  timestamp: number;
  label: string;
};
