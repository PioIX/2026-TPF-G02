"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function Home() {

    const [todolisto, settl] = useState(false)
    const [canva, setcanva] = useState("")
    let dibujando = false;
    let ultimo = false;
    let guardado;
    const canvear = (event) => {
        setcanva(event.target.value)
    };
    const ctx = canva.getContext("2d");
    function posicion(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }
    canvas.addEventListener("mouseup", () => (dibujando = false));
    canvas.addEventListener("mousedown", (e) => {
        dibujando = true;
        ultimo = posicion(e);
    });
    canvas.addEventListener("mousemove", dibujar);

    function dibujar(e) {
        if (!dibujando) return;
        actual = posicion(e);
        ctx.beginPath();
        ctx.strokeStyle = document.getElementById("color").value;
        ctx.lineWidth = document.getElementById("rango").value;
        ctx.lineCap = "round";
        ctx.moveTo(ultimo.x, ultimo.y);
        ctx.lineTo(actual.x, actual.y);
        ctx.stroke();
        ultimo = actual;
    }

    function limpiar() {
        ctx.reset();
    }

    function terminar() {
        let guardado = canvas.toDataURL("image/png",0.8);
        let datos = {
            link: guardado
        };
    console.log(guardado,datos)
    finStep(datos)
    }

    async function finStep(datos) {
    const response = await fetch("http://localhost:4000/BlobPost", {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(datos), //JSON.stringify convierte de objeto a JSON
    });
        const texto = await response.text();   // text() en vez de json(), para ver lo que sea que llegue
        console.log(response.status, texto);
        settl(true)
        // mandarle TODO LISTO a fortnite(socket)
    }
    return(
    <>
        <canvas id="canvas" width="600" height="400" style="background-color: white;" onChange={canvear}></canvas>
        <Input type="color" id="color"></Input>
        <Input type="range" id="rango" min="1" max="20"></Input>
        <Button onclick={limpiar()} txt={"Limpiar"}></Button>
        <Button onclick={terminar()} txt={"TODO LISTO"}></Button>
        
    </>)
}

/*
JS
async function get_blob() {
        let res = await fetch("http://localhost:4000/prueba");
        let respuesta = await res.json();
        console.log(respuesta);
        let elementos;
        for (let i = 0; i < respuesta.length; i++) {
            elementos += `<img src="${respuesta[i].link}"/>`;
        }
        document.getElementById("div_fotos").innerHTML = elementos;
    }
HTML
<div id="div_fotos" style="background-color: white;">           
        </div>
        <Button onclick={get_blob()} txt={"Ver"}></Button>
*/