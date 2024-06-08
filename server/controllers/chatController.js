import path from 'path';
const __dirname = path.resolve(); // Solución para obtener __dirname en ES Modules

const getWebPage = async (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error al cargar la página");
    }
};

export {getWebPage}