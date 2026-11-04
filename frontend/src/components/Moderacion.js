import styles from "./Moderacion.module.css"
export default function Moderacion({nombre,tipo,data,borrar}){
    const imgOTxt = () =>{
        const text = Boolean(tipo)
        if(text){
            return(
            <>
                <p className={styles.tipo}>Frase</p>
                <p className={styles.contenido}>{data}</p>

            </>)
        }else{
            return(
            <>
                <p className={styles.tipo}>Dibujo</p>
                <img src={data}/>
            </>)
    }}
    return(
        <div className={styles.fila}>
            <p  className={styles.autor}>{nombre}</p>
            {
                imgOTxt()
            }
            <button className={styles.borrar} onClick={borrar}>Borrar</button>
        </div>
    )
}