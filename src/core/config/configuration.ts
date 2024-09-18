export type IConfiguration = {
    baseKeys:{
        port: number
        poke_api_base_url: string
    }
}
export default (): IConfiguration => ({
    baseKeys: {
        port: process.env.PORT ? Number(process.env.PORT) : 3000,
        poke_api_base_url: process.env.POKE_API_BASE_URL
    }
})