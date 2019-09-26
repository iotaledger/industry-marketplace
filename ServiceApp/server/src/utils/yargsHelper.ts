import yargs from 'yargs';
import {simulate} from './simulationHelper';

const argv = yargs
.usage('Simulate SR or SP')
.example('$0  --role SR', 'simulate SR')
.required('role', 'Mode must be provided').describe('role', 'Simulates SR or SP. Options: ["SR", "SP"]')
.describe('role', 'Define user role. Options: ["SR", "SP"]')
.help('help')
.argv;

if (argv.role === 'SR') {
simulate('SR')
}
else if (argv.role === 'SP') {
simulate('SP')
}