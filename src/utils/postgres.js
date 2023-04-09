import pg from 'pg'
import { config } from 'dotenv'
config()

const {Pool} = pg


const pool = new Pool({
    connectionString: process.env.CONNECTIONSTRING
})

export async function FetchData(SQL, ...params){
    const client = await pool.connect()
    try {
        const {rows} = await client.query(SQL, params.length ? params: null)
        return rows
    } catch (error) {
      throw new Error(error)  
    }finally{
        client.release()
    }
}