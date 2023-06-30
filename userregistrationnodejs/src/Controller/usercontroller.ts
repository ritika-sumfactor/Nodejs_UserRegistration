import { executeQuery } from '../Database/connectDatabase'
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { generateAcessToken, refreshAcessToken } from '../util/service'



export const userRegistration = async (req: any, res: any) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log(req.body, "in body")
            console.log("🚀 ~ file: userController.ts:13 ~ returnnewPromise ~ req.body:", Object.keys(req.body))

            if (Object.keys(req.body).length == 0) return res.status(404).send({ message: "No json body found" })

            let { f_name, l_name, email, password, token } = req.body

            const getRecord = `select * from user_table where email='${email}'`

            let resulset: any = await executeQuery(getRecord)

            if (resulset.length > 0) return res.status(400).send({ message: "User Already Registered please login " })

            const salt = await bcrypt.genSalt();

            const hashedPassword = await bcrypt.hash(password, salt)

            const sqlQuery = `insert into user_table (f_name,l_name,email,password,token)values('${f_name}','${l_name}','${email}','${hashedPassword}','${token}')`

            let response = await executeQuery(sqlQuery)

            console.log("🚀 ~ file: userController.ts:13 ~ returnnewPromise ~ response:", response)

            return resolve(response)

        } catch (error) {
            console.log("🚀 ~ file: userController.ts:19 ~ returnnewPromise ~ error:", error)
            return reject(error)
        }
    })
}



export const userlogin = async (req: any, res: any) => {
    return new Promise(async (resolve, reject) => {
        try {

            let { email, password } = req.body

            const getRecord = `select * from user_table where email='${email}'`

            let resulset: any = await executeQuery(getRecord)

            if (resulset.length == 0) return res.status(404).send({ message: "user Not Found Please Register and try again to login" })

            const match: boolean = await bcrypt.compare(password, resulset[0].password)

            if (match == false) return res.status(400).send("Entered Password is Incorrect")

            let user: any = { email: email as string, password: password as string }

            let acessToken = generateAcessToken(user)

            console.log("🚀 ~ file: userController.ts:60 ~ returnnewPromise ~ acessToken:", acessToken)

            let refreshToken = refreshAcessToken({ user: user })

            console.log("🚀 ~ file: userController.ts:64 ~ returnnewPromise ~ refreshToken:", refreshToken)

            return resolve({ message: "User Sucessfully Logged in", data: resulset, acessToken: acessToken, refreshToken: refreshToken })

        } catch (error) {
            console.log("🚀 ~ file: userController.ts:44 ~ returnnewPromise ~ error:", error)
        }
    })
}




export const getAllUser = async (req: any, res: any) => {
    return new Promise(async (resolve, reject) => {
        try {

            const getRecord = `select * from user_table;`

            let resulset: any = await executeQuery(getRecord)

            return resolve(resulset)

        } catch (error) {
            console.log("🚀 ~ file: userController.ts:89 ~ returnnewPromise ~ error:", error)

        }
    })
}



export const refreshToken = async (req: any, res: any) => {

    return new Promise(async (resolve, reject) => {
        try {

            let { token, email } = req.body

            if (token == null) return res.sendStatus(401)

            const getRecord = `select * from user_table where email='${email}';`

            let resulset: any = await executeQuery(getRecord)
            console.log("🚀 ~ file: userController.ts:109 ~ returnnewPromise ~ resulset:", resulset)

            if (resulset.length == 0) return res.sendStatus(403)

            jwt.verify(token, process.env.REFRESH_TOKEN_SECERET as string, (error: unknown, response: unknown) => {

                if (error) return res.sendStatus(403)

                const acessToken: string = generateAcessToken({ email: resulset[0].email, password: resulset[0].password })

                // res.json({ token: `Bearer ${acessToken}` })

                return resolve({ token: `Bearer ${acessToken}` })
            })

        } catch (error) {
            console.log("🚀 ~ file: userController.ts:103 ~ returnnewPromise ~ error:", error)
            res.json({ error: error })
        }
    })

}

