import axios from 'axios'

const baseApi = `https://api.marketplace.tangle.works/location`
function toAddress(locObj) {
  // waiting for Alexey
}
const locationFormats = [
                        {
                          name: 'Area Code',
                          action: async (sendMessage, packet) => await sendMessage('config', packet)
                        },
                        {
                          name: 'Address',
                          action: async (sendMessage, packet) => {
                            //convert fist
                            const res = await axios.get(`${baseApi}?address=${packet}`)
                            const ica = res.data
                            return await sendMessage('/config', ica)
                          }
                         },
                        {
                          name: 'GPS Coordinates',
                          action: async (sendMessage, packet) => {
                            //convert fist
                            return await sendMessage('/config', packet)
                          }
                        }
                       ]

export default locationFormats
