const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const { config } = require("../../../config/config");

// helpers
const signAccessToken = (id) =>
  jwt.sign({ id }, config.JWT.accessToken.secret, {
    expiresIn: config.JWT.accessToken.exp,
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, config.JWT.refreshToken.secret, {
    expiresIn: config.JWT.refreshToken.exp,
  });

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      accessToken: signAccessToken(user._id),
      refreshToken: signRefreshToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REFRESH TOKEN
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  jwt.verify(
    refreshToken,
    config.JWT.refreshToken.secret,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      res.json({
        accessToken: signAccessToken(decoded.id),
      });
    }
  );
};
