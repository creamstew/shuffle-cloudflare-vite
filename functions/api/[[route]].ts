import type { User } from "@/types/User";
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

const data: User[] = [
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

const app = new Hono().basePath("/api");

app.get("/users", (c) => {
  return c.json(data);
});

// Notion API を使う場合
// type Env = {
//   Bindings: {
//     NOTION_DATABASE_ID: string;
//     NOTION_SECRET_KEY: string;
//   };
// };

// type NotionResponse = {
//   results: NotionResponseItem[];
// };

// type NotionResponseItem = {
//   properties: {
//     Name: { title: [{ plain_text: string }] };
//     job: { rich_text: [{ plain_text: string }] };
//     department: { rich_text: [{ plain_text: string }] };
//   };
// };

// const fetchNotionData = async (env: Env["Bindings"]): Promise<User[]> => {
//   const notionApiUrl = `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`;

//   const headers = {
//     Authorization: `Bearer ${env.NOTION_SECRET_KEY}`,
//     "Notion-Version": "2022-06-28",
//     "Content-Type": "application/json",
//   };

//   const response = await fetch(notionApiUrl, { method: "POST", headers });
//   if (!response.ok) {
//     const message = await response.text();
//     throw new Error(`Notion API request failed: ${message}`);
//   }

//   const data: NotionResponse = await response.json();
//   return data.results.map((result: NotionResponseItem) => ({
//     name: result.properties.Name.title[0].plain_text,
//     job: result.properties.job.rich_text[0].plain_text,
//     department: result.properties.department.rich_text[0].plain_text,
//   }));
// };

// const app = new Hono<Env>().basePath("/api");

// app.get("/notion", async (c) => {
//   try {
//     const results = await fetchNotionData(c.env);
//     return c.json(results);
//   } catch (e: unknown) {
//     if (e instanceof Error) {
//       return c.json(
//         { error: `Failed to fetch data from Notion: ${e.message}` },
//         500
//       );
//     }
//     return c.json(
//       { error: "An unknown error occurred while fetching data" },
//       500
//     );
//   }
// });

export const onRequest = handle(app);
