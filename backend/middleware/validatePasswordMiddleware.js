export function validatePassword(req, res, next) {
  const { password, currentPassword, newPassword } = req.body;

  // Regex to check for at least 8 characters
  const passwordRegex = /^.{8,}$/;

  const passwordToValidate = password || currentPassword;

  if (passwordToValidate && !passwordRegex.test(passwordToValidate)) {
    return res.status(400).json({
      message: "Password is invalid. It must be at least 8 characters long.",
    });
  }

  if (newPassword && !passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "New password is invalid. It must be at least 8 characters long.",
    });
  }

  next();
}
