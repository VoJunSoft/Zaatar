
export default function UserData(){
    //user info data {id, name, phone, email, picture, location: {country, code, flag, currency}}
    this.info = 'name';
    Object.defineProperty(this, 'info',{
        get: function(){
            return info;
        },
        set: function(value){
            info = value
        }
    })

}