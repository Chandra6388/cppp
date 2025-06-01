import axios from "axios"
import * as Config from "../../../Utils/config";

export const getEmailNotificationSettings = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getEmailNotificationSettings`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getWhatsappNotificationSettings = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getWhatsappNotificationSettings`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
 export const View = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}View`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}