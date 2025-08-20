const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const subirFtp = async (req, res) => {


    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), req.file.originalname);

    try {
        const response = await axios.post(
            "https://test.bivvomarket.com/api/upload.php",
            form,
            { headers: form.getHeaders() }
        );
        console.log("Upload response:", response.data);

        // ✅ Borrar archivo temporal después de subir
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error al borrar archivo temporal:", err);
        });

        res.json({ mensaje: "Imagen subida" });

    } catch (err) {

        res.status(500).json({ error: err.message });
        console.error("Upload error: -<", err.message);
    }


};


module.exports = {
    subirFtp
};



