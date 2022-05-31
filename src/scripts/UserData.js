export default function UserData(info){
    //user info data {id, name, phone, email, picture, location: {country, code, flag, currency}}
    this.info = info
    this.getUserInfo = () => {
        return this.info
    }
    this.setUserInfo = (data) => {
        this.info = data
    }
}