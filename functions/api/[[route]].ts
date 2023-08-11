import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import type { Person } from "@/types/Person";

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

const app = new Hono().basePath("/api");

app.get("/people", (c) => {
  return c.json(data);
});

export const onRequest = handle(app);
