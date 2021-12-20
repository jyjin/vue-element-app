import { ENVIRONMENTS } from './constants'
const globalObj = {}

globalObj.from = {}
globalObj.from.env = ENVIRONMENTS[1].id // test
globalObj.from.envName = ENVIRONMENTS[1].name
globalObj.from.tenant = ''
globalObj.from.tenantName = ''

globalObj.to = {}
globalObj.to.env = ENVIRONMENTS[0].id   // dev
globalObj.to.envName = ENVIRONMENTS[0].name
globalObj.to.tenant = ''
globalObj.to.tenantName = ''

export default globalObj