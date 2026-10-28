"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRef, useState } from "react";

export default function Draw() {
    const [todolisto, settl] = useState(false);
    const [color, setColor] = useState("#000000");
    const [grosor, setGrosor] = useState(5)
    const canvasRef = useRef(null);
    const dibujando = useRef(false);
    const ultimo = useRef({ x: 0, y: 0 });

    function empezar (event) {
        dibujando.current = true;
        ultimo.current = posicion (event);
    }

    function parar() {
        dibujando.current = false;
    }
    
    function posicion (event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();//devuelve la posicion
        const escalaX = canvas.width / rect.width;
        const escalaY = canvas.height / rect.height;
        return {
            x: (event.clientX - rect.left) * escalaX,
            y: (event.clientY - rect.top) * escalaY,
        };
    }

    function dibujar (event) {
        if (!dibujando.current) return;
        const ctx = canvasRef.current.getContext("2d");
        const actual = posicion(event);

        //magia
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = grosor;
        ctx.lineCap = "round";
        ctx.moveTo(ultimo.current.x, ultimo.current.y);
        ctx.lineTo(actual.x, actual.y);
        ctx.stroke();
        //magia

        ultimo.current = actual;
    }

    function limpiar() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function terminar() {
        const guardado = canvasRef.current.toDataURL("image/png", 0.8);
        finStep({ link: guardado });
    }

    const colorSetter = (event) => {
        setColor(event.target.value)
    }

    const grosorSetter = (event) => {
        setGrosor(Number(event.target.value))
    }

    async function finStep(datos) {
        const response = await fetch("http://localhost:4000/BlobPost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const texto = await response.text();
        console.log(response.status, texto);
        settl(true);
    }

    return (
        <>
            <canvas ref={canvasRef} width={600} height={400} style={{ backgroundColor: "white" }}
                onMouseDown={empezar}
                onMouseUp={parar}
                onMouseLeave={parar}
                onMouseMove={dibujar}
            />
            <Input type="color" onChange={colorSetter}
            />
            <Input type="range" min="1" max="15" onChange={grosorSetter}
            />
            <Button onClick={limpiar} txt="Limpiar" />
            <Button onClick={terminar} txt="TODO LISTO" />
        </>
    );
}