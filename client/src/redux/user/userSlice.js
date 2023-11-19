import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading : false,
    deleting  : false,
    comfirmDelete : false,
    
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers :{
        signInStart : (state, action)=>{            
            state.loading = true            
        },
        signInSuccess : (state, action)=>{
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure : (state, action)=>{
            state.error = action.payload
            state.loading = false
        },
        updateStart : (state, action)=>{            
            state.loading = true            
        },
        updateSuccess : (state, action)=>{
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        updateFailure : (state, action)=>{
            state.error = action.payload
            state.loading = false
        }
        ,
        deleteUserStart : (state, action)=>{            
            state.deleting = true            
        },
        deleteUserSuccess : (state)=>{
            state.currentUser = null
            state.deleting = false
            state.error = null
        },
        deleteUserFailure : (state, action)=>{
            state.error = action.payload
            state.deleting = false
        },
        setComfirmDelete : (state)=>{
            state.comfirmDelete = true
        },
        setDenyDelete : (state)=>{
            state.comfirmDelete = false
        }
    }

})

export const {signInStart, signInSuccess, signInFailure, updateFailure, updateSuccess, updateStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, setComfirmDelete, setDenyDelete} = userSlice.actions
export default userSlice.reducer