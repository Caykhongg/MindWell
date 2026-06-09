const path = require('path');
const bcrypt = require('bcryptjs');

var db;

if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  db.isPg = true;
} else {
  const Database = require('better-sqlite3');
  const DB_PATH = path.join(__dirname, 'mindwell.db');
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.isPg = false;
}

function adapt(sql, params) {
  if (db.isPg || !params) return { sql: sql, params: params || [] };
  var idx = 0;
  var s = sql.replace(/\$(\d+)/g, function () { return '?'; });
  return { sql: s, params: params };
}

async function run(sql, params) {
  var a = adapt(sql, params);
  if (db.isPg) return db.query(a.sql, a.params);
  var stmt = db.prepare(a.sql);
  return stmt.run.apply(stmt, a.params);
}

async function all(sql, params) {
  var a = adapt(sql, params);
  if (db.isPg) {
    var result = await db.query(a.sql, a.params);
    return result.rows;
  }
  var stmt = db.prepare(a.sql);
  return stmt.all.apply(stmt, a.params);
}

async function get(sql, params) {
  var a = adapt(sql, params);
  if (db.isPg) {
    var result = await db.query(a.sql, a.params);
    return result.rows[0] || null;
  }
  var stmt = db.prepare(a.sql);
  return stmt.get.apply(stmt, a.params);
}

