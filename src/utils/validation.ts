type Validator = (value: string) => string | null;
type ValidationResult = { isValid: boolean; error?: string };

const validate = (
  value: string | null | undefined,
  validators: Validator[]
): ValidationResult => {
  if (value == null) {
    return { isValid: false, error: "Поле не найдено" };
  }

  for (const check of validators) {
    const error = check(value);
    if (error) {
      return { isValid: false, error };
    }
  }

  return { isValid: true };
};

const nameValidators: Validator[] = [
  (v) => (/\s/.test(v) ? "Имя не должно содержать пробелы" : null),
  (v) => (/\d/.test(v) ? "Имя не должно содержать цифры" : null),
  (v) =>
    !/^[a-zA-Zа-яёА-ЯЁ-]+$/.test(v)
      ? "Имя должно содержать только буквы (латиница, кириллица) и дефисы."
      : null,
  (v) =>
    !/^[A-ZА-ЯЁ]/.test(v)
      ? "Первая буква должна быть заглавной (латиница или кириллица)"
      : null,
];

const loginValidators: Validator[] = [
  (v) =>
    v.length < 3 || v.length > 20
      ? "Логин должен быть от 3 до 20 символов"
      : null,
  (v) =>
    !/^[a-zA-Z0-9_-]+$/.test(v)
      ? "Логин должен состоять из латиницы, цифр, дефиса или подчёркивания"
      : null,
  (v) => (/^\d+$/.test(v) ? "Логин не может состоять только из цифр" : null),
];

const emailValidators: Validator[] = [
  (v) =>
    !/^[a-zA-Z0-9_@.-]+$/.test(v)
      ? "Email должен состоять из латиницы, цифр, дефиса или подчёркивания"
      : null,
  (v: string) =>
    !/^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(v)
      ? "Пожалуйста, введите корректный email. Он должен содержать '@' и точку, а перед точкой обязательно должны быть буквы."
      : null,
];

const passwordValidators: Validator[] = [
  (v) =>
    v.length < 8 || v.length > 40
      ? "Пароль должен быть от 8 до 40 символов"
      : null,
  (v) =>
    !/[A-ZА-ЯЁ]/.test(v)
      ? "Пароль должен содержать хотя бы одну заглавную букву (латиница или кириллица)"
      : null,
  (v) => (!/\d/.test(v) ? "Пароль должен содержать хотя бы одну цифру" : null),
];

const phoneValidators: Validator[] = [
  (v) =>
    v.length < 10 || v.length > 15
      ? "Номер телефона должен быть от 10 до 15 символов"
      : null,
  (v) =>
    !/^\+?[0-9]+$/.test(v)
      ? "Номер телефона должен состоять из цифр, может начинается с плюса"
      : null,
];

const messageValidators: Validator[] = [
  (v) => (!v.trim() ? "Пожалуйста, заполните это поле." : null),
];

export const validateName = (value: string | null | undefined) =>
  validate(value, nameValidators);

export const validateLogin = (value: string | null | undefined) =>
  validate(value, loginValidators);

export const validateEmail = (value: string | null | undefined) =>
  validate(value, emailValidators);

export const validatePassword = (value: string | null | undefined) =>
  validate(value, passwordValidators);

export const validatePhone = (value: string | null | undefined) =>
  validate(value, phoneValidators);

export const validateMessage = (value: string | null | undefined) =>
  validate(value, messageValidators);
