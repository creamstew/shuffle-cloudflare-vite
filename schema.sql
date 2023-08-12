DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, name TEXT, job TEXT, department TEXT);
INSERT INTO Users (id, name, job, department) VALUES (1, '山田 太郎', 'エンジニア', 'プロダクト事業部'), (2, '鈴木 次郎', 'エンジニア', 'プロダクト事業部'), (3, '佐藤 三郎', 'エンジニア', 'プロダクト事業部'), (4, '田中 四郎', 'エンジニア', 'プロダクト事業部'), (5, '伊藤 五郎', 'エンジニア', 'プロダクト事業部'), (6, '山本 六郎', 'エンジニア', 'プロダクト事業部'), (7, '中村 七郎', 'エンジニア', 'プロダクト事業部'), (8, '小林 八郎', 'エンジニア', 'プロダクト事業部'), (9, '加藤 九郎', 'エンジニア', 'プロダクト事業部'), (10, '吉田 十郎', 'エンジニア', 'プロダクト事業部'); 
