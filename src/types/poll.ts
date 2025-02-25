
export type PollType = 'public' | 'secret';
export type PollStatus = 'open' | 'closed';

export interface Poll {
  id: string;
  title: string;
  description: string;
  type: PollType;
  status: PollStatus;
  created_at: string;
  closed_at: string | null;
  auto_close_at: string | null;
  created_by: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  title: string;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

export interface PollResult {
  poll_id: string;
  poll_title: string;
  poll_type: PollType;
  option_id: string;
  option_title: string;
  vote_count: number;
}
