const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mindwell.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
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
  `);

  seedBotReplies();
}

function seedBotReplies() {
  var count = db.prepare('SELECT COUNT(*) AS c FROM bot_replies').get().c;
  if (count > 0) return;

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

  var insert = db.prepare('INSERT INTO bot_replies (keywords, reply) VALUES (?, ?)');
  var tx = db.transaction(function () {
    defaults.forEach(function (d) { insert.run(d.keywords, d.reply); });
  });
  tx();
}

module.exports = { getDb };
