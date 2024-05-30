import express from "express"
import productsRoutes from "./routes/products.routes.js"
import cartRoutes from "./routes/carts.routes.js"

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);