import { object, string } from "zod";

export const registerSchema = object({
  name: string().min(1, "名前は必須です"),
  email: string({ required_error: "メールアドレスは必須です" })
    .min(1, "メールアドレスは必須です")
    .email("不正なメールアドレスです"),
  password: string({ required_error: "パスワードは必須です" })
    .min(1, "パスワードは必須です")
    .min(8, "パスワードは8文字以上です")
    .max(32, "パスワードは32文字以下です"),
  confirmPassword: string({ required_error: "確認パスワードは必須です" }).min(
    1,
    "確認パスワードは必須です"
  ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードと確認パスワードが一致しません",
  path: ["confirmPassword"],
});
