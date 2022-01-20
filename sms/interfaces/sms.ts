
export default interface Sms {
  id?: number,
  status?: string,
  message?:string,
  destination?: string,
  origin?: string,
  msisdn?: string,
  Text?: string
}