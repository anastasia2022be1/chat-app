export function validatePassword(req, res, next) {
    const { password } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password is invalid. It must be exactly 8 characters long, include uppercase, lowercase letters, and numbers.",
        });
    }

    next();
}
