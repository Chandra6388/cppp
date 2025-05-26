import { io } from "socket.io-client";
import * as Config from "../Utils/config";

const socket = io(`${Config.base_url}`);

export default socket;
