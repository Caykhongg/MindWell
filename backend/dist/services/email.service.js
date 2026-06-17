import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
let transporter = null;
function getTransporter() {
    if (transporter)
        return transporter;
    if (!config.smtp.host) {
        logger.warn('SMTP not configured — email sending disabled');
        return null;
    }
    transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
    return transporter;
}
export async function sendEmail(to, subject, html) {
    const t = getTransporter();
    if (!t) {
        logger.info({ to, subject }, '[email mock] would send email');
        return;
    }
    try {
        await t.sendMail({ from: config.smtp.from, to, subject, html });
        logger.info({ to, subject }, 'Email sent');
    }
    catch (err) {
        logger.error({ err, to, subject }, 'Failed to send email');
    }
}
export function buildRoleEmail(userName, action) {
    if (action === 'approved') {
        return {
            subject: 'Yêu cầu trở thành tư vấn viên đã được phê duyệt',
            html: `<h2>Xin chào ${userName},</h2>
<p>Yêu cầu trở thành tư vấn viên của bạn đã được <strong>phê duyệt</strong>.</p>
<p>Giờ đây bạn có thể tạo bài kiểm tra, viết bài thư viện, và quản lý lịch tư vấn.</p>
<p>Trân trọng,<br/>Đội ngũ MindWell</p>`,
        };
    }
    return {
        subject: 'Yêu cầu trở thành tư vấn viên đã bị từ chối',
        html: `<h2>Xin chào ${userName},</h2>
<p>Yêu cầu trở thành tư vấn viên của bạn đã bị <strong>từ chối</strong>.</p>
<p>Nếu bạn có thắc mắc, vui lòng liên hệ với quản trị viên.</p>
<p>Trân trọng,<br/>Đội ngũ MindWell</p>`,
    };
}
//# sourceMappingURL=email.service.js.map