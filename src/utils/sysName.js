import {getSysName} from '@/api/public'
// import {getSysName} from "@/api/mockapi/public"

export function getSystemNameAsync() {

    return new Promise((resolve,reject)=>{
        getSysName().then(res=>{
            localStorage.setItem('system_name',res.data);
            resolve(res.data)
            console.log('getSystemNameAsync',res.data)
        }).catch(err=>{
            console.log(err,22);
        })
    })
}
