import { Role } from "./role";
export class User {
    user_id: number;
    hoten: string;
    diachi: string;
    gioitinh: string;
    email: string;
    taikhoan: string;
    matkhau: string;
    role: string;
    image_url: string;
    ngaysinh: Date;
    token?: string;
}