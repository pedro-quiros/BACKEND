import { Router } from "express";
import fs from "fs"

const router = Router();

/* La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
*/

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
const carts = JSON.parse(fs.readFileSync('./data/carts.json', 'utf-8'));

router.post('/', (req, res) => {
    const newId = carts[carts.length -1].id + 1;
    const newCart = { 
        id: newId, 
        products: [] 
    };

    carts.push(newCart);
    fs.writeFileSync('./data/carts.json', JSON.stringify(carts, null, '\t'));
    res.json(carts);
})

// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

router.get('/:cid', (req, res) => {
    const { cid } = req.params;

    const cart = carts.find(cart => cart.id == cid);
    if (cid > carts[carts.length - 1].id || cid < 1 || !cart) {
        res.status(400).json(`No se encuentra el carrito con el id: ${cid}, solicita uno entre el 1 y el ${carts[carts.length - 1].id}`)
    } else {
        try {
            res.json(cart);
        } catch (err) {
            console.log(err)
        }
    }
})

/* La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. */

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    
    const cart = carts.find(cart => cart.id == cid);
    const product = products.find(product => product.id == pid);
    const isExistent = cart.products.find(product => product.product == pid);

    if (cid > carts[carts.length - 1].id || cid < 1 || !cart) {
        res.status(400).json(`No se encuentra el carrito con el id: ${cid}, solicita uno entre el 1 y el ${carts[carts.length - 1].id}`)
    } else if (!product) {
        res.status(400).json(`No se encuentra el producto con el id: ${pid}, solicita uno entre el 1 y el ${products[products.length - 1].id}`)
    } else {
        try {
            if (isExistent) {
                isExistent.quantity += 1;
            } else {
                cart.products.push({ product: product.id, quantity: 1 });
            }
            fs.writeFileSync('./data/carts.json', JSON.stringify(carts, null, '\t'));
            res.json(cart);
        } catch (err) {
            console.log(err)
        }
    }
})

export default router