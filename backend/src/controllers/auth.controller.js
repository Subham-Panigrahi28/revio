import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  // Stateless JWT invalidation response
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
