export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student'
}
export type userPartial = Partial<User>;
export class User{
    constructor(
    public id: number,
    public name: string,
    public email:string,
    public password:string,
    public role:Role
    ){}
}