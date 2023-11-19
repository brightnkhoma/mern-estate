import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setComfirmDelete ,setDenyDelete} from "../redux/user/userSlice"
export const ComfirmDelete = ({toDelete})=>{
    const [comfirm, setComfirm] = useState(false)
    const dispatch = useDispatch()
    const { comfirmDelete } = useSelector(state => state.user)

    return(
        <span>
            {comfirmDelete ? <span className="text-red-500">Be carefull! 
            Your account will be deleted permanently <br />
            <div className="mt-3 flex gap-7">
            <button className="border py-2 px-3  bg-red-700 text-white  uppercase" onClick={toDelete}>comfirm</button>
            <button className="border py-2 px-3 rounded-md bg-gray-400 text-white " onClick={()=>dispatch(setDenyDelete())}>cancel</button>
            </div>

            </span> : <span className="text-red-700 cursor-pointer" onClick={()=>dispatch(setComfirmDelete())} >delete account</span>}
        </span>
    )
    
}