async function initSchema() {
  if (db.isPg) {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS mental_tests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        result TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS bot_replies (
        id SERIAL PRIMARY KEY,
        keywords TEXT NOT NULL,
        reply TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS chat_feedback (
        id SERIAL PRIMARY KEY,
        message_text TEXT NOT NULL,
        bot_reply TEXT NOT NULL,
        helpful INTEGER NOT NULL DEFAULT 0,
        keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        read INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await seedAgents();
    await seedBotReplies();
  } else {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS mental_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        result TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS bot_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keywords TEXT NOT NULL,
        reply TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS chat_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_text TEXT NOT NULL,
        bot_reply TEXT NOT NULL,
        helpful INTEGER NOT NULL DEFAULT 0,
        keywords TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user1_id INTEGER NOT NULL,
        user2_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        read INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    await seedAgents();
    await seedBotReplies();
  }
}

async function seedAgents() {
  var existing = await get("SELECT COUNT(*) AS c FROM users WHERE email LIKE 'agent.%'");
  if (existing.c > 0) return;

  var pw = bcrypt.hashSync('mindwell123', 10);
  await run("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ['Lan Anh', 'agent.lananh@mindwell.edu', pw]);
  await run("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ['Minh Tuấn', 'agent.minhtuan@mindwell.edu', pw]);
  await run("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", ['Phương Mai', 'agent.phuongmai@mindwell.edu', pw]);
}

async function seedBotReplies() {
  var count = await get("SELECT COUNT(*) AS c FROM bot_replies");
  if (count.c > 0) return;

  var defaults = [
    { keywords: 'chào, xin chào, hello, hi, hey, alo, chao, helo, chao ban, ban oi', reply: 'Chào bạn! Cảm ơn bạn đã nhắn tin. Hôm nay bạn cảm thấy thế nào?' },
    { keywords: 'buồn, chán nản, trầm cảm, tuyệt vọng, cô đơn, một mình, khóc, u sầu, down, buon, chan, tram cam, co don, mot minh, ko vui, k vui, ko on, k on, ko ổn, k ổn, khổ quá, kho qua', reply: 'Mình nghe thấy bạn, và mình muốn bạn biết rằng cảm thấy thế này là hoàn toàn bình thường. Bạn không đơn độc đâu. Bạn có muốn nói thêm về những gì đang xảy ra không?' },
    { keywords: 'lo lắng, hồi hộp, căng thẳng, hoảng sợ, sợ hãi, bồn chồn, stress, stres, stressed, lo lang, hoi hop, can thang, hoang so, so hai, bien, bức, buc', reply: 'Lo âu có thể rất nặng nề. Hãy cùng hít một hơi thật sâu nhé. Hít vào trong 4 giây, giữ trong 4 giây, và thở ra trong 4 giây. Bạn có muốn thử một bài tập thư giãn nhanh không?' },
    { keywords: 'stress, quá tải, kiệt sức, mệt mỏi, deadline, thi cử, học tập, áp lực, ap luc, met moi, qua tai, hoc tap, nhieu viec, nhiều việc', reply: 'Áp lực học tập là có thật và hoàn toàn chính đáng. Hãy nhớ nghỉ ngơi, uống đủ nước và tử tế với chính mình. Mình có thể chia sẻ vài kỹ thuật giảm căng thẳng nếu bạn muốn.' },
    { keywords: 'ngủ, mất ngủ, không ngủ được, mệt, ác mộng, thức khuya, ngu, mat ngu, khong ngu duoc, thuc khuya, insomnia, ko ngu dc, k ngu dc, ko ngu duoc, k ngu duoc', reply: 'Giấc ngủ rất quan trọng cho sức khỏe tâm thần. Hãy thử thiền ngủ có hướng dẫn của chúng tôi hoặc các mẹo sau: không dùng điện thoại 30 phút trước khi ngủ, giữ phòng tối và mát, tập thở sâu.' },
    { keywords: 'tức giận, bực bội, khó chịu, cáu kỉnh, nóng giận, bức xúc, tuc gian, buc boi, kho chiu, nong gian, buc xuc, vl, vkl, bố láo, mat day, mặt dày', reply: 'Cảm thấy tức giận đôi khi là hoàn toàn bình thường. Hãy thử gọi tên cảm xúc bên dưới cơn giận — là tổn thương, sợ hãi hay thất vọng? Nói ra có giúp ích gì không?' },
    { keywords: 'trị liệu, tư vấn, chuyên gia, buổi, lịch hẹn, đặt lịch, tri lieu, tu van, chuyen gia, lich hen, dat lich, appointment, booking, hen gap', reply: 'Lựa chọn tuyệt vời! Bạn có thể đặt lịch tư vấn miễn phí qua cổng thông tin của chúng tôi. Bạn có muốn mình giúp bạn sắp xếp lịch hẹn không?' },
    { keywords: 'bạn bè, kết nối, xã hội, mọi người, nói chuyện, đồng trang lứa, nhóm, ban be, ket noi, noi chuyen, dong trang lua, muốn nói chuyện, muon noi chuyen, muốn tâm sự, muon tam su', reply: 'Kết nối là sức mạnh. Các buổi trị liệu nhóm của chúng tôi là cách tuyệt vời để gặp gỡ những sinh viên khác hiểu được những gì bạn đang trải qua.' },
    { keywords: 'cảm ơn, cám ơn, thanks, thank you, cam on, thank, tks, ty, camon', reply: 'Không có gì! Mình luôn ở đây bất cứ khi nào bạn cần nói chuyện. Hãy nhớ rằng, chăm sóc sức khỏe tâm thần là dấu hiệu của sức mạnh, không phải yếu đuối.' },
    { keywords: 'khủng hoảng, cấp cứu, tự tử, tự sát, tự làm hại, muốn chết, kết thúc cuộc sống, kết liễu, khung hoang, cap cuu, tu tu, tu sat, chet, 115, ko muốn sống, k muốn sống, k muon song, ko muon song, ko song nua, k song nua, buông xuôi, buong xuoi', reply: 'Hãy tìm kiếm sự giúp đỡ ngay lập tức. Gọi 115 (Cấp cứu) hoặc 024 2242 3888 (Đường dây nóng Tâm lý). Bạn có giá trị. Hãy ở lại với mình — mình đang ở đây và sự giúp đỡ đang đến.' }
  ];
  for (var d of defaults) {
    await run("INSERT INTO bot_replies (keywords, reply) VALUES ($1, $2)", [d.keywords, d.reply]);
  }
}

async function init() {
  await initSchema();
}

module.exports = { run, all, get, init, get isPg() { return db ? db.isPg : false; } };