import React, { useEffect, useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import type { LeaderboardEntry } from '../types';
import { registrationService } from '../services';

export const ReferralLeaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    registrationService.getLeaderboard().then((res) => {
      if (!isMounted) return;
      if (res.success && res.leaderboard) {
        setLeaders(res.leaderboard);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || leaders.length === 0) {
    return null; // Keep compact if no referrals yet
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Trophy className="h-4.5 w-4.5 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">Top Student Ambassadors</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
          Community
        </span>
      </div>

      <div className="space-y-2.5">
        {leaders.slice(0, 5).map((entry, index) => (
          <div
            key={entry.referralCode}
            className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50/70 border border-slate-100"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                index === 0
                  ? 'bg-amber-100 text-amber-700'
                  : index === 1
                  ? 'bg-slate-200 text-slate-700'
                  : index === 2
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}>
                {index + 1}
              </span>
              <div className="min-w-0">
                <span className="font-semibold text-slate-900 truncate block">
                  {entry.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate block">
                  {entry.collegeName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              <Users className="h-3 w-3" />
              <span>{entry.referralCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
