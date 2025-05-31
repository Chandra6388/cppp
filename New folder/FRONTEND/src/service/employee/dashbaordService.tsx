import axios from "axios"
import * as Config from "../../../Utils/config";

export const getDashboardData = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getDashboardData`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
 
 