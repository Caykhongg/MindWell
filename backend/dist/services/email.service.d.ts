export declare function sendEmail(to: string, subject: string, html: string): Promise<void>;
export declare function buildRoleEmail(userName: string, action: 'approved' | 'rejected'): {
    subject: string;
    html: string;
};
//# sourceMappingURL=email.service.d.ts.map