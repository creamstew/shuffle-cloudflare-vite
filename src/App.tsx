import { useState } from "react";

type Person = {
  name: string;
  job: string;
  department: string;
};

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

const useShuffleAndGroupPeople = (data: Person[], numGroups: number) => {
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

const data: Person[] = [
  {
    name: "山田 太郎",
    job: "エンジニア",
    department: "プロダクト事業部",
  },
  {
    name: "佐藤 次郎",
    job: "エンジニア",
    department: "プロダクト事業部",
  },
  {
    name: "鈴木 三郎",
    job: "エンジニア",
    department: "プロダクト事業部",
  },
  {
    name: "高橋 四郎",
    job: "エンジニア",
    department: "プロダクト事業部",
  },
  {
    name: "田中 五郎",
    job: "エンジニア",
    department: "プロダクト事業部",
  },
  {
    name: "伊藤 六郎",
    job: "デザイナー",
    department: "プロダクト事業部",
  },
  {
    name: "渡辺 七郎",
    job: "デザイナー",
    department: "プロダクト事業部",
  },
  {
    name: "山本 八郎",
    job: "デザイナー",
    department: "プロダクト事業部",
  },
  {
    name: "中村 九郎",
    job: "セールス",
    department: "セールス事業部",
  },
  {
    name: "小林 十郎",
    job: "セールス",
    department: "セールス事業部",
  },
  {
    name: "加藤 十一郎",
    job: "セールス",
    department: "セールス事業部",
  },
  {
    name: "吉田 十二郎",
    job: "セールス",
    department: "セールス事業部",
  },
];

function App() {
  const [groups, setGroups] = useState<Person[][]>([]);
  const [numGroups, setNumGroups] = useState<number>(2);
  const [isMembersVisible, setIsMembersVisible] = useState(false);

  const shuffleAndGroupPeople = useShuffleAndGroupPeople(data, numGroups);

  const handleShuffle = () => setGroups(shuffleAndGroupPeople());

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
