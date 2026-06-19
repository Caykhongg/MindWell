import type { TestType, TestQuestion } from '@/types'

export const TEST_OPTIONS = [
  { label: 'Không bao giờ', value: 0 },
  { label: 'Vài ngày', value: 1 },
  { label: 'Hơn nửa số ngày', value: 2 },
  { label: 'Hầu như mỗi ngày', value: 3 },
]

function q(text: string): TestQuestion {
  return { text, options: TEST_OPTIONS }
}

export const TEST_TYPES: TestType[] = [
  {
    id: 'phq9',
    name: 'PHQ-9 — Thang đo trầm cảm',
    description: 'Đánh giá mức độ trầm cảm dựa trên 9 triệu chứng trong 2 tuần qua.',
    time: '5-10 phút',
    questions: [
      q('Thiếu quan tâm hoặc thích thú trong làm việc?'),
      q('Cảm thấy buồn bã, chán nản hoặc tuyệt vọng?'),
      q('Khó ngủ, thức giấc giữa đêm hoặc ngủ quá nhiều?'),
      q('Cảm thấy mệt mỏi hoặc thiếu năng lượng?'),
      q('Ăn không ngon hoặc ăn quá nhiều?'),
      q('Cảm thấy không tốt về bản thân — hoặc đã thất vọng?'),
      q('Khó tập trung khi đọc báo hoặc xem tivi?'),
      q('Di chuyển hoặc nói chậm đến mức người khác nhận thấy? Hoặc ngược lại — bồn chồn, sốt ruột?'),
      q('Nghĩ rằng mình nên chết đi, hoặc nghĩ đến việc tự làm đau mình?'),
    ],
    options: TEST_OPTIONS,
    severityLevels: [
      { min: 0, max: 4, label: 'Bình thường', description: 'Không có dấu hiệu trầm cảm.', recommendation: 'Duy trì thói quen lành mạnh.', color: '#7BA38B' },
      { min: 5, max: 9, label: 'Nhẹ', description: 'Có dấu hiệu trầm cảm nhẹ.', recommendation: 'Theo dõi tình trạng và nghỉ ngơi nhiều hơn.', color: '#C9A97C' },
      { min: 10, max: 14, label: 'Vừa', description: 'Có dấu hiệu trầm cảm ở mức trung bình.', recommendation: 'Nên tham khảo ý kiến chuyên gia tâm lý.', color: '#D4A5A5' },
      { min: 15, max: 27, label: 'Nặng', description: 'Có dấu hiệu trầm cảm nặng.', recommendation: 'Liên hệ ngay với chuyên gia sức khỏe tâm thần.', color: '#C97C7C' },
    ],
  },
  {
    id: 'gad7',
    name: 'GAD-7 — Thang đo lo âu',
    description: 'Đánh giá mức độ lo âu dựa trên 7 triệu chứng trong 2 tuần qua.',
    time: '3-5 phút',
    questions: [
      q('Cảm thấy hồi hộp, lo lắng hoặc căng thẳng?'),
      q('Không thể ngừng hoặc kiểm soát sự lo lắng?'),
      q('Lo lắng quá nhiều về nhiều việc khác nhau?'),
      q('Khó thư giãn?'),
      q('Bồn chồn đến mức khó ngồi yên?'),
      q('Trở nên dễ cáu kỉnh hoặc khó chịu?'),
      q('Cảm thấy sợ hãi như thể điều tồi tệ sắp xảy ra?'),
    ],
    options: TEST_OPTIONS,
    severityLevels: [
      { min: 0, max: 4, label: 'Bình thường', description: 'Không có dấu hiệu lo âu.', recommendation: 'Duy trì thói quen lành mạnh.', color: '#7BA38B' },
      { min: 5, max: 9, label: 'Nhẹ', description: 'Có dấu hiệu lo âu nhẹ.', recommendation: 'Theo dõi và thực hành các bài tập thư giãn.', color: '#C9A97C' },
      { min: 10, max: 14, label: 'Vừa', description: 'Có dấu hiệu lo âu ở mức trung bình.', recommendation: 'Nên tham khảo ý kiến chuyên gia tâm lý.', color: '#D4A5A5' },
      { min: 15, max: 21, label: 'Nặng', description: 'Có dấu hiệu lo âu nặng.', recommendation: 'Liên hệ ngay với chuyên gia sức khỏe tâm thần.', color: '#C97C7C' },
    ],
  },
]
