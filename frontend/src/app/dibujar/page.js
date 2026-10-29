"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRef, useState,useEffect } from "react";
import styles from "./page.module.css";
export default function Draw() {
    const [color, setColor] = useState("#000000");
    const [grosor, setGrosor] = useState(5)
    const [datos, setDatos] = useState({});
    const canvasRef = useRef(null);
    const dibujando = useRef(false);
    const ultimo = useRef({ x: 0, y: 0 });
    const [tiempo,setTiempo] = useState(60)
    const circunferencia = 2 * Math.PI * 9 

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

    let user=sessionStorage.getItem("user")

    function terminar() {
        const guardado = canvasRef.current.toDataURL("image/png", 0.8);
        setDatos({ link: guardado, user: user });
        socket
    }
    
    function socket() {
        socket.emit("terminado",datos)//terminado
    }

    const colorSetter = (event) => {
        setColor(event.target.value)
    }

    const grosorSetter = (event) => {
        setGrosor(Number(event.target.value))
    }

/*    useEffect(() => {
        const timer = setInterval(() => setTiempo(prev => prev - 1), 1000);
        return () => clearInterval(timer); // cleanup
    }, []);
    useEffect(() => {
        if(tiempo === 0){
            router.replace("http://localhost:3000/dibujar")
        }
    })

     const fraccion = tiempo/60*/
    return (
        <>  
            <header>
                {/*<svg
                    className={styles.cronometro}
                    viewBox="0 0 64 64"
                    role="img"
                    aria-label={`Quedan ${tiempo} segundos`}
                >
                    <rect x="25" y="2" width="14" height="6" rx="2" fill="white" />
                    <rect x="29" y="8" width="6" height="6" fill="white" />
                    <rect x="49" y="12" width="10" height="5" rx="2" fill="white" transform="rotate(45 54 14.5)" />
                    <circle cx="32" cy="38" r="22" fill="none" stroke="white" strokeWidth="5" />
                    <circle
                        className={styles.pie}
                        cx="32" cy="38" r="9"
                        fill="none"
                        stroke="white"
                        strokeWidth="18"
                        strokeDasharray={`${fraccion * circunferencia} ${circunferencia}`}
                        transform="rotate(-90 32 38)"
                    />
                </svg> */}
            </header>
            <canvas ref={canvasRef} width={600} height={400} style={{ backgroundColor: "white" }}
                onMouseDown={empezar}
                onMouseUp={parar}
                onMouseLeave={parar}
                onMouseMove={dibujar}
            />
            <input type="color" onChange={colorSetter}/>
            <input type="range" value={grosor} step="1" min="1" max="20" onChange={grosorSetter}/>
            <Button onClick={limpiar} txt="Limpiar" />
            <Button onClick={terminar} txt="TODO LISTO" />
        </>
    );
}