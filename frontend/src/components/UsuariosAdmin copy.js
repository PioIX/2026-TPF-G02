export default function UsuariosAdmin({usuario,email,bloqueado,control}){
    function status(){
        if(bloqueado === 0){
            return(
                <>
                    <p>Activo</p>
                </>
            )
        }else{
            <>
                <p>Bloqueado</p>
            </>
        }
    }
    return(
        <div>
            <p>{usuario}</p>
            <p>{email}</p>
            {
                status()
            }
            <button onClick={control}>Desbloquear</button>
        </div>
    )
}