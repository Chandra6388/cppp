import axios from "axios"
import * as Config from "../../../Utils/config";

export const getAllContactUsFrom = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllContactUsFrom`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 

 
 