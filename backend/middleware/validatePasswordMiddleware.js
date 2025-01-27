export function validatePassword(req, res, next) {
    const { password, newPassword } = req.body;

    // Regex to check for at least 8 characters
    const passwordRegex = /^.{8,}$/;

    if (password && !passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password is invalid. It must be at least 8 characters long.",
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
