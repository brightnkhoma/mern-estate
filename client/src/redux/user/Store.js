import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import storage from "redux-persist/lib/storage"
//import persistReducer from "redux-persist/es/persistReducer"
import{ persistReducer, persistStore }from "redux-persist"

const rootReducer = combineReducers({user : userSlice})
const persistConfig = {
    key : 'root',
    storage,
    version : 1,
}
const persistedReducer =  persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer : persistedReducer,    
    middleware : (getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck : false,
        })  
},  
    )


export const persistor = persistStore(store)