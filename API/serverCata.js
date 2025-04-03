import express from "express"
import bodyParser from "body-parser";
import fs from "fs"

const app = express();
app.use(bodyParser.json())

app.use(express.static("public"));//carpeta publica pel css
app.set('view engine','ejs');//Fem servir el motor ejs
app.set('views', './views'); //carpeta on desem els arxius .ejs

const readData = () => JSON.parse(fs.readFileSync('./products.json'));
const writeData = (data) => fs.writeFileSync('./products.json', JSON.stringify(data));

//POST crear un nuevo producto dentro del fichero
app.post("/products", (req, res) => {
    const data = readData();
    const body = req.body;
    const newProduct = {
        id: data.products.length + 1,
        ...req.body,
    };
    data.products.push(newProduct) //añade el nuevo producto al array de productos
    writeData(data);
    res.json(newProduct)
});

//GET
/*devuelve todos los productos
app.get("/products", (req, res) => {
    const data = readData();
    res.json(data.products);
});
//GET 
/*obtener por id
app.get("/products/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    try {
        const product = data.products.find((product) => product.id == id);
        res.json(product);
    } catch (error) {
        console.log("Error")
    }
});
*/

app.get('/products', (req, res) => {
    const user={name:"Cata"}
    const htmlMessage = `
    <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
    <a href="https://www.example.com">Visita Example</a>`;
    const data = readData();
    res.render("products",{user, data,htmlMessage})
    //res.json(data.products);
 });
 

app.put("/products/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const productIndex = data.products.findIndex((product) => product.id === id);
    data.products[productIndex] = {
      ...data.products[productIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Product updated successfully" });
  });


//DELETE 
//eliminar un producto por su id
app.delete("/products/:id", (req, res) => {
    const data = readData();
    console.log("data!!!!!! ",data)
    
    const id = parseInt(req.params.id);
    console.log("param id !!!!!! ",id)
    //Buscamos la posición del producto
    const productIndex = data.products.findIndex(product => product.id == id)
    data.products.splice(productIndex, 1);
    writeData(data);
    res.json({ message: "Producto eliminado correctamente" })
})

//LISTEN
app.listen(3006, () => {
    console.log("Servidor está escuchando...")
});
