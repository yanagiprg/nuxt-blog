export const validateTitle = (validate) => {
  const errors = []
  if (!validate.$dirty) return errors
  !validate.required && errors.push('タイトルを入力してください')
  !validate.maxLength && errors.push('８文字以内で入力してください')
  return errors
}

export const validateText = (validate) => {
  const errors = []
  if (!validate.$dirty) return errors
  !validate.required && errors.push('テキストを入力してください')
  return errors
}

export const validateName = (validate) => {
  const errors = []
  if (!validate.$dirty) return errors
  !validate.required && errors.push('名前を入力してください')
  !validate.maxLength && errors.push('１６文字以内で入力してください')
  return errors
}

export const validateEmail = (validate) => {
  const errors = []
  if (!validate.$dirty) return errors
  !validate.required && errors.push('メールアドレスを入力してください')
  !validate.email && errors.push('メールアドレスの形式で入力してください')
  return errors
}

export const validatePassword = (validate) => {
  const errors = []
  if (!validate.$dirty) return errors
  !validate.required && errors.push('パスワードを入力してください')
  !validate.minLength &&
    errors.push('8文字以上で英数字を混ぜて入力してください')
  return errors
}
