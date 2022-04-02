import { IUser } from '../../api/common/interfaces/user-interface';



class UserContextClient {

    getUserInfo(): Promise<IUser> {
        const uri = `/.auth/me`
        return new Promise((resolve) => {
            fetch(uri, { method: "GET" })
            .then(response => {
                return response.json()}
                )
            .then(json => resolve(json.clientPrincipal));
        });   
    }
}

export default UserContextClient;
