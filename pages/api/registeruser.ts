import connection,{executeQuery} from '../../lib/database/connectDatabase';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';


export default async function userRegister(req:NextApiRequest,res:NextApiResponse){
if(req.method==='POST'){
try{
    // const query =  `insert into user(email,password,token)values(ritika@gmail.com,'1234','87698')`;
    console.log(req.body);
    const {email,password,token}=req.body;


    // insert
    // const query =  `insert into user(email,password,token)values('${email}','${password}','${token}')`;

    //retrive
    // const query=`select * from user;`//retreaving all user data

    //delete
    //  const query = `delete from user where email="ritika@gmail.com"`


    const findRecordsQuery=`select * from user_table where email='${email}'`;

    const UserData:any=await executeQuery(findRecordsQuery);
    // check if a particular user data is already in database
    if(UserData.length>0) return res.status(400).send({message: "user is already registered please login"});
    
    // encrypt the password then storing in database---------------------
    const salt=await bcrypt.genSalt();
    const hashedPassword=await bcrypt.hash(password,salt);
    console.log({hashedPassword});
    const queryToInsert =  `insert into user_table(email,password,token)values('${email}','${hashedPassword}','${token}')`;
    const response:any=await executeQuery(queryToInsert);

    // ===================================================================

    console.log({response});

    res.send({message:response,done:true});
 
}
catch(error){
    console.error("something went wrong logging in", error);
    res.status(500).send({ done: false });
}
}
else
{
    res.send({done:false});
}
}
  