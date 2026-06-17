import { type NewUser, type User } from '../db/schema/users.js';
export declare class UserRepository {
    findById(id: number): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    findByResetToken(token: string): Promise<User | undefined>;
    create(data: NewUser): Promise<User>;
    update(id: number, data: Partial<NewUser>): Promise<User | undefined>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map