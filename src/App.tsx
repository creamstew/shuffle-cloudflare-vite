import type { Person } from "@/types/Person";
import { useState } from "react";
import useSWR from "swr";

type JobListProps = {
  job: string;
  people: Person[];
};

const JobList = ({ job, people }: JobListProps) => {
  const filteredPeople = people.filter((person) => person.job === job);

  return (
    <div>
      <h4>職種: {job}</h4>
      <ul>
        {filteredPeople.map((person) => (
          <li key={person.name}>
            {person.name} - ({person.department})
          </li>
        ))}
      </ul>
    </div>
  );
};

const useShuffleAndGroupPeople = (
  data: Person[] | undefined,
  numGroups: number
) => {
  if (!data) {
    return () => [];
  }
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: Person[]) => {
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
  const shuffleAndGroupPeople = () => {
    const shuffledPeople = shuffleArray([...data]);
    const numPeople = shuffledPeople.length;
    const numGroupsToCreate = Math.min(numGroups, numPeople);
    const result: Person[][] = Array.from(
      { length: numGroupsToCreate },
      () => []
    );
    const buckets: Record<string, Person[]> = {};

    shuffledPeople.forEach((person) => {
      const key = person.job + person.department;
      buckets[key] = (buckets[key] || []).concat(person);
    });

    let currentGroupIndex = 0;
    const assignPersonToGroup = (person: Person) => {
      result[currentGroupIndex].push(person);
      currentGroupIndex = (currentGroupIndex + 1) % numGroupsToCreate;
    };
    Object.values(buckets).forEach((bucket) => {
      bucket.forEach(assignPersonToGroup);
    });

    return result;
  };

  return shuffleAndGroupPeople;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function App() {
  const { data, error, isLoading } = useSWR<Person[]>("/api/people", fetcher);
  const [groups, setGroups] = useState<Person[][]>([]);
  const [numGroups, setNumGroups] = useState<number>(2);
  const [isMembersVisible, setIsMembersVisible] = useState(false);

  const shuffleAndGroupPeople = useShuffleAndGroupPeople(data, numGroups);

  const handleShuffle = () => setGroups(shuffleAndGroupPeople());

  if (error) return <div>failed to load</div>;
  if (isLoading || !data) return <div>loading...</div>;

  const jobs = Array.from(new Set(data.map((person) => person.job)));

  return (
    <div>
      <h3 onClick={() => setIsMembersVisible((prev) => !prev)}>
        メンバー (クリックして表示)
      </h3>
      {isMembersVisible &&
        jobs.map((job, jobIdx) => (
          <JobList key={jobIdx} job={job} people={data} />
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
