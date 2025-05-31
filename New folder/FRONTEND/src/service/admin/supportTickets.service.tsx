import axios from "axios"
import * as Config from "../../../Utils/config";

export const allTickets = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}allTickets`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 

export const assigneToSupport = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}assigneToSupport`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 


export const changeStatus = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}changeStatus`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
export const getAllEmployees = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllEmployees`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 