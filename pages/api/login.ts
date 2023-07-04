import { NextApiRequest,NextApiResponse } from "next";
import { executeQuery } from "@/lib/database/connectDatabase";
import { generateJwtToken,refreshAccessToken } from "@/lib/server";
import bcrypt from 'bcrypt';
export default async function login(req:NextApiRequest,res:NextApiResponse){
 if(req.method==='POST'){
   try{
      const {email,password}=req.body;
      const getRecordQuery=`select * from user where email='${email}'`;
      const getRecord:any=await executeQuery(getRecordQuery);
    
      if(getRecord.length==0){
        res.status(404).send({message:"user not found please register and try again to login"});

      }
    // password verification
    const match:boolean=await bcrypt.compare(password,getRecord[0].password);
    if(!match){
        return res.status(400).send({message:"entered password is incorrect"});
    }
    // password matched then generate token and send 
    let user:any={email:email as string,password:password as string};
    // jwt token is generated
    let JWTtoken=generateJwtToken(user);
    // jwt refresh token is generated:-used to renew the jwt token
    const JWTrefreshtoken=refreshAccessToken({user});
    res.status(200).send({JWTtoken,JWTrefreshtoken,message:{done:true}});
   }
   catch(error){
    res.status(400).send({done:false});
   }
 }
 else
 {
    res.send({done:false});
 }
}