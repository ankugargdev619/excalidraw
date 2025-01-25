import axios from "axios";
import {HTTP_URL} from "@repo/environment/config";
import {WS_URL} from "@repo/environment/config";

async function getRoomId(slug:string){
    const response = await axios.get(`${HTTP_URL}/room/${slug}`);
    return response.data.id
}

export default async function ChatRoom({
    params
} : {
    params : {
        slug : string
    }
}){
    const slug = params.slug
    const roomId = await getRoomId(slug);
    return <>
    
    </>
}