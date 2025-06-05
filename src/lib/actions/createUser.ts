"use server";

import bcryptjs from "bcryptjs";
import { registerSchema } from "@/validations/user";
import { prisma } from "../prisma";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

function handleValidationError(error: any): ActionState {
  // ZodErrorの場合
  if (error && error.flatten) {
    const { fieldErrors, formErrors } = error.flatten();
    if (formErrors.length > 0) {
      return {
        success: false,
        errors: { ...fieldErrors, confirmPassword: formErrors },
      };
    }
    return { success: false, errors: fieldErrors };
  }
  // 独自エラーの場合
  return { success: false, errors: error };
}

export async function createUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // フォームから渡ってきた情報を取得
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((field) => [
      field,
      formData.get(field) as string,
    ])
  ) as Record<string, string>;

  // バリデーション
  const validationResult = await registerSchema.safeParseAsync(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }

  // DBにメールアドレスが存在しているかの確認
  const existingUser = await prisma.user.findUnique({
    where: { email: rawFormData.email },
  });
  if (existingUser) {
    return handleValidationError({
      email: ["メールアドレスは既に登録されています"],
    });
  }

  // DBにユーザーを登録
  const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);

  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword,
    },
  });

  // dashboardへリダイレクト
  await signIn("credentials", {
    ...Object.fromEntries(formData),
    redirect: false,
  });

  redirect("/dashboard");
}
