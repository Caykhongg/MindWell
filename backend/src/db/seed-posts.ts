import postgres from 'postgres';
import { config } from '../config/index.js';

const sql = postgres(config.database.url);

const existingPosts = await sql`SELECT COUNT(*) as c FROM posts`;
if (existingPosts[0].c > 0) {
  console.log(`Posts already exist (${existingPosts[0].c}), skipping.`);
  await sql.end();
  process.exit(0);
}

const users = await sql`SELECT id, name, role FROM users`;
const admin = users.find((u: any) => u.role === 'admin');
const therapist = users.find((u: any) => u.role === 'therapist');
const patient = users.find((u: any) => u.role === 'patient');

if (!admin || !therapist || !patient) {
  console.log('Missing users, run npm run db:seed first');
  await sql.end();
  process.exit(1);
}

const now = new Date();

const [p1] = await sql`
  INSERT INTO posts (user_id, title, content, is_anonymous, like_count, comment_count, created_at, updated_at)
  VALUES (${patient.id}, 'Làm thế nào để vượt qua lo âu?', 'Mình thường xuyên cảm thấy lo lắng vô cớ, nhất là trước những kỳ thi. Có ai từng trải qua và có cách nào để vượt qua không ạ?', 0, 5, 2, ${now}, ${now}) RETURNING id
`;
const [p2] = await sql`
  INSERT INTO posts (user_id, title, content, is_anonymous, like_count, comment_count, created_at, updated_at)
  VALUES (${therapist.id}, '5 kỹ thuật thở giúp giảm căng thẳng', 'Chia sẻ với mọi người 5 kỹ thuật thở đơn giản có thể áp dụng mọi lúc mọi nơi khi cảm thấy căng thẳng. Kỹ thuật 1: Thở bụng. Kỹ thuật 2: Thở 4-7-8. Kỹ thuật 3: Thở luân phiên...', 0, 12, 3, ${now}, ${now}) RETURNING id
`;
const [p3] = await sql`
  INSERT INTO posts (user_id, title, content, is_anonymous, like_count, comment_count, created_at, updated_at)
  VALUES (${patient.id}, 'Chia sẻ về hành trình trị liệu của mình', 'Sau 6 tháng trị liệu, mình muốn chia sẻ một chút về hành trình của bản thân. Ban đầu mình rất lo lắng nhưng dần dần mình học được cách chấp nhận và yêu thương bản thân hơn.', 1, 8, 1, ${now}, ${now}) RETURNING id
`;

await sql`
  INSERT INTO comments (post_id, user_id, content, is_anonymous, created_at, updated_at)
  VALUES (${p1.id}, ${therapist.id}, 'Chào bạn, cảm giác lo âu trước kỳ thi là rất phổ biến. Mình gợi ý bạn thử kỹ thuật thở 4-7-8: hít vào 4 giây, giữ 7 giây, thở ra 8 giây. Lặp lại 3-5 lần.', 0, ${now}, ${now})
`;
await sql`
  INSERT INTO comments (post_id, user_id, content, is_anonymous, created_at, updated_at)
  VALUES (${p1.id}, ${patient.id}, 'Cảm ơn bạn! Mình sẽ thử ngay.', 1, ${now}, ${now})
`;
await sql`
  INSERT INTO comments (post_id, user_id, content, is_anonymous, created_at, updated_at)
  VALUES (${p2.id}, ${admin.id}, 'Bài viết rất hữu ích! Mong bạn chia sẻ thêm nhiều kiến thức hơn nữa.', 0, ${now}, ${now})
`;
await sql`
  INSERT INTO comments (post_id, user_id, content, is_anonymous, created_at, updated_at)
  VALUES (${p2.id}, ${patient.id}, 'Cảm ơn bác sĩ! Kỹ thuật thứ 3 rất hiệu quả với em.', 0, ${now}, ${now})
`;
await sql`
  INSERT INTO comments (post_id, user_id, content, is_anonymous, created_at, updated_at)
  VALUES (${p2.id}, ${therapist.id}, 'Rất vui vì điều đó! Hãy kiên trì thực hành mỗi ngày nhé.', 0, ${now}, ${now})
`;
await sql`
  INSERT INTO comments (post_id, user_id, content, is_anonymous, created_at, updated_at)
  VALUES (${p3.id}, ${therapist.id}, 'Cảm ơn bạn đã dũng cảm chia sẻ. Hành trình của bạn thực sự đáng ngưỡng mộ!', 0, ${now}, ${now})
`;

console.log('Seeded 3 posts and 6 comments!');
await sql.end();
