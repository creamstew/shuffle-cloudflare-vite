import type { User } from "@/types/User";
import { useCallback, useState } from "react";
import useSWR from "swr";

type JobListProps = {
  job: string;
  users: User[];
};

const JobList = ({ job, users }: JobListProps) => {
  const filteredUsers = users.filter((user) => user.job === job);

  return (
    <div>
      <h4>職種: {job}</h4>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.name}>
            {user.name} - ({user.department})
          </li>
        ))}
      </ul>
    </div>
  );
};

const useShuffleAndGroupUsers = (
  data: User[] | undefined,
  numGroups: number
) => {
  if (!data) {
    return () => [];
  }
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: User[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // Shuffle and group logic
  const shuffleAndGroupUsers = () => {
    const shuffledUsers = shuffleArray([...data]);
    const numUsers = shuffledUsers.length;
    const numGroupsToCreate = Math.min(numGroups, numUsers);
    const result: User[][] = Array.from(
      { length: numGroupsToCreate },
      () => []
    );
    const buckets: Record<string, User[]> = {};

    shuffledUsers.forEach((user) => {
      const key = user.job + user.department;
      buckets[key] = (buckets[key] || []).concat(user);
    });

    let currentGroupIndex = 0;
    const assignUserToGroup = (user: User) => {
      result[currentGroupIndex].push(user);
      currentGroupIndex = (currentGroupIndex + 1) % numGroupsToCreate;
    };
    Object.values(buckets).forEach((bucket) => {
      bucket.forEach(assignUserToGroup);
    });

    return result;
  };

  return shuffleAndGroupUsers;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DEFAULT_NUM_GROUPS = 2;

function App() {
  const { data, error, isLoading } = useSWR<User[]>("/api/users", fetcher);
  const [groups, setGroups] = useState<User[][]>([]);
  const [numGroups, setNumGroups] = useState<number>(DEFAULT_NUM_GROUPS);
  const [isMembersVisible, setIsMembersVisible] = useState(false);

  const shuffleAndGroupUsers = useShuffleAndGroupUsers(data, numGroups);

  const handleShuffle = useCallback(
    () => setGroups(shuffleAndGroupUsers()),
    [shuffleAndGroupUsers]
  );

  if (error) return <div>failed to load</div>;
  if (isLoading || !data) return <div>loading...</div>;

  const jobs = Array.from(new Set(data.map((user) => user.job)));

  return (
    <div>
      <h3 onClick={() => setIsMembersVisible((prev) => !prev)}>
        メンバー (クリックして表示)
      </h3>
      {isMembersVisible &&
        jobs.map((job, jobIdx) => (
          <JobList key={jobIdx} job={job} users={data} />
        ))}
      <div>
        <label>グループ数: </label>
        <input
          type="number"
          value={numGroups}
          onChange={(e) => setNumGroups(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleShuffle}>シャッフル</button>
      <h3>シャッフル結果</h3>
      <div>
        {groups.map((group, idx) => (
          <div key={idx}>
            グループ{idx + 1}: {group.map((p) => p.name).join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
