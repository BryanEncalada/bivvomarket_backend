

const nodemailer = require("nodemailer");


const enviarCorreo = async (req, res) => {
    const { to, name, subject, message } = req.body;

    const text = "";
    const html = `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${to}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `;

    try {
        // Configuración del transporter (puedes usar Gmail, Outlook, etc.)
        const transporter = nodemailer.createTransport({
            host: 'mail.pettime.pe',
            port: 587,
            secure: false,
            auth: {
                user: "contacto@pettime.pe", // tu correo
                pass: "Pettime@123", // tu contraseña o app password
            },
            tls: { rejectUnauthorized: false }
        });

        // Opciones del correo
        const mailOptions = {
            from: "contacto@pettime.pe",
            to, // destinatario
            subject,
            html, // versión HTML (opcional)
        };

        // Enviar correo
        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Correo enviado con éxito'
        });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el correo',
            error: error.message,
        });
    }
};


module.exports = {
    enviarCorreo
};
