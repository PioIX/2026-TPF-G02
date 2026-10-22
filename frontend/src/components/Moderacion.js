export default function Moderacion({nombre,tipo,data,borrar}){
    const imgOTxt = () =>{
        if(tipo === 0){
            <>
                <p>Dibujo</p>
                <img src={data}/>
            </>
    }else{
        <>
            <p>Frase</p>
            <p>{data}</p>
        </>
    }}
    return(
        <div>
            <p>{nombre}</p>
            {
                imgOTxt()
            }
            <button onClick={borrar}>Borrar</button>
        </div>
    )
}