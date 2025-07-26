const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ mensaje: "Usuario no encontrado" });

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const nuevoUsuario = new User({ email, password });
    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Usuario creado con éxito",
      usuario: { email: nuevoUsuario.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, register };
