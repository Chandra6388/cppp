import axios from "axios"
import * as Config from "../../../Utils/config";

export const get_All_Notification = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllNotification`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 