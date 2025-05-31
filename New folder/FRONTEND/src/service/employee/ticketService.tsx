import axios from "axios"
import * as Config from "../../../Utils/config";

export const getAllTicket = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllTicket`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
 
export const getChatHistory = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getChatHistory`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 