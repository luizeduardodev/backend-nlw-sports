import express from "express";
const app = express();
const port = 3000;

app.get("/objeto", (req, res) => {
    return res.json([
        { id: 1, name: "Eduardo" },
        { id: 2, name: "Luiza" },
        { id: 3, name: "Luiz" }
    ]);
});

app.listen(port, () => {
    console.log("Servidor iniciado!");
});